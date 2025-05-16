export interface ChatMessage {
  id: string;
  sender: string;
  timestamp: string;
  date: Date;
  content: string;
  isMedia: boolean;
  mediaType?: string;
  mediaName?: string;
  mediaUrl?: string;
  isEmoji: boolean;
}

export interface ParsedChat {
  messages: ChatMessage[];
  participants: string[];
  isGroup: boolean;
  groupName?: string;
}

interface MediaMap {
  [key: string]: string; // dosya adı -> base64 URL
}

// Medya dosyasının tipini belirleyen yardımcı fonksiyon
function getMediaType(filename: string): string {
  const lowerName = filename.toLowerCase();
  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.png') || lowerName.endsWith('.webp')) {
    return 'image';
  } else if (lowerName.endsWith('.gif')) {
    return 'gif';
  } else if (lowerName.endsWith('.mp4') || lowerName.endsWith('.avi') || lowerName.endsWith('.mov')) {
    return 'video';
  } else if (lowerName.endsWith('.mp3') || lowerName.endsWith('.ogg') || lowerName.endsWith('.wav')) {
    return 'audio';
  } else if (lowerName.endsWith('.pdf') || lowerName.endsWith('.doc') || lowerName.endsWith('.docx') || lowerName.endsWith('.txt')) {
    return 'document';
  }
  return 'unknown';
}

export function parseWhatsAppChat(text: string, mediaFiles?: MediaMap): ParsedChat {
  const lines = text.split(/\r?\n/);
  const messages: ChatMessage[] = [];
  const participants = new Set<string>();
  let isGroup = false;
  let groupName = '';
  let currentMessage: Partial<ChatMessage> | null = null;
  
  // WhatsApp sohbet formatını belirleme ve parse etme
  // Format 1 (Eski format): gün.ay.yıl saat:dakika - Gönderen: Mesaj
  // Format 2 (Yeni format): [gün.ay.yıl saat:dakika:saniye] Gönderen: Mesaj
  const messageRegexFormat1 = /^(\d{1,2}\.\d{1,2}\.\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.*)$/;
  const messageRegexFormat2 = /^\[(\d{1,2}\.\d{1,2}\.\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.*)$/;
  const systemMessageRegexFormat1 = /^(\d{1,2}\.\d{1,2}\.\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*(.*)$/;
  const systemMessageRegexFormat2 = /^\[(\d{1,2}\.\d{1,2}\.\d{2,4})\s+(\d{1,2}:\d{2}(?::\d{2})?)\]\s*(.*)$/;
  
  // Medya dosyası adı regex'i - WhatsApp'ın medya dosyasına verdiği isim formatını tanımlar
  const mediaFilenameRegex = /IMG-\d{8}-WA\d{4}|VIDEO-\d{8}-WA\d{4}|PTT-\d{8}-WA\d{4}|[\w-]+(?:\.jpg|\.jpeg|\.png|\.gif|\.mp4|\.webp|\.mp3|\.pdf|\.ogg)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Her iki format için de mesaj eşleşmesi kontrolü
    const messageMatchFormat1 = line.match(messageRegexFormat1);
    const messageMatchFormat2 = line.match(messageRegexFormat2);
    const messageMatch = messageMatchFormat1 || messageMatchFormat2;
    
    if (messageMatch) {
      // Eğer önceki mesaj varsa, onu kaydet
      if (currentMessage && currentMessage.sender && currentMessage.timestamp) {
        messages.push(currentMessage as ChatMessage);
      }
      
      const [, date, time, sender, content] = messageMatch;
      const cleanSender = sender.trim();
      participants.add(cleanSender);
      
      // Medya içeriği kontrolü
      const isMedia = content.includes('<Media omitted>') || 
                     content.includes('<Medya dahil edilmedi>') ||
                     content.includes('<Çıkartma dahil edilmedi>') ||
                     content.includes('image omitted') ||
                     content.includes('video omitted') ||
                     content.includes('sticker omitted') ||
                     content.includes('audio omitted') ||
                     content.includes('document omitted') ||
                     content.includes('resim dahil edilmedi') ||
                     content.includes('video dahil edilmedi') ||
                     content.includes('ses dahil edilmedi') ||
                     content.includes('belge dahil edilmedi') ||
                     content.includes('GIF dahil edilmedi') ||
                     content.includes('GIF omitted') ||
                     content.includes('görsel dahil edilmedi');
      
      let mediaType: string | undefined = undefined;
      let mediaName: string | undefined = undefined;
      let mediaUrl: string | undefined = undefined;
      
      if (isMedia) {
        if (content.includes('image') || content.includes('resim') || content.includes('görsel')) {
          mediaType = 'image';
        } else if (content.includes('video')) {
          mediaType = 'video';
        } else if (content.includes('sticker') || content.includes('çıkartma')) {
          mediaType = 'sticker';
        } else if (content.includes('audio') || content.includes('ses')) {
          mediaType = 'audio';
        } else if (content.includes('document') || content.includes('belge')) {
          mediaType = 'document';
        } else if (content.includes('GIF')) {
          mediaType = 'gif';
        } else {
          mediaType = 'unknown';
        }
        
        // Medya dosya adını bulma girişimi
        const mediaNameMatch = content.match(mediaFilenameRegex);
        if (mediaNameMatch) {
          mediaName = mediaNameMatch[0];
          
          // Eğer medya dosyaları varsa ve bu medya dosyasının adı eşleşiyorsa
          if (mediaFiles && mediaName) {
            // Tam eşleşme kontrolü
            if (mediaFiles[mediaName]) {
              mediaUrl = mediaFiles[mediaName];
            } else {
              // Kısmi eşleşme kontrolü (dosya adı içinde arama)
              const possibleMatch = Object.keys(mediaFiles).find(key => 
                key.toLowerCase().includes(mediaName!.toLowerCase()) || 
                mediaName!.toLowerCase().includes(key.toLowerCase())
              );
              
              if (possibleMatch) {
                mediaUrl = mediaFiles[possibleMatch];
                mediaName = possibleMatch; // Eşleşen dosya adını kullan
              } else {
                // Dosya adı doğrudan eşleşmiyorsa, mesajın tarih ve saatine göre eşleşme dene
                // WhatsApp genellikle medya dosyalarını gönderildiği zamana göre adlandırır
                const messageDate = parseTurkishDate(date, time);
                const messageDay = messageDate.getDate().toString().padStart(2, '0');
                const messageMonth = (messageDate.getMonth() + 1).toString().padStart(2, '0');
                const messageYear = messageDate.getFullYear().toString();
                
                // Format: yılaygun
                const datePart = `${messageYear}${messageMonth}${messageDay}`;
                
                // Bu tarihe göre dosyaları ara
                const dateMatch = Object.keys(mediaFiles).find(key => 
                  key.includes(datePart)
                );
                
                if (dateMatch) {
                  mediaUrl = mediaFiles[dateMatch];
                  mediaName = dateMatch;
                }
              }
            }
            
            // Eğer URL varsa, doğru medya tipini belirle
            if (mediaUrl) {
              if (!mediaType || mediaType === 'unknown') {
                mediaType = getMediaType(mediaName);
              }
            }
          }
        } else {
          // Dosya adı bulunamadıysa ve medya dosyaları varsa
          // En yakın tarihli medya dosyasını bulmayı dene
          if (mediaFiles && Object.keys(mediaFiles).length > 0) {
            const messageDate = parseTurkishDate(date, time);
            
            // Tarih farkına göre medya dosyalarına bak
            let bestMatch: string | null = null;
            
            // Bu tarihte gönderilen medya dosyalarından birini bul
            const formattedDate = messageDate.toISOString().split('T')[0].replace(/-/g, '');
            
            for (const key of Object.keys(mediaFiles)) {
              // Bu tarihte gönderilen bir dosya mı?
              if (key.includes(formattedDate)) {
                bestMatch = key;
                break;
              }
              
              // Tarih eşleşmesi yoksa, en yakın dosya tipine göre bir tahmin yap
              if (mediaType) {
                const keyType = getMediaType(key);
                if (keyType === mediaType) {
                  bestMatch = key;
                  break;
                }
              }
            }
            
            if (bestMatch) {
              mediaUrl = mediaFiles[bestMatch];
              mediaName = bestMatch;
              
              // Eğer mediaType henüz belirlenmemişse belirle
              if (!mediaType || mediaType === 'unknown') {
                mediaType = getMediaType(bestMatch);
              }
            }
          }
        }
      }
      
      // Emoji kontrolü - eğer mesaj sadece emoji içeriyorsa
      const emojiRegex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
      const isEmoji = emojiRegex.test(content);
      
      // Son kısım için timestamp formatını ayarla
      const timestamp = messageMatchFormat2 ? `[${date} ${time}]` : `${date} ${time}`;
      const formattedDate = parseTurkishDate(date, time);
      
      currentMessage = {
        id: `msg_${i}`,
        sender: cleanSender,
        timestamp,
        date: formattedDate,
        content,
        isMedia,
        mediaType,
        mediaName,
        mediaUrl,
        isEmoji
      };
      
    } else {
      // Her iki format için sistem mesajı eşleşmesi kontrolü
      const systemMatchFormat1 = line.match(systemMessageRegexFormat1);
      const systemMatchFormat2 = line.match(systemMessageRegexFormat2);
      const systemMatch = systemMatchFormat1 || systemMatchFormat2;
      
      if (systemMatch) {
        const systemContent = systemMatch[3];
        
        // Grup adı belirleme
        if (systemContent.includes('created group') || systemContent.includes('grup oluşturdu')) {
          isGroup = true;
          const groupNameMatch = systemContent.match(/["'](.+?)["']/);
          if (groupNameMatch) {
            groupName = groupNameMatch[1];
          }
        }
        
        // Bilgilendirme mesajları (grup değişikliği, telefon değişikliği vb.)
        // Doğru timestamp formatını kullan
        let timestamp = "";
        if (systemMatchFormat1) {
          timestamp = `${systemMatch[1]} ${systemMatch[2]}`;
        } else {
          timestamp = `[${systemMatch[1]} ${systemMatch[2]}]`;
        }
        
        const systemMessageObj = {
          id: `system_${i}`,
          sender: 'System',
          timestamp,
          date: parseTurkishDate(systemMatch[1], systemMatch[2]),
          content: systemContent,
          isMedia: false,
          isEmoji: false
        };
        
        messages.push(systemMessageObj as ChatMessage);
        currentMessage = null;
        
      } else if (currentMessage) {
        // Çok satırlı mesaj - önceki mesaja ekle
        currentMessage.content += `\n${line}`;
      }
    }
  }
  
  // Son mesajı ekleme
  if (currentMessage && currentMessage.sender && currentMessage.timestamp) {
    messages.push(currentMessage as ChatMessage);
  }
  
  return {
    messages,
    participants: Array.from(participants),
    isGroup,
    groupName: groupName || undefined
  };
}

function parseTurkishDate(dateStr: string, timeStr: string): Date {
  // Türkçe format: gün.ay.yıl
  let day, month, year;
  
  const dateParts = dateStr.split('.');
  if (dateParts.length === 3) {
    day = parseInt(dateParts[0]);
    month = parseInt(dateParts[1]) - 1; // JavaScript'te aylar 0-11 arasındadır
    year = parseInt(dateParts[2]);
    
    // Yıl 2 haneli ise, 2000'li yıllar olarak ele al
    if (year < 100) {
      year += 2000;
    }
  } else {
    // Geçersiz tarih formatı durumunda bugünü kullan
    const today = new Date();
    day = today.getDate();
    month = today.getMonth();
    year = today.getFullYear();
  }
  
  // Saat ve dakikayı ayırma
  const timeParts = timeStr.split(':');
  const hour = parseInt(timeParts[0]);
  const minute = parseInt(timeParts[1]);
  const second = timeParts.length > 2 ? parseInt(timeParts[2]) : 0;
  
  return new Date(year, month, day, hour, minute, second);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

// Zaman damgasını (timestamp) orijinal formatta geri döndürür
export function formatTimestampInOriginalFormat(date: Date, originalTimestamp: string): string {
  // Eğer zaman damgası köşeli parantez ile başlıyorsa, ikinci formatı kullan
  if (originalTimestamp.startsWith('[')) {
    return `[${formatDate(date)} ${date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })}]`;
  } else {
    // Aksi halde birinci formatı kullan
    return `${formatDate(date)} ${formatTime(date)}`;
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('tr-TR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

// Emoji için özel stil uygulama
function addEmojiSpan(content: string): string {
  // Daha kapsamlı emoji regex - emoji-regex kütüphanesine benzer geniş bir kapsam sağlar
  const emojiRegex = /[\u{1F000}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F100}-\u{1F1FF}\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F0}\u{23F3}\u{267F}\u{267B}\u{2734}\u{2733}\u{2747}\u{203C}\u{2049}\u{2139}\u{2611}\u{2612}\u{2714}-\u{2716}\u{2795}-\u{2797}\u{27B0}\u{27BF}\u{2734}\u{203C}\u{2049}\u{2139}]/gu;
  
  // Metin içindeki emoji olmayan Unicode karakterleriyle karışabilecek karakterleri kontrol et
  // Bu sadece tam emoji olan karakterlere uygulanacak
  const result = content.replace(emojiRegex, match => {
    return `<span class="text-xl inline-block align-middle">${match}</span>`;
  });
  
  // Emoji kombinasyonları ve varyasyonlar için
  return result.replace(/(?:\uD83D[\uDC68\uDC69])(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2695\u2696\u2708]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3]|\uD83D[\uDC68\uDC69]\u200D\uD83D[\uDC66\uDC67]))/g, match => {
    return `<span class="text-xl inline-block align-middle">${match}</span>`;
  });
}

// Metin içindeki emojileri daha iyi tespit eden yardımcı fonksiyon
export function formatMessageContent(content: string): string {
  // URL'leri tıklanabilir bağlantılara dönüştürme
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Yaygın yüz emojileri için Unicode emoji dönüşümleri
  const emojiMap: Record<string, string> = {
    ":)": "😊",
    ":-)" : "😊",
    ":(" : "😔",
    ":-(" : "😔",
    ";)" : "😉",
    ";-)" : "😉",
    ":D" : "😃",
    ":-D" : "😃",
    ":|" : "😐",
    ":-|" : "😐",
    ":/" : "😕",
    ":-/" : "😕",
    ":P" : "😛",
    ":-P" : "😛",
    ":p" : "😛",
    ":-p" : "😛",
    ":*" : "😘",
    ":-*" : "😘",
    "<3" : "❤️",
    ":heart:" : "❤️",
    ":+1:" : "👍",
    ":-1:" : "👎"
  };
  
  // ASCII temelli emojileri Unicode emoji karakterlerine dönüştür
  let processedContent = content;
  for (const [asciiEmoji, unicodeEmoji] of Object.entries(emojiMap)) {
    // Kelimeler içinde olmayan tam eşleşmeleri dönüştür
    const emojiRegex = new RegExp(`(^|\\s)${escapeRegExp(asciiEmoji)}($|\\s)`, 'g');
    processedContent = processedContent.replace(emojiRegex, `$1${unicodeEmoji}$2`);
  }
  
  // Emojileri span içine al ve URL'leri işle
  const emojiReplaced = addEmojiSpan(processedContent);
  return emojiReplaced.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline">$1</a>');
}

// Regex içinde kullanılacak metni escape eden yardımcı fonksiyon
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
} 
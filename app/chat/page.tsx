'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '../../components/ThemeToggle';
import { getMediaFile } from '../../lib/indexedDb';
import { openWhatsAppDB } from '../../lib/indexedDb';
import { parseWhatsAppChat, formatMessageContent, formatTimestampInOriginalFormat, ParsedChat, ChatMessage } from '../../lib/chatParser';

// MessageItem bileşeni - bir sohbet mesajını görüntüler
interface MessageItemProps {
  message: ChatMessage;
  index: number;
  filteredMessages: ChatMessage[];
  isLastMessage: boolean;
  lastMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  showSenderName: boolean;
  showDateHeader: boolean;
  currentUserIdentity: string | null;
  openMediaPreview: (url: string) => void;
  loadMediaIfNeeded: (mediaName: string) => Promise<string | undefined>;
  chatContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  chatData: ParsedChat | null;
  setChatData: React.Dispatch<React.SetStateAction<ParsedChat | null>>;
  createMarkup: (content: string) => { __html: string };
  formatDateHeader: (date: Date) => string;
}

const MessageItem = ({ 
  message, 
  index, 
  filteredMessages, 
  isLastMessage, 
  lastMessageRef,
  showSenderName,
  showDateHeader,
  currentUserIdentity,
  openMediaPreview,
  loadMediaIfNeeded,
  chatContainerRef,
  chatData,
  setChatData,
  createMarkup,
  formatDateHeader
}: MessageItemProps) => {
  const prevMessage = index > 0 ? filteredMessages[index - 1] : null;
  const isSameGroup = !showSenderName && prevMessage && 
                    (message.date.getTime() - prevMessage.date.getTime()) < 300000; // 5 dakikadan az fark
  
  // Sistem mesajları
  if (message.sender === 'System') {
    return (
      <div key={message.id} className="my-2 sm:my-3 flex justify-center">
        <div className="bg-white dark:bg-[#111111] px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }
  
  // Tarih başlığı
  const dateHeader = showDateHeader && (
    <div className="my-2 sm:my-3 flex justify-center">
      <div className="bg-[#25D366] dark:bg-emerald-700 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs text-white font-medium shadow-sm">
        {formatDateHeader(message.date)}
      </div>
    </div>
  );
  
  // Normal kullanıcı mesajları
  const isSentByMe = currentUserIdentity === message.sender;
  
  return (
    <div 
      ref={isLastMessage ? lastMessageRef : null}
      key={message.id} 
      className={`${isSameGroup ? 'mt-1' : 'mt-3 sm:mt-4'}`}
    >
      {showDateHeader && dateHeader}
      
      {showSenderName && !isSentByMe && (
        <div className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-500 ml-2 mb-0.5 sm:mb-1">
          {message.sender}
        </div>
      )}
      
      <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
        <div 
          className={`relative max-w-[90%] sm:max-w-[85%] md:max-w-[70%] rounded-2xl px-3 sm:px-3.5 py-2 sm:py-2.5 shadow-sm
            ${isSentByMe 
              ? 'bg-[#dcf8c6] dark:bg-emerald-700 text-gray-800 dark:text-white rounded-tr-none' 
              : 'bg-white dark:bg-[#111111] text-gray-800 dark:text-white rounded-tl-none'
            }
            ${message.isEmoji ? 'text-3xl sm:text-4xl bg-transparent dark:bg-transparent shadow-none px-1' : ''}
          `}
        >
          {/* Mesaj üçgeni */}
          {!message.isEmoji && (
            <div 
              className={`absolute top-0 ${isSentByMe ? 'right-0 -mr-2' : 'left-0 -ml-2'} w-2 h-2 overflow-hidden`}
            >
              <div 
                className={`absolute transform rotate-45 w-3 h-3 ${
                  isSentByMe 
                    ? 'bg-[#dcf8c6] dark:bg-emerald-700' 
                    : 'bg-white dark:bg-[#111111]'
                }`}
                style={{ top: '1px', left: isSentByMe ? '-3px' : '1px' }}
              ></div>
            </div>
          )}
          
          {message.isMedia ? (
            message.mediaUrl ? (
              <div>
                {message.mediaType === 'image' && (
                  <div 
                    className="cursor-pointer relative"
                    onClick={() => {
                      if (message.mediaUrl) {
                        openMediaPreview(message.mediaUrl);
                      } else if (message.mediaName) {
                        // Eğer medya URL'si yoksa ama adı varsa, yüklemeyi dene
                        loadMediaIfNeeded(message.mediaName).then(url => {
                          if (url) openMediaPreview(url);
                        });
                      }
                    }}
                  >
                    <Image 
                      src={message.mediaUrl} 
                      alt="Görsel" 
                      className="rounded-lg max-w-full max-h-48 sm:max-h-60 object-contain mb-1 sm:mb-2"
                      width={300}
                      height={200}
                      style={{ maxHeight: '15rem', width: 'auto' }}
                      unoptimized
                      onLoad={() => {
                        // Resim yüklendiğinde konteyner yüksekliğini güncelle
                        if (chatContainerRef.current) {
                          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                      }}
                    />
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      Görsel: {message.mediaName || 'Resim'}
                    </div>
                  </div>
                )}
                
                {message.mediaType === 'gif' && (
                  <div 
                    className="cursor-pointer"
                    onClick={() => {
                      if (message.mediaUrl) {
                        openMediaPreview(message.mediaUrl);
                      } else if (message.mediaName) {
                        loadMediaIfNeeded(message.mediaName).then(url => {
                          if (url) openMediaPreview(url);
                        });
                      }
                    }}
                  >
                    <Image 
                      src={message.mediaUrl} 
                      alt="GIF" 
                      className="rounded-lg max-w-full max-h-48 sm:max-h-60 object-contain mb-1 sm:mb-2"
                      width={300}
                      height={200}
                      style={{ maxHeight: '15rem', width: 'auto' }}
                      unoptimized
                      onLoad={() => {
                        if (chatContainerRef.current) {
                          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                      }}
                    />
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                      GIF: {message.mediaName || 'Animasyon'}
                    </div>
                  </div>
                )}
                
                {message.mediaType === 'video' && (
                  <div className="rounded-lg overflow-hidden">
                    <video 
                      src={message.mediaUrl} 
                      controls 
                      className="max-w-full max-h-48 sm:max-h-60 object-contain cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (message.mediaUrl) {
                          openMediaPreview(message.mediaUrl);
                        } else if (message.mediaName) {
                          loadMediaIfNeeded(message.mediaName).then(url => {
                            if (url) openMediaPreview(url);
                          });
                        }
                      }}
                      onLoadedData={() => {
                        if (chatContainerRef.current) {
                          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                      }}
                    ></video>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Video: {message.mediaName || 'Video'}
                    </div>
                  </div>
                )}
                
                {message.mediaType === 'audio' && (
                  <div className="rounded-lg overflow-hidden">
                    <audio 
                      src={message.mediaUrl} 
                      controls 
                      className="w-full max-w-[200px] sm:max-w-[250px]"
                      onLoadedData={() => {
                        if (chatContainerRef.current) {
                          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                      }}
                    ></audio>
                    <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ses: {message.mediaName || 'Ses kaydı'}
                    </div>
                  </div>
                )}
                
                {message.mediaType === 'document' && (
                  <div className="flex items-center">
                    <div className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-2 sm:mr-3">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <a 
                        href={message.mediaUrl} 
                        download={message.mediaName}
                        className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {message.mediaName || 'Belge'}
                      </a>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Belgeyi indirmek için tıklayın
                      </div>
                    </div>
                  </div>
                )}
                
                {message.mediaType === 'unknown' && message.mediaUrl && (
                  <div className="flex items-center">
                    <div className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-2 sm:mr-3">
                      <svg className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <a 
                        href={message.mediaUrl} 
                        download={message.mediaName}
                        className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {message.mediaName || 'Medya dosyası'}
                      </a>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Dosyayı indirmek için tıklayın
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // eğer mediaUrl yoksa ama mediaName varsa, lazy loading ile yükleyelim
              <div>
                {message.mediaName && (
                  <div className="flex items-center">
                    <div className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-2 sm:mr-3">
                      <svg 
                        className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500 animate-pulse" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        {message.mediaType === 'image' && (
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        )}
                        {message.mediaType === 'video' && (
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                          />
                        )}
                      </svg>
                    </div>
                    <div>
                      <button 
                        onClick={() => {
                          if (message.mediaName) {
                            // Tıklandığında medyayı yükle
                            loadMediaIfNeeded(message.mediaName).then(url => {
                              if (url && message.mediaName) {
                                // ChatData'daki ilgili mesajı güncelle
                                if (chatData) {
                                  const updatedMessages = chatData.messages.map(m => 
                                    m.id === message.id ? { ...m, mediaUrl: url } : m
                                  );
                                  setChatData({
                                    ...chatData,
                                    messages: updatedMessages
                                  });
                                }
                              }
                            });
                          }
                        }}
                        className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Medya dosyasını yükle: {message.mediaName}
                      </button>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Görüntülemek için tıklayın
                      </div>
                    </div>
                  </div>
                )}
                
                {!message.mediaName && (
                  <div className="flex items-center">
                    <div className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 mr-2 sm:mr-3">
                      <svg 
                        className="h-6 w-6 sm:h-8 sm:w-8 text-gray-500" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        {message.mediaType === 'image' && (
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        )}
                        {message.mediaType === 'video' && (
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                          />
                        )}
                        {message.mediaType === 'audio' && (
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                          />
                        )}
                        {message.mediaType === 'document' && (
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        )}
                        {(!message.mediaType || message.mediaType === 'unknown') && (
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                          />
                        )}
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-medium">
                        Medya içeriği
                      </span>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {message.mediaType === 'image' && 'Fotoğraf'}
                        {message.mediaType === 'gif' && 'GIF'}
                        {message.mediaType === 'video' && 'Video'}
                        {message.mediaType === 'audio' && 'Ses kaydı'}
                        {message.mediaType === 'document' && 'Belge'}
                        {(!message.mediaType || message.mediaType === 'unknown') && 'Medya'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div 
              className={`whitespace-pre-wrap break-words text-sm ${message.isEmoji ? 'text-center' : ''}`}
              dangerouslySetInnerHTML={createMarkup(message.content)}
            />
          )}
          
          <div className={`text-right mt-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 min-w-[60px] sm:min-w-[65px] flex justify-end items-center gap-1`}>
            {formatTimestampInOriginalFormat(message.date, message.timestamp)}
            
            {isSentByMe && (
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {  const [chatData, setChatData] = useState<ParsedChat | null>(null);  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);  const [fileInfo, setFileInfo] = useState({ name: '', type: '' });  const [loading, setLoading] = useState(true);  const [error, setError] = useState<string | null>(null);  const [showScrollButton, setShowScrollButton] = useState(false);  const [showMenu, setShowMenu] = useState(false);  const [showUserSelectDialog, setShowUserSelectDialog] = useState(false);  const [currentUserIdentity, setCurrentUserIdentity] = useState<string | null>(null);  const [mediaFiles, setMediaFiles] = useState<Record<string, string>>({});  const [isLoadingMedia, setIsLoadingMedia] = useState(false);  const [mediaLoadingProgress, setMediaLoadingProgress] = useState(0);  const [mediaLoadingMessage, setMediaLoadingMessage] = useState('Medya dosyaları yükleniyor...');  const [showMediaPreview, setShowMediaPreview] = useState<string | null>(null);  const [displayedMessageCount, setDisplayedMessageCount] = useState<number>(200);  const [showWarning, setShowWarning] = useState<boolean>(false);  const loadMoreMessagesRef = useRef<HTMLDivElement>(null);  const chatContainerRef = useRef<HTMLDivElement>(null);  const lastMessageRef = useRef<HTMLDivElement>(null);  const menuRef = useRef<HTMLDivElement>(null);  const modalRef = useRef<HTMLDivElement>(null);

  // Sayfa yüklendiğinde sohbet verilerini yükle
  useEffect(() => {
    const fetchChatData = async () => {
      setLoading(true);
      try {
        const storedData = localStorage.getItem('whatsapp_chat_data');
        const fileName = localStorage.getItem('whatsapp_chat_name') || '';
        const fileType = localStorage.getItem('whatsapp_chat_type') || '';
        const storedUserIdentity = localStorage.getItem('whatsapp_current_user') || null;
        const hasMedia = localStorage.getItem('whatsapp_has_media') === 'true';
        
        if (!storedData) {
          setError('Sohbet verisi bulunamadı. Lütfen ana sayfaya dönün ve bir sohbet dosyası yükleyin.');
          setLoading(false);
          return;
        }
        
        setFileInfo({ name: fileName, type: fileType });
        
        // Sohbet verilerini parse et - Bu işlem zaman alabilir, bu yüzden önce yükleme göstergesini güncelleyelim
        setTimeout(() => {
          // İlerleme mesajını güncelle
          setMediaLoadingMessage('Sohbet verileri işleniyor...');
          setIsLoadingMedia(true);
          setMediaLoadingProgress(20);
          
          // Sohbet verilerini parse etmeyi yeni bir setTimeout içinde yaparak UI'nin güncellenmesine izin ver
          setTimeout(async () => {
            // Eğer medya dosyaları varsa, IndexedDB'den yükle
            const mediaData: Record<string, string> = {};
            
            if (hasMedia) {
              try {
                setMediaLoadingProgress(30);
                setMediaLoadingMessage('Medya verileri yükleniyor...');
                
                // IndexedDB'den tüm medya anahtarlarını al
                const db = await openWhatsAppDB();
                const keys = await db.getAllKeys('mediaFiles');
                const totalMediaFiles = keys.length;
                
                if (totalMediaFiles > 0) {
                  // Medya dosyalarını parça parça yükle
                  const chunkSize = 20; // Her seferinde 20 dosya yükle (önceden 10'du)
                  let processed = 0;
                  
                  // İlk 50 medya dosyasını öncelikli olarak yükle (sık kullanılanlar)
                  const initialChunk = keys.slice(0, Math.min(50, totalMediaFiles));
                  const initialChunkPromises = initialChunk.map(async (key) => {
                    const value = await db.get('mediaFiles', key);
                    return { key: key.toString(), value };
                  });
                  
                  const initialResults = await Promise.all(initialChunkPromises);
                  initialResults.forEach(({ key, value }) => {
                    if (value) {
                      mediaData[key] = value;
                    }
                  });
                  
                  processed = initialChunk.length;
                  const progress = Math.round((processed / totalMediaFiles) * 30) + 30; // 30% - 60% arası
                  setMediaLoadingProgress(progress);
                  setMediaLoadingMessage(`İlk medya dosyaları yüklendi, sohbet hazırlanıyor...`);
                  
                  // Diğer dosyaları arka planda yüklemeye devam et
                  setTimeout(async () => {
                    for (let i = processed; i < totalMediaFiles; i += chunkSize) {
                      const chunk = keys.slice(i, i + chunkSize);
                      
                      // Bu grup için dosyaları yükle
                      const chunkPromises = chunk.map(async (key) => {
                        const value = await db.get('mediaFiles', key);
                        return { key: key.toString(), value };
                      });
                      
                      const results = await Promise.all(chunkPromises);
                      
                      // Yüklenen dosyaları mediaData'ya ekle
                      results.forEach(({ key, value }) => {
                        if (value) {
                          mediaData[key] = value;
                        }
                      });
                      
                      processed += chunk.length;
                      // İlerleme yüzdesini güncelle
                      const progress = Math.round((processed / totalMediaFiles) * 30) + 60; // 60% - 90% arası
                      setMediaLoadingProgress(progress);
                      setMediaLoadingMessage(`Medya dosyaları yükleniyor (${processed}/${totalMediaFiles})...`);
                      
                      // Kısa bir bekleme ekle, UI'nin güncellenmesine izin ver
                      if (i + chunkSize < totalMediaFiles) {
                        await new Promise(resolve => setTimeout(resolve, 10));
                      }
                    }
                    
                    setMediaLoadingProgress(100);
                    setMediaLoadingMessage('Tüm medya dosyaları yüklendi!');
                    
                    // Tamamlandıktan 500ms sonra yükleme göstergesini kaldır
                    setTimeout(() => setIsLoadingMedia(false), 500);
                  }, 100);
                }
              } catch (err) {
                console.error('Medya dosyaları yüklenirken hata oluştu:', err);
              }
            }
            
            // Media verileri önceden hazır olsun
            setMediaFiles(mediaData);
            
            // Parse işlemini ayrı bir web worker veya farklı bir thread üzerinde yapmak daha iyi olabilir,
            // ancak setTimeout ile ana thread'i bloke etmeden UI güncellemelerine izin verelim
            setTimeout(() => {
              try {
                setMediaLoadingMessage('Sohbet mesajları hazırlanıyor...');
                setMediaLoadingProgress(80);
                
                // Sohbet verilerini parse et
                const parsedData = parseWhatsAppChat(storedData, mediaData);
                setChatData(parsedData);
                
                // Grup sohbeti ise otomatik olarak herkesi seç
                if (parsedData.isGroup) {
                  setSelectedParticipant('all');
                }
                
                // Kullanıcı kimliğini belirle
                if (storedUserIdentity && parsedData.participants.includes(storedUserIdentity)) {
                  setCurrentUserIdentity(storedUserIdentity);
                } else if (parsedData.participants.length > 0) {
                  // Varsayılan olarak ilk kullanıcıyı seç
                  setCurrentUserIdentity(parsedData.participants[0]);
                  localStorage.setItem('whatsapp_current_user', parsedData.participants[0]);
                }
                
                setMediaLoadingProgress(100);
                setMediaLoadingMessage('Sohbet yüklendi!');
                
                // Tamamlandıktan kısa bir süre sonra yükleme göstergesini kaldır
                setTimeout(() => {
                  setIsLoadingMedia(false);
                  setLoading(false);
                }, 500);
              } catch (error) {
                console.error('Sohbet parse edilirken hata:', error);
                setError('Sohbet verileri işlenirken bir hata oluştu.');
                setIsLoadingMedia(false);
                setLoading(false);
              }
            }, 100);
            
          }, 100);
        }, 50);
        
      } catch (err) {
        console.error('Sohbet verileri yüklenirken hata oluştu:', err);
        setError('Sohbet verileri işlenirken bir hata oluştu.');
        setIsLoadingMedia(false);
        setLoading(false);
      }
    };
    
    fetchChatData();
  }, []);
  
  // Lazy loading - belirli bir medya dosyasını ihtiyaç olduğunda yükle
  const loadMediaIfNeeded = async (mediaName: string): Promise<string | undefined> => {
    // Eğer zaten yüklenmişse, mevcut URL'yi döndür
    if (mediaFiles[mediaName]) {
      return mediaFiles[mediaName];
    }
    
    try {
      // Yükleme durumunu göster
      setIsLoadingMedia(true);
      setMediaLoadingProgress(30);
      
      // IndexedDB'den yükle
      const mediaUrl = await getMediaFile(mediaName);
      
      setMediaLoadingProgress(100);
      // Yükleme göstergesini kısa süre sonra kaldır
      setTimeout(() => setIsLoadingMedia(false), 300);
      
      if (mediaUrl) {
        // State'i güncelle
        setMediaFiles(prev => ({
          ...prev,
          [mediaName]: mediaUrl
        }));
        
        // Eğer bu dosya sohbet içinde kullanılıyorsa, mesajı güncelle
        if (chatData) {
          // Dosya adıyla eşleşen mesajları bul
          const updatedMessages = chatData.messages.map(message => {
            if (message.mediaName === mediaName) {
              return {
                ...message,
                mediaUrl
              };
            }
            return message;
          });
          
          // ChatData'yı güncelle
          setChatData({
            ...chatData,
            messages: updatedMessages
          });
        }
        
        return mediaUrl;
      }
    } catch (err) {
      console.error(`Medya dosyası yüklenirken hata: ${mediaName}`, err);
      setIsLoadingMedia(false);
    }
    
    return undefined;
  };
  
  // Kullanıcı kimliğini değiştir
  const changeUserIdentity = (identity: string) => {
    setCurrentUserIdentity(identity);
    localStorage.setItem('whatsapp_current_user', identity);
    setShowUserSelectDialog(false);
    setShowMenu(false);
    
    // Kimlik değiştiğinde state'i yenile
    if (chatData) {
      const updatedMessages = [...chatData.messages];
      setChatData({
        ...chatData,
        messages: updatedMessages
      });
    }
  };
  
  // Mesaj filtreleme
  const filteredMessages = chatData?.messages.filter(message => {
    if (!selectedParticipant || selectedParticipant === 'all') return true;
    return message.sender === selectedParticipant;
  });
  
  // Kademeli mesaj yükleme fonksiyonu
  const loadMoreMessages = () => {
    if (!filteredMessages) return;
    
    // Mevcut kaydırma pozisyonunu ve yüksekliği kaydet
    const currentScrollTop = chatContainerRef.current?.scrollTop || 0;
    const currentScrollHeight = chatContainerRef.current?.scrollHeight || 0;
    
    // 75 daha fazla mesaj göster
    setDisplayedMessageCount(prev => Math.min(prev + 75, filteredMessages.length));
    
    // Bir süre sonra kaydırma pozisyonunu güncelle, ama kullanıcının pozisyonunu koru
    setTimeout(() => {
      if (chatContainerRef.current) {
        // Yeni yükseklikle eski yükseklik arasındaki farkı hesapla
        const newScrollHeight = chatContainerRef.current.scrollHeight;
        const heightDifference = newScrollHeight - currentScrollHeight;
        
        // Kullanıcıyı aynı göreceli pozisyonda tut, yeni eklenen içeriği ekleyerek
        chatContainerRef.current.scrollTop = currentScrollTop + heightDifference;
      }
    }, 50);
  };
  
  // Tüm mesajları göster
  const loadAllMessages = () => {
    if (!filteredMessages) return;
    
    // Mevcut kaydırma pozisyonunu ve yüksekliği kaydet
    const currentScrollTop = chatContainerRef.current?.scrollTop || 0;
    const currentScrollHeight = chatContainerRef.current?.scrollHeight || 0;
    
    setDisplayedMessageCount(filteredMessages.length);
    setShowWarning(false);
    
    // Bir süre sonra kaydırma pozisyonunu güncelle, ama kullanıcının pozisyonunu koru
    setTimeout(() => {
      if (chatContainerRef.current) {
        // Yeni yükseklikle eski yükseklik arasındaki farkı hesapla
        const newScrollHeight = chatContainerRef.current.scrollHeight;
        const heightDifference = newScrollHeight - currentScrollHeight;
        
        // Kullanıcıyı aynı göreceli pozisyonda tut, yeni eklenen içeriği ekleyerek
        chatContainerRef.current.scrollTop = currentScrollTop + heightDifference;
      }
    }, 100);
  };

  // Eski mesajlar yüklendiğinde referansı kaydırma pozisyonuna getir
  useEffect(() => {
    if (displayedMessageCount > 200 && loadMoreMessagesRef.current && chatContainerRef.current) {
      loadMoreMessagesRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [displayedMessageCount]);
  
  // Sohbetteki tüm medya dosyalarını yükleyen yardımcı fonksiyon
  const loadAllMediaForVisibleMessages = async () => {
    if (!chatData || !filteredMessages || isLoadingMedia) return;
    
    // Görünen mesajlar içinde medya içeren ama URL'si olmayanları bul
    // Performans için sadece görünür mesajları işle (en fazla 50 mesaj)
    const visibleMessages = filteredMessages.slice(-Math.min(displayedMessageCount, 50));
    const mediaMessages = visibleMessages.filter(message => 
      message.isMedia && message.mediaName && !message.mediaUrl
    );
    
    if (mediaMessages.length === 0) return;
    
    // Yükleme durumunu göster
    setIsLoadingMedia(true);
    setMediaLoadingProgress(5);
    setMediaLoadingMessage(`Medya dosyaları hazırlanıyor... (0/${mediaMessages.length})`);
    
    try {
      // Her medya için yükleme (aynı anda en fazla 3 medya dosyası yükle)
      const batchSize = 3;
      for (let i = 0; i < mediaMessages.length; i += batchSize) {
        const batch = mediaMessages.slice(i, i + batchSize);
        
        // Paralel yükleme için promiseler
        const loadPromises = batch.map(async (message, batchIndex) => {
          if (message.mediaName) {
            setMediaLoadingMessage(`Medya yükleniyor: ${message.mediaName} (${i + batchIndex + 1}/${mediaMessages.length})`);
            return loadMediaIfNeeded(message.mediaName);
          }
          return null;
        });
        
        // Tüm batch'in yüklenmesini bekle
        await Promise.all(loadPromises);
        
        // İlerleme yüzdesini güncelle
        const progress = Math.round(((i + batch.length) / mediaMessages.length) * 90) + 5;
        setMediaLoadingProgress(progress);
        
        // Tarayıcının arayüz güncellemesi için kısa bir bekleme
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      setMediaLoadingProgress(100);
      setMediaLoadingMessage('Medya dosyaları yüklendi!');
      // Tamamlandıktan 500ms sonra yükleme göstergesini kaldır
      setTimeout(() => setIsLoadingMedia(false), 500);
    } catch (err) {
      console.error('Medya dosyalarını toplu yüklerken hata oluştu:', err);
      setIsLoadingMedia(false);
    }
  };

  // Filtrelenmiş mesajlar değiştiğinde otomatik olarak medya dosyalarını yükle
  useEffect(() => {
    // Sayfa yüklendiğinde veya filtrelenen mesajlar değiştiğinde tüm görünen medyaları yükle
    if (filteredMessages && filteredMessages.length > 0 && !isLoadingMedia) {
      loadAllMediaForVisibleMessages();
    }
  }, [filteredMessages, displayedMessageCount, isLoadingMedia]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Dışarı tıklama ile menüyü kapatma
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Eğer menü ref dışına tıklanırsa kapatın
      // Ancak, menü içindeki butonlara tıklama durumunda menüyü kapatmayın
      const target = event.target as HTMLElement;
      if (
        menuRef.current && 
        !menuRef.current.contains(target) && 
        !target.closest('[data-menu="dropdown"]') && 
        !target.closest('#change-identity-btn')
      ) {
        setShowMenu(false);
      }
    }
    
    // Kimlik değiştirme düğmesine tıklamayı düzenlemek için özel işleyici
    function handleDocumentClick(event: MouseEvent) {
      // Kimliğinizi Değiştirin butonu tıklamalarını özel olarak işle
      const target = event.target as HTMLElement;
      if (target.closest('#change-identity-btn') || 
          (target.closest('button') && target.textContent?.includes('Kimliğinizi Değiştirin'))) {
        event.stopPropagation();
        setShowUserSelectDialog(true);
        setShowMenu(false);
        return;
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleDocumentClick, true); // capture phase'de dinle
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, []);
  
  // Chat konteynerini sohbet yüklendiğinde aşağıya kaydır
  useEffect(() => {
    if (chatData && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatData]);
  
  // Scroll pozisyonunu izle ve aşağı kaydırma butonunu göster/gizle
  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const atBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!atBottom);
    };
    
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Aşağı kaydırma fonksiyonu
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  
  // HTML olarak içeriği oluştur
  const createMarkup = (content: string) => {
    return { __html: formatMessageContent(content) };
  };
  
  // Tarih değişimini kontrol eder
  const isDifferentDay = (index: number, messages: ChatMessage[]) => {
    if (index === 0) return true;
    
    const currentDate = new Date(messages[index].date);
    const previousDate = new Date(messages[index - 1].date);
    
    return (
      currentDate.getDate() !== previousDate.getDate() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getFullYear() !== previousDate.getFullYear()
    );
  };
  
  // Tarih formatını Türkçe olarak göster
  const formatDateHeader = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Dün';
    } else {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('tr-TR', options);
    }
  };
  
  // Medya dosyasını görüntüleme
  const openMediaPreview = (url: string) => {
    setShowMediaPreview(url);
  };
  
  const closeMediaPreview = () => {
    setShowMediaPreview(null);
  };
  
  // Kimliğinizi değiştir modalının dışına tıklandığında kapatma
  useEffect(() => {
    function handleModalClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowUserSelectDialog(false);
      }
    }
    
    if (showUserSelectDialog) {
      document.addEventListener('mousedown', handleModalClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleModalClickOutside);
      };
    }
  }, [showUserSelectDialog]);
  
  // Sohbet verileri yüklendiğinde ve mesajlar render edildiğinde en alta kaydır
  useEffect(() => {
    if (chatData && !loading && chatContainerRef.current) {
      // Sayfa yüklendikten sonra en alta kaydır
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chatData, loading]);

  // Kaydırma işlemini izle
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="text-center bg-white dark:bg-[#111111] p-10 rounded-3xl shadow-2xl max-w-md w-full mx-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Sohbet Yükleniyor</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Sohbet verileri hazırlanıyor, lütfen bekleyin...</p>
          
          {/* İlerleme çubuğu ekle */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
            <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${mediaLoadingProgress}%` }}></div>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="text-center bg-white dark:bg-[#111111] p-10 rounded-3xl shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Hata Oluştu</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#efeae2] dark:bg-[#0a0a0a]">
      {/* Arka plan deseni */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6a65b35bd2be9f.jpg')] opacity-5 dark:opacity-[0.025]"></div>
      
      {/* MediaLoading İndikatörü */}
      {isLoadingMedia && (
        <div className="fixed top-0 inset-x-0 z-50">
          <div className="bg-emerald-600 h-1.5 transition-all duration-300" style={{ width: `${mediaLoadingProgress}%` }}></div>
          <div className="bg-white dark:bg-[#111111] text-emerald-600 dark:text-emerald-400 text-xs p-1.5 text-center">
            {mediaLoadingMessage}
          </div>
        </div>
      )}
      
      {/* Dropdown Menüsü - DOM'da üst seviyeye taşındı */}
      {showMenu && (
        <div 
          className="fixed right-4 sm:right-5 top-14 sm:top-16 w-64 bg-white dark:bg-[#111111] rounded-xl shadow-2xl z-[9999] overflow-hidden border border-gray-100 dark:border-gray-800/50"
          style={{ pointerEvents: 'auto' }} 
          data-menu="dropdown"
        >
          <div className="py-1">
            <button 
              type="button"
              className="flex items-center px-4 py-3 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
              onClick={() => {
                setShowUserSelectDialog(true);
                setShowMenu(false);
              }}
              id="change-identity-btn"
            >
              <svg className="w-5 h-5 mr-3 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Kimliğinizi Değiştirin
            </button>
            <button 
              type="button"
              className="flex items-center px-4 py-3 w-full text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
              onClick={() => window.location.href = '/'}
            >
              <svg className="w-5 h-5 mr-3 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfaya Dön
            </button>
            <div className="border-t border-gray-200 dark:border-gray-800/50 my-1"></div>
            <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
              <p>Tüm veriler cihazınızda saklanır.</p>
              <p>Hiçbir veri sunucuya gönderilmez.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-700 dark:to-teal-600 text-white shadow-lg z-10 relative backdrop-blur-sm">
        <div className="flex items-center justify-between w-full px-3 sm:px-5 py-3 sm:py-4">
          <div className="flex items-center flex-1 gap-2 sm:gap-4 min-w-0">
            <Link 
              href="/" 
              className="text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"
              aria-label="Ana sayfaya dön"
            >
              <svg 
                className="h-4 w-4 sm:h-5 sm:w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-inner flex-shrink-0">
                {chatData?.isGroup ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-semibold leading-tight truncate drop-shadow-sm">
                  {chatData?.isGroup && chatData.groupName 
                    ? chatData.groupName 
                    : fileInfo.name.replace(/\.(txt|zip)$/i, '')}
                </h1>
                <div className="text-xs opacity-90 flex items-center truncate">
                  <div className="truncate flex items-center gap-1 sm:gap-2">
                    {currentUserIdentity && (
                      <span className="inline-flex items-center bg-white/20 backdrop-blur-sm text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-1 animate-pulse"></span>
                        <span className="truncate max-w-[70px] sm:max-w-[100px]">Siz: {currentUserIdentity}</span>
                      </span>
                    )}
                    <span className="truncate flex items-center gap-1 hidden xs:inline-flex">
                      <svg className="w-3 h-3 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {chatData?.participants.length} katılımcı
                    </span>
                    <span className="truncate flex items-center gap-1">
                      <svg className="w-3 h-3 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {filteredMessages?.length} mesaj
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
                aria-label="Menü"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Grup sohbeti ise, katılımcı seçme */}
      {chatData?.isGroup && (
        <div className="bg-white dark:bg-[#111111] px-2 sm:px-4 py-2 border-b dark:border-gray-800/50 flex items-center overflow-x-auto scrollbar-hide z-10 relative">
          <div className="flex space-x-2 items-center">
            <button
              onClick={() => setSelectedParticipant('all')}
              className={`flex-shrink-0 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                selectedParticipant === 'all' || !selectedParticipant
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              Tümü
            </button>
            
            {chatData.participants.map(participant => (
              <button
                key={participant}
                onClick={() => setSelectedParticipant(participant)}
                className={`flex-shrink-0 px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full transition-colors ${
                  selectedParticipant === participant
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                {participant === currentUserIdentity ? `${participant} (Siz)` : participant}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Kullanıcı seçme modal dialog */}
      {showUserSelectDialog && chatData && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-2 sm:p-4">
          <div 
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 animate-fade-in relative"
          >
            <button
              onClick={() => setShowUserSelectDialog(false)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Kapat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">Kimliğinizi Seçin</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
              Sohbette hangi kullanıcı olduğunuzu seçin. Bu, mesajlarınızın hangi tarafta görüntüleneceğini belirler.
            </p>
            
            <div className="space-y-2 mb-5 sm:mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {chatData.participants.map(participant => (
                <button
                  key={participant}
                  onClick={() => changeUserIdentity(participant)}
                  className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-colors flex items-center ${
                    participant === currentUserIdentity
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2 sm:mr-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-white text-sm sm:text-base">{participant}</div>
                    {participant === currentUserIdentity && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400">Şu anda seçili</div>
                    )}
                  </div>
                  {participant === currentUserIdentity && (
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowUserSelectDialog(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Medya dosyası önizleme */}
      {showMediaPreview && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeMediaPreview}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-lg p-1 sm:p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-8 sm:-top-10 right-0 text-white p-2 hover:bg-white/10 rounded-full"
              onClick={closeMediaPreview}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {showMediaPreview.includes('image/') || showMediaPreview.includes('data:image/') ? (
              <Image 
                src={showMediaPreview} 
                alt="Medya içeriği" 
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
                width={800}
                height={600}
                style={{ maxHeight: '80vh', width: 'auto' }}
                unoptimized
              />
            ) : showMediaPreview.includes('video/') || showMediaPreview.includes('data:video/') ? (
              <video 
                src={showMediaPreview} 
                controls 
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
              >
                Tarayıcınız video oynatmayı desteklemiyor.
              </video>
            ) : showMediaPreview.includes('audio/') || showMediaPreview.includes('data:audio/') ? (
              <audio 
                src={showMediaPreview} 
                controls 
                className="w-full"
              >
                Tarayıcınız ses dosyası oynatmayı desteklemiyor.
              </audio>
            ) : (
              <div className="p-3 sm:p-4 text-center">
                <p>Bu medya türü görüntülenemiyor.</p>
                <a 
                  href={showMediaPreview} 
                  download 
                  className="mt-2 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Dosyayı İndir
                </a>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Chat mesajları */}
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto z-10 relative">
        <div className="max-w-3xl mx-auto p-2 sm:p-4 pb-16">
          {/* Bellek optimizasyonu için yalnızca görünür mesajları işleme */}
          {filteredMessages && filteredMessages.length > displayedMessageCount ? (
            // Sınırlı sayıda mesaj göster (varsayılan olarak 200, sonra 75'er 75'er artar)
            <>
              <div className="my-3 sm:my-4 text-center flex flex-col items-center gap-2">
                <button 
                  onClick={loadMoreMessages}
                  className="text-xs bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-all"
                >
                  Daha eski mesajları yükle (75 mesaj daha)
                </button>
                
                <div className="relative inline-block">
                  <button 
                    onClick={() => setShowWarning(!showWarning)}
                    className="text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:bg-amber-200 dark:hover:bg-amber-800/30 flex items-center transition-all"
                  >
                    Tümünü göster ({filteredMessages.length - displayedMessageCount} mesaj daha)
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  {showWarning && (
                    <div className="absolute z-50 bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-60 sm:w-64 bg-white dark:bg-[#111111] text-xs text-red-600 dark:text-red-400 p-3 sm:p-4 rounded-xl shadow-xl border border-red-200 dark:border-red-900/30">
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-[#111111] border-b border-r border-red-200 dark:border-red-900/30"></div>
                      <p className="font-medium mb-1">Uyarı!</p>
                      <p>Tüm mesajları yüklemek tarayıcı önbelleğinin dolmasına ve uygulama performansının düşmesine neden olabilir.</p>
                      <div className="mt-2 flex justify-end">
                        <button 
                          onClick={loadAllMessages}
                          className="text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-all"
                        >
                          Yine de yükle
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {filteredMessages.slice(-displayedMessageCount).map((message, index, shownMessages) => {
                const actualIndex = filteredMessages.length - displayedMessageCount + index;
                const isLoadMorePoint = index === 0;
                
                return (
                  <div key={message.id} ref={isLoadMorePoint ? loadMoreMessagesRef : undefined}>
                    <MessageItem 
                      message={message} 
                      index={actualIndex} 
                      filteredMessages={filteredMessages} 
                      isLastMessage={index === shownMessages.length - 1} 
                      lastMessageRef={lastMessageRef}
                      showSenderName={index === 0 || shownMessages[index - 1]?.sender !== message.sender}
                      showDateHeader={index === 0 || isDifferentDay(actualIndex, filteredMessages)}
                      currentUserIdentity={currentUserIdentity}
                      openMediaPreview={openMediaPreview}
                      loadMediaIfNeeded={loadMediaIfNeeded}
                      chatContainerRef={chatContainerRef}
                      chatData={chatData}
                      setChatData={setChatData}
                      createMarkup={createMarkup}
                      formatDateHeader={formatDateHeader}
                    />
                  </div>
                );
              })}
            </>
          ) : (
            // Tüm mesajları göster (kısa sohbet veya tüm mesajlar yüklendiyse)
            <>
              {filteredMessages?.map((message, index) => {
                const prevMessage = index > 0 ? filteredMessages[index - 1] : null;
                
                const showSender = prevMessage?.sender !== message.sender;
                const showDateHeader = isDifferentDay(index, filteredMessages);
                
                // Son mesaj için referans
                const isLastMessage = index === filteredMessages.length - 1;
                
                return (
                  <MessageItem 
                    key={message.id}
                    message={message} 
                    index={index} 
                    filteredMessages={filteredMessages} 
                    isLastMessage={isLastMessage} 
                    lastMessageRef={lastMessageRef}
                    showSenderName={showSender}
                    showDateHeader={showDateHeader}
                    currentUserIdentity={currentUserIdentity}
                    openMediaPreview={openMediaPreview}
                    loadMediaIfNeeded={loadMediaIfNeeded}
                    chatContainerRef={chatContainerRef}
                    chatData={chatData}
                    setChatData={setChatData}
                    createMarkup={createMarkup}
                    formatDateHeader={formatDateHeader}
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
      
      {/* Aşağı kaydırma butonu */}
      {showScrollButton && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-20 rounded-full bg-white dark:bg-gray-800 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Aşağı kaydır"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
} 
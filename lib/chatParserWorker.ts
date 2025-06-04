// Web Worker for parsing WhatsApp chat
import { parseWhatsAppChat, ChatMessage, ParsedChat } from './chatParser';

// Worker tarafından alınacak mesaj türü
type WorkerMessage = {
  type: 'PARSE_CHAT';
  data: {
    chatData: string;
    mediaData: Record<string, string>;
  };
};

// Web Worker içinde, mesaj alındığında
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, data } = event.data;
  
  if (type === 'PARSE_CHAT') {
    try {
      const { chatData, mediaData } = data;
      
      // İşlem başladığını bildir
      self.postMessage({ type: 'PARSE_STARTED' });
      
      // Sohbeti ayrıştır
      const parsedChat = parseWhatsAppChat(chatData, mediaData);
      
      // İşlem tamamlandığını ve sonuçları bildir
      self.postMessage({
        type: 'PARSE_COMPLETED',
        data: parsedChat
      });
    } catch (error) {
      // Hata durumunda bildir
      self.postMessage({
        type: 'PARSE_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};

// TypeScript için Web Worker'a özgü türleri tanımla
export default {} as typeof Worker & { new(): Worker }; 
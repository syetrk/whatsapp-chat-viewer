import { useState, useEffect, useCallback } from 'react';
import { ParsedChat } from './chatParser';

type WorkerStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseWorkerReturn {
  parsedData: ParsedChat | null;
  status: WorkerStatus;
  error: string | null;
  parseChat: (chatData: string, mediaData: Record<string, string>) => void;
}

export function useWorker(): UseWorkerReturn {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [parsedData, setParsedData] = useState<ParsedChat | null>(null);
  const [status, setStatus] = useState<WorkerStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Worker'ı oluştur
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Worker'ı sadece tarayıcı ortamında oluştur
    try {
      const chatWorker = new Worker(new URL('./chatParserWorker.ts', import.meta.url));
      setWorker(chatWorker);
      
      // Worker'dan gelen mesajları dinle
      chatWorker.onmessage = (event) => {
        const { type, data, error } = event.data;
        
        if (type === 'PARSE_STARTED') {
          setStatus('loading');
        } else if (type === 'PARSE_COMPLETED') {
          setParsedData(data);
          setStatus('success');
        } else if (type === 'PARSE_ERROR') {
          setError(error);
          setStatus('error');
        }
      };
      
      // Worker hatalarını dinle
      chatWorker.onerror = (error) => {
        console.error('Web Worker error:', error);
        setError('Web Worker\'da beklenmeyen bir hata oluştu.');
        setStatus('error');
      };
      
      // Component unmount olduğunda worker'ı temizle
      return () => {
        chatWorker.terminate();
      };
    } catch (err) {
      console.error('Web Worker oluşturulamadı:', err);
      setError('Web Worker oluşturulamadı. Tarayıcınız bu özelliği desteklemiyor olabilir.');
      setStatus('error');
    }
  }, []);

  // Worker'a veri gönderme fonksiyonu
  const parseChat = useCallback((chatData: string, mediaData: Record<string, string>) => {
    if (!worker) {
      setError('Web Worker henüz başlatılmadı veya desteklenmiyor.');
      return;
    }
    
    setStatus('loading');
    setError(null);
    
    worker.postMessage({
      type: 'PARSE_CHAT',
      data: { chatData, mediaData }
    });
  }, [worker]);

  return { parsedData, status, error, parseChat };
} 
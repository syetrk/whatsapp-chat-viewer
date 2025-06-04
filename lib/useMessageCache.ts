import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatMessage } from './chatParser';

// Önbellek anahtarı için kullanılacak yapı
type CacheKey = {
  messages: ChatMessage[];
  displayedCount: number;
  selectedParticipant: string | null;
};

// Önbellek anahtarı oluşturan fonksiyon
const createCacheKey = (key: CacheKey): string => {
  return `${key.selectedParticipant || 'all'}_${key.displayedCount}`;
};

// Mesajları gruplandıran fonksiyon
const groupMessages = (messages: ChatMessage[], limit?: number): ChatMessage[] => {
  if (!messages.length) return [];
  
  // Eğer limit belirtilmişse, sadece son 'limit' kadar mesajı al
  const messagesToProcess = limit ? messages.slice(-limit) : messages;
  
  return messagesToProcess;
};

// İlgili hook tanımı
export function useMessageCache() {
  // Önbellek durumu
  const [cache, setCache] = useState<Record<string, ChatMessage[]>>({});
  
  // Önbelleğe alma fonksiyonu
  const cacheMessages = useCallback((key: CacheKey, messages: ChatMessage[]) => {
    const cacheKey = createCacheKey(key);
    
    setCache(prevCache => ({
      ...prevCache,
      [cacheKey]: messages
    }));
  }, []);
  
  // Önbellekten getirme fonksiyonu
  const getCachedMessages = useCallback((key: CacheKey): ChatMessage[] | null => {
    const cacheKey = createCacheKey(key);
    return cache[cacheKey] || null;
  }, [cache]);
  
  // Filtrelenmiş ve işlenmiş mesajları önbellekle getiren fonksiyon
  const getProcessedMessages = useCallback((
    allMessages: ChatMessage[],
    displayedCount: number,
    selectedParticipant: string | null
  ): ChatMessage[] => {
    // Önce filtreleme yap
    const filtered = !selectedParticipant || selectedParticipant === 'all'
      ? allMessages
      : allMessages.filter(msg => msg.sender === selectedParticipant);
    
    // Önbellekte var mı kontrol et
    const cacheKey = { messages: allMessages, displayedCount, selectedParticipant };
    const cachedResult = getCachedMessages(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }
    
    // Önbellekte yoksa, hesapla ve önbelleğe al
    const result = displayedCount && displayedCount < filtered.length
      ? groupMessages(filtered, displayedCount)
      : groupMessages(filtered);
    
    cacheMessages(cacheKey, result);
    return result;
  }, [cacheMessages, getCachedMessages]);
  
  // Önbelleği temizleme
  const clearCache = useCallback(() => {
    setCache({});
  }, []);
  
  return {
    getProcessedMessages,
    clearCache
  };
} 
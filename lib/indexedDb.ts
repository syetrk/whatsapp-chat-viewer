import { openDB, DBSchema } from 'idb';

interface WhatsAppDBSchema extends DBSchema {
  mediaFiles: {
    key: string;
    value: string;
  };
}

const DB_NAME = 'whatsapp-chat-viewer';
const MEDIA_STORE = 'mediaFiles';
const DB_VERSION = 1;

// Veritabanı bağlantısını açma
export async function openWhatsAppDB() {
  return openDB<WhatsAppDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Eğer mediaFiles store yoksa oluştur
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE);
      }
    },
  });
}

// Tüm medya dosyalarını kaydetme
export async function saveMediaFiles(mediaFiles: Record<string, string>) {
  const db = await openWhatsAppDB();
  const tx = db.transaction(MEDIA_STORE, 'readwrite');
  const store = tx.objectStore(MEDIA_STORE);
  
  // Her dosya için ayrı bir kayıt oluştur
  await Promise.all(
    Object.entries(mediaFiles).map(([key, value]) => store.put(value, key))
  );
  
  await tx.done;
  return Object.keys(mediaFiles).length;
}

// Bir medya dosyasını getirme
export async function getMediaFile(key: string): Promise<string | undefined> {
  const db = await openWhatsAppDB();
  return db.get(MEDIA_STORE, key);
}

// Tüm medya dosyalarını getirme
export async function getAllMediaFiles(): Promise<Record<string, string>> {
  const db = await openWhatsAppDB();
  const keys = await db.getAllKeys(MEDIA_STORE);
  const values = await db.getAll(MEDIA_STORE);
  
  const result: Record<string, string> = {};
  keys.forEach((key, index) => {
    result[key.toString()] = values[index];
  });
  
  return result;
}

// Sohbete ait tüm verileri silme
export async function clearAllData() {
  const db = await openWhatsAppDB();
  const tx = db.transaction(MEDIA_STORE, 'readwrite');
  await tx.objectStore(MEDIA_STORE).clear();
  await tx.done;
} 
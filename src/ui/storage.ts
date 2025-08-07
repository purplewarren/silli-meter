/**
 * Unified storage wrapper for all dyads
 * Automatically switches between localStorage and IndexedDB based on size
 */

export interface StorageItem {
  id: string;
  timestamp: string;
  dyad: 'night' | 'tantrum' | 'meal';
  data: any;
}

export class DyadStorage {
  private static instance: DyadStorage;
  private useIndexedDB: boolean = false;
  private dbName = 'silli-dyads';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  private constructor() {
    this.checkStorageSize();
  }

  public static getInstance(): DyadStorage {
    if (!DyadStorage.instance) {
      DyadStorage.instance = new DyadStorage();
    }
    return DyadStorage.instance;
  }

  private async checkStorageSize(): Promise<void> {
    try {
      const totalSize = this.getLocalStorageSize();
      this.useIndexedDB = totalSize > 5 * 1024 * 1024; // 5MB threshold
      
      if (this.useIndexedDB) {
        await this.initIndexedDB();
      }
    } catch (error) {
      console.warn('Storage size check failed, using localStorage:', error);
      this.useIndexedDB = false;
    }
  }

  private getLocalStorageSize(): number {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
    }
    return totalSize;
  }

  private async initIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('dyads')) {
          const store = db.createObjectStore('dyads', { keyPath: 'id' });
          store.createIndex('dyad', 'dyad', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  public async save(dyad: 'night' | 'tantrum' | 'meal', item: any): Promise<void> {
    const storageItem: StorageItem = {
      id: `${dyad}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      dyad,
      data: item
    };

    if (this.useIndexedDB && this.db) {
      return this.saveToIndexedDB(storageItem);
    } else {
      return this.saveToLocalStorage(storageItem);
    }
  }

  private async saveToIndexedDB(item: StorageItem): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['dyads'], 'readwrite');
      const store = transaction.objectStore('dyads');
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private saveToLocalStorage(item: StorageItem): Promise<void> {
    return new Promise((resolve) => {
      const key = `dyad_${item.dyad}_${item.id}`;
      localStorage.setItem(key, JSON.stringify(item));
      resolve();
    });
  }

  public async list(dyad: 'night' | 'tantrum' | 'meal', limit: number = 30): Promise<StorageItem[]> {
    if (this.useIndexedDB && this.db) {
      return this.listFromIndexedDB(dyad, limit);
    } else {
      return this.listFromLocalStorage(dyad, limit);
    }
  }

  private async listFromIndexedDB(dyad: string, limit: number): Promise<StorageItem[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['dyads'], 'readonly');
      const store = transaction.objectStore('dyads');
      const index = store.index('dyad');
      const request = index.getAll(dyad);

      request.onsuccess = () => {
        const items = request.result as StorageItem[];
        // Sort by timestamp descending and limit
        const sorted = items
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
        resolve(sorted);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private listFromLocalStorage(dyad: string, limit: number): Promise<StorageItem[]> {
    return new Promise((resolve) => {
      const items: StorageItem[] = [];
      const prefix = `dyad_${dyad}_`;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '');
            if (item && item.dyad === dyad) {
              items.push(item);
            }
          } catch (error) {
            console.warn('Failed to parse storage item:', key, error);
          }
        }
      }

      // Sort by timestamp descending and limit
      const sorted = items
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
      resolve(sorted);
    });
  }

  public async clear(dyad: 'night' | 'tantrum' | 'meal'): Promise<void> {
    if (this.useIndexedDB && this.db) {
      return this.clearFromIndexedDB(dyad);
    } else {
      return this.clearFromLocalStorage(dyad);
    }
  }

  private async clearFromIndexedDB(dyad: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction(['dyads'], 'readwrite');
      const store = transaction.objectStore('dyads');
      const index = store.index('dyad');
      const request = index.openCursor(dyad);

      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  private clearFromLocalStorage(dyad: string): Promise<void> {
    return new Promise((resolve) => {
      const prefix = `dyad_${dyad}_`;
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
      resolve();
    });
  }

  public async getStorageInfo(): Promise<{ type: 'localStorage' | 'indexedDB', size: number }> {
    if (this.useIndexedDB) {
      return { type: 'indexedDB', size: await this.getIndexedDBSize() };
    } else {
      return { type: 'localStorage', size: this.getLocalStorageSize() };
    }
  }

  private async getIndexedDBSize(): Promise<number> {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(0);
        return;
      }

      const transaction = this.db.transaction(['dyads'], 'readonly');
      const store = transaction.objectStore('dyads');
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result;
        const size = JSON.stringify(items).length;
        resolve(size);
      };

      request.onerror = () => resolve(0);
    });
  }
} 
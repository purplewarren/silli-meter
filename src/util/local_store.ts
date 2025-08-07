/**
 * Local storage utility for IndexedDB and localStorage
 * Handles persistence of derived-only session data
 */

export interface TantrumSession {
  id: string;
  ts: string; // ISO timestamp
  trigger?: string;
  duration_min?: number;
  intensity_1_10?: number;
  escalation_index?: number;
  tantrum_proxy?: {
    duration_s?: number;
    avg_level_dbfs?: number;
    motion_estimate?: number;
  };
  notes?: string;
}

export interface MealSession {
  id: string;
  ts: string; // ISO timestamp
  meal_type?: string;
  offered?: string;
  eaten_pct?: number;
  stress_level?: number;
  environment_noise?: boolean;
  meal_proxies?: {
    color_var: number;
    plate_items_est: number;
    green_presence: number;
    clutter_est: number;
  };
  rating?: number; // 1-5 stars
  liked_tags?: string[];
  disliked_tags?: string[];
  thumbnail?: string; // 64x64 blurred data URL (if enabled)
  notes?: string;
}

const TANTRUM_STORE = 'tantrum_sessions';
const MEAL_STORE = 'meal_sessions';
const DB_NAME = 'silli_meter_db';
const DB_VERSION = 2;
const MAX_SESSIONS = 14;

class LocalStore {
  private db: IDBDatabase | null = null;
  private useIndexedDB = true;

  async init(): Promise<void> {
    try {
      // Try IndexedDB first
      this.db = await this.openIndexedDB();
      console.log('✅ Using IndexedDB for local storage');
    } catch (error) {
      console.warn('⚠️ IndexedDB not available, falling back to localStorage:', error);
      this.useIndexedDB = false;
    }
  }

  private openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create tantrum sessions store
        if (!db.objectStoreNames.contains(TANTRUM_STORE)) {
          const tantrumStore = db.createObjectStore(TANTRUM_STORE, { keyPath: 'id' });
          tantrumStore.createIndex('ts', 'ts', { unique: false });
        }
        
        // Create meal sessions store
        if (!db.objectStoreNames.contains(MEAL_STORE)) {
          const mealStore = db.createObjectStore(MEAL_STORE, { keyPath: 'id' });
          mealStore.createIndex('ts', 'ts', { unique: false });
        }
      };
    });
  }

  async saveSession(session: TantrumSession): Promise<void> {
    if (this.useIndexedDB && this.db) {
      await this.saveToIndexedDB(session, TANTRUM_STORE);
    } else {
      this.saveToLocalStorage(session, 'tantrum_sessions');
    }
  }

  async saveMealSession(session: MealSession): Promise<void> {
    if (this.useIndexedDB && this.db) {
      await this.saveToIndexedDB(session, MEAL_STORE);
    } else {
      this.saveToLocalStorage(session, 'meal_sessions');
    }
  }

  private async saveToIndexedDB(session: TantrumSession | MealSession, storeName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Add new session
      const addRequest = store.add(session);
      
      addRequest.onsuccess = () => {
        // Clean up old sessions (keep only last MAX_SESSIONS)
        this.cleanupOldSessions(storeName);
        resolve();
      };
      
      addRequest.onerror = () => reject(addRequest.error);
    });
  }

  private saveToLocalStorage(session: TantrumSession | MealSession, key: string): void {
    const sessions = this.getSessionsFromLocalStorage(key);
    sessions.push(session);
    
    // Keep only last MAX_SESSIONS
    if (sessions.length > MAX_SESSIONS) {
      sessions.splice(0, sessions.length - MAX_SESSIONS);
    }
    
    localStorage.setItem(key, JSON.stringify(sessions));
  }

  async getSessions(): Promise<TantrumSession[]> {
    if (this.useIndexedDB && this.db) {
      return this.getSessionsFromIndexedDB(TANTRUM_STORE);
    } else {
      return this.getSessionsFromLocalStorage('tantrum_sessions') as TantrumSession[];
    }
  }

  async getMealSessions(): Promise<MealSession[]> {
    if (this.useIndexedDB && this.db) {
      return this.getSessionsFromIndexedDB(MEAL_STORE);
    } else {
      return this.getSessionsFromLocalStorage('meal_sessions') as MealSession[];
    }
  }

  private async getSessionsFromIndexedDB(storeName: string): Promise<TantrumSession[] | MealSession[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not initialized'));
        return;
      }

      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index('ts');
      
      const request = index.getAll();
      
      request.onsuccess = () => {
        const sessions = request.result as (TantrumSession[] | MealSession[]);
        // Sort by timestamp (newest first)
        sessions.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
        resolve(sessions.slice(0, MAX_SESSIONS));
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  private getSessionsFromLocalStorage(key: string): (TantrumSession[] | MealSession[]) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];
      
      const sessions = JSON.parse(data) as (TantrumSession[] | MealSession[]);
      // Sort by timestamp (newest first)
      sessions.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
      return sessions.slice(0, MAX_SESSIONS);
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return [];
    }
  }

  private async cleanupOldSessions(storeName: string): Promise<void> {
    if (!this.db) return;

    const sessions = await this.getSessionsFromIndexedDB(storeName);
    if (sessions.length <= MAX_SESSIONS) return;

    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Delete sessions beyond MAX_SESSIONS
    const sessionsToDelete = sessions.slice(MAX_SESSIONS);
    for (const session of sessionsToDelete) {
      store.delete(session.id);
    }
  }

  async clearAll(): Promise<void> {
    if (this.useIndexedDB && this.db) {
      const transaction = this.db.transaction([TANTRUM_STORE, MEAL_STORE], 'readwrite');
      transaction.objectStore(TANTRUM_STORE).clear();
      transaction.objectStore(MEAL_STORE).clear();
    } else {
      localStorage.removeItem('tantrum_sessions');
      localStorage.removeItem('meal_sessions');
    }
  }

  async getStats(): Promise<{ total: number; avg_intensity: number; most_common_trigger: string | null }> {
    const sessions = await this.getSessions();
    
    if (sessions.length === 0) {
      return { total: 0, avg_intensity: 0, most_common_trigger: null };
    }

    const intensities = sessions
      .map(s => s.intensity_1_10)
      .filter(i => i !== undefined) as number[];
    
    const avg_intensity = intensities.length > 0 
      ? intensities.reduce((sum, i) => sum + i, 0) / intensities.length 
      : 0;

    const triggers = sessions
      .map(s => s.trigger)
      .filter(t => t !== undefined) as string[];
    
    const triggerCounts = triggers.reduce((counts, trigger) => {
      counts[trigger] = (counts[trigger] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const most_common_trigger = Object.keys(triggerCounts).length > 0
      ? Object.entries(triggerCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : null;

    return {
      total: sessions.length,
      avg_intensity: Math.round(avg_intensity * 10) / 10,
      most_common_trigger
    };
  }

  async getMealStats(): Promise<{ total: number; avg_rating: number; most_common_meal_type: string | null }> {
    const sessions = await this.getMealSessions();
    
    if (sessions.length === 0) {
      return { total: 0, avg_rating: 0, most_common_meal_type: null };
    }

    const ratings = sessions
      .map(s => s.rating)
      .filter(r => r !== undefined) as number[];
    
    const avg_rating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;

    const mealTypes = sessions
      .map(s => s.meal_type)
      .filter(t => t !== undefined) as string[];
    
    const mealTypeCounts = mealTypes.reduce((counts, mealType) => {
      counts[mealType] = (counts[mealType] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const most_common_meal_type = Object.keys(mealTypeCounts).length > 0
      ? Object.entries(mealTypeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : null;

    return {
      total: sessions.length,
      avg_rating: Math.round(avg_rating * 10) / 10,
      most_common_meal_type
    };
  }
}

// Export singleton instance
export const localStore = new LocalStore();

// Initialize on module load
localStore.init().catch(console.error); 
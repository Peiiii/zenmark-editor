export interface SyncAdapter<T> {
  load: () => Promise<T | undefined>;
  save: (data: T) => Promise<void>;
}

export class LocalStorageAdapter<T> implements SyncAdapter<T> {
  constructor(private key: string) {}

  async load(): Promise<T | undefined> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : undefined;
  }

  async save(data: T): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
}

export class IndexedDBAdapter<T> implements SyncAdapter<T> {
  constructor(
    private db: IDBDatabase,
    private storeName: string,
    private key: string
  ) {}

  async load(): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(this.key);
      request.onsuccess = () => {
        resolve(request.result || undefined);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async save(data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(data, this.key);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

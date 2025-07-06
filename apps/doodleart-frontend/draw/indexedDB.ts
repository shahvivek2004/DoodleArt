// lib/indexedDB.ts

const DB_NAME = "FavoritesDB";
const STORE_NAME = "favorites";
const DB_VERSION = 1;

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
    });
}

export async function getFavorites(): Promise<Record<number, boolean>> {
    const db = await openDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
            const result = request.result || [];
            const map: Record<number, boolean> = {};
            result.forEach((item: { id: number; isFavourite: boolean }) => {
                map[item.id] = item.isFavourite;
            });
            resolve(map);
        };
    });
}

export async function setFavorite(id: number, isFavourite: boolean) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, isFavourite });
    await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error);
    });
}

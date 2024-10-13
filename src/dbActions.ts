

let db: IDBDatabase;
let dbName = 'falconDB'

enum stores {
    productPayloads = "productPayloads",
    urls = "urls",
    planPayloads = "planPayloads",
}
export const getElement = <T>(store: string, key: string) => {
    const open = indexedDB.open(dbName);
    return new Promise<T>((resolve, reject) => {
        open.onsuccess = () => {
            let request!: IDBRequest;
            db = open.result;
            if ([...db.objectStoreNames].find((name) => name === store)) {
                const transaction = db.transaction(store);
                const objectStore = transaction.objectStore(store);
                if (key === 'all') request = objectStore.getAll();
                else request = objectStore.get(key);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
                transaction.oncomplete = () => db.close();
            } else {
                indexedDB.deleteDatabase(dbName);
            }
        };
    });
};
export const checkIfDBExist = async () => {
    const open = indexedDB.open(dbName);
    open.onupgradeneeded = async ()=>{
        console.log("called")
        db = open.result;
        db.createObjectStore(stores.productPayloads, { keyPath: "key" });
        db.createObjectStore(stores.urls, { keyPath: "key"});
        db.createObjectStore(stores.planPayloads, { keyPath: "key"});
        console.log("stores created")
        const initData = await (await fetch(`data/initialData.json`)).json()
        addDataFromFile(initData, db);
    }
};

export const addDataFromFile = (fileData:Record<string, Record<string,object>[]>, db:IDBDatabase)=>{
    ["planPayloads", "productPayloads", "urls"].forEach((fileDataKey)=>{
    if(fileData[fileDataKey]){
        fileData[fileDataKey].forEach((payload)=>{
            const transaction = db.transaction(fileDataKey, 'readwrite')
            const objectStore = transaction.objectStore(fileDataKey);
            const serialized = {key:Object.keys(payload).at(0), payload:Object.values(payload).at(0)};
            const request = objectStore.add(serialized);
            request.onerror = () => console.error(request.error);
        })
    }
    })

}

export const addElement = (store: string, payload: object) => {
    const open = indexedDB.open(dbName);
    open.onsuccess = () => {
        db = open.result;
        if ([...db.objectStoreNames].find((name) => name === store)) {
            const transaction = db.transaction(store, 'readwrite');
            const objectStore = transaction.objectStore(store);
            const serialized = JSON.parse(JSON.stringify(payload));
            const request = objectStore.add(serialized);
            request.onerror = () => console.error(request.error);
            transaction.oncomplete = () => db.close();
        } else {
            indexedDB.deleteDatabase(dbName);
        }
    };
};
export const editElement = <T>(store: string, key: string, payload: object) => {
    const open = indexedDB.open(dbName);
    return new Promise<T>((resolve, reject) => {
        open.onsuccess = () => {
            let request: IDBRequest;
            db = open.result;
            if ([...db.objectStoreNames].find((name) => name === store)) {
                const transaction = db.transaction(store, 'readwrite');
                const objectStore = transaction.objectStore(store);
                if (key === 'all') request = objectStore.getAll();
                else request = objectStore.get(key);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    const serialized = JSON.parse(JSON.stringify(payload));
                    const updateRequest = objectStore.put(serialized);
                    updateRequest.onsuccess = () => resolve(request.result);
                };
                transaction.oncomplete = () => db.close();
            } else {
                indexedDB.deleteDatabase(dbName);
            }
        };
    });
};
export const removeElement = (store: string, key: string) => {
    const open = indexedDB.open(dbName);
    open.onsuccess = () => {
        let request: IDBRequest;
        db = open.result;
        if ([...db.objectStoreNames].find((name) => name === store)) {
            const transaction = db.transaction(store, 'readwrite');
            const objectStore = transaction.objectStore(store);
            if (key === 'all') request = objectStore.clear();
            else request = objectStore.delete(key);
            request.onerror = () => console.error(request.error);
            transaction.oncomplete = () => db.close();
        } else {
            indexedDB.deleteDatabase(dbName);
        }
    };
};
import { devalue, envalue } from "./storageTypeof";
export var StorageType;
(function (StorageType) {
    StorageType["SESSION"] = "session";
    StorageType["LOCAL"] = "local";
})(StorageType || (StorageType = {}));
class StorageMemory {
    constructor() {
        this.memoryData = {};
    }
    init(o) {
        this.memoryData = o;
    }
    getData(key) {
        return this.memoryData[key];
    }
    setData(key, value) {
        this.memoryData[key] = value;
    }
}
export default class StoragePlugin {
    constructor(storageConfig) {
        this.storageMemory = new StorageMemory();
        this.storageSign = null;
        this.storageType = StorageType.SESSION;
        if (storageConfig === null || storageConfig === void 0 ? void 0 : storageConfig.storageMemory)
            this.storageMemory = storageConfig.storageMemory;
        if (storageConfig === null || storageConfig === void 0 ? void 0 : storageConfig.storageSign)
            this.storageSign = storageConfig.storageSign;
        if (storageConfig === null || storageConfig === void 0 ? void 0 : storageConfig.storageType)
            this.storageType = storageConfig.storageType;
    }
    install(unmq, ...options) {
        const __storage = {};
        const queueNameList = unmq.getQueueList().map((item) => item.name);
        for (const name of queueNameList) {
            if (name === undefined)
                continue;
            __storage[name] = null;
            Object.defineProperty(__storage, name, {
                get() {
                    return this.getStorageSync(name);
                },
                set(value) {
                    this.setStorageSync(name, value);
                },
            });
        }
        const init = () => {
            for (const name of queueNameList) {
                if (name === undefined)
                    continue;
                this.storageMemory.setData(name, this.getStorageSync(name));
                Object.defineProperty(__storage, name, {
                    get() {
                        return this.storageMemory.getData(name);
                    },
                    set(value) {
                        this.setStorageSync(name, value);
                        this.storageMemory.setData(name, value);
                    },
                });
            }
        };
        return { storage: __storage, init };
    }
    getStorageSync(name) {
        let value = null;
        const list = { [StorageType.SESSION]: sessionStorage, [StorageType.LOCAL]: localStorage };
        if (this.storageSign) {
            const storage = list[this.storageType].getItem(this.storageSign.encryptName(name));
            if (storage)
                value = this.storageSign.decryptValue(storage);
        }
        else
            value = list[this.storageType].getItem(name);
        if (value)
            return devalue(value);
        else
            return null;
    }
    setStorageSync(name, value) {
        if (value === null || value === undefined)
            return this.removeStorageSync(name);
        const list = { [StorageType.SESSION]: sessionStorage, [StorageType.LOCAL]: localStorage };
        value = envalue(value);
        if (this.storageSign)
            list[this.storageType].setItem(this.storageSign.encryptName(name), this.storageSign.encryptValue(value));
        else
            list[this.storageType].setItem(name, value);
    }
    removeStorageSync(name) {
        const list = { [StorageType.SESSION]: sessionStorage, [StorageType.LOCAL]: localStorage };
        if (this.storageSign)
            list[this.storageType].removeItem(this.storageSign.encryptName(name));
        else
            list[this.storageType].removeItem(name);
    }
}

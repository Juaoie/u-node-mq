import { isString, isObject } from "../../index";
import { getStorageSync, setStorageSync } from "./storageHandle";
export var StorageType;
(function (StorageType) {
    StorageType["SESSION"] = "session";
    StorageType["LOCAL"] = "local";
})(StorageType || (StorageType = {}));
function getStorageType(storageOption) {
    if (isString(storageOption))
        return storageOption;
    else if (isObject(storageOption))
        return storageOption.type;
    else {
        console.log(`类型错误`);
    }
}
function getStorageKey(storageOption) {
    if (isString(storageOption))
        return null;
    else if (isObject(storageOption))
        return storageOption.key;
    else {
        console.log(`类型错误`);
    }
}
class StorageMemory {
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
    constructor(storageKey, storageConfig) {
        this.storageKey = storageKey;
        this.storageMemory = (storageConfig === null || storageConfig === void 0 ? void 0 : storageConfig.storageMemory) || new StorageMemory();
        this.storageSign = storageConfig === null || storageConfig === void 0 ? void 0 : storageConfig.storageSign;
        this.storageType = storageConfig.storageType;
    }
    install(unmq, ...options) {
        const __storage = {};
        for (const key of list) {
            __storage[key] = null;
        }
        return __storage;
    }
    init() { }
}
export function createStoragePlugin(storageData, storageConfig) {
    storageConfig = storageConfig || {};
    const __storage = {};
    for (const key in storageData) {
        __storage[key] = null;
    }
    storageConfig.storageMemory.init(JSON.parse(JSON.stringify(__storage)));
    return {
        storage: __storage,
        init: () => {
            for (const name in storageData) {
                const type = getStorageType(storageData[name]);
                const key = getStorageKey(storageData[name]) || storageConfig.key;
                if (storageConfig.storageMemory) {
                    storageConfig.storageMemory.setData(name, getStorageSync(name, type, key));
                }
                Object.defineProperty(__storage, name, {
                    get() {
                        if (storageConfig.storageMemory) {
                            return storageConfig.storageMemory.getData(name);
                        }
                        else {
                            return getStorageSync(name, type, key);
                        }
                    },
                    set(value) {
                        setStorageSync(name, type, value, key);
                        if (storageConfig.storageMemory) {
                            storageConfig.storageMemory.setData(name, value);
                        }
                    },
                });
            }
        },
    };
}

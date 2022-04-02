import { isString, isObject } from "../../index";
import { getStorageSync, setStorageSync } from "./storageHandle";
import { devalue, envalue } from "./storageTypeof";
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
        console.log("\u7C7B\u578B\u9519\u8BEF");
    }
}
function getStorageKey(storageOption) {
    if (isString(storageOption))
        return null;
    else if (isObject(storageOption))
        return storageOption.key;
    else {
        console.log("\u7C7B\u578B\u9519\u8BEF");
    }
}
export function createStoragePlugin(storageData, storageConfig) {
    storageConfig = storageConfig || {};
    var __storage = {};
    for (var key in storageData) {
        __storage[key] = null;
    }
    return {
        storage: __storage,
        init: function () {
            var _loop_1 = function (name_1) {
                var type = getStorageType(storageData[name_1]);
                var key = getStorageKey(storageData[name_1]) || storageConfig.key;
                if (storageConfig.storageMemory) {
                    storageConfig.storageMemory.setData(name_1, getStorageSync(name_1, type, key));
                }
                Object.defineProperty(__storage, name_1, {
                    get: function () {
                        if (storageConfig.storageMemory) {
                            return storageConfig.storageMemory.getData(name_1);
                        }
                        else {
                            return devalue(getStorageSync(name_1, type, key));
                        }
                    },
                    set: function (value) {
                        setStorageSync(name_1, type, envalue(value), key);
                        if (storageConfig.storageMemory) {
                            storageConfig.storageMemory.setData(name_1, value);
                        }
                    },
                });
            };
            for (var name_1 in storageData) {
                _loop_1(name_1);
            }
        },
    };
}

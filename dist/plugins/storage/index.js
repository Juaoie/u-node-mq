import md5 from "js-md5";
import { encode, decode } from "js-base64";
export function signFun(obj, appkey) {
    if (!obj.ts)
        obj.ts = new Date().getTime().toString();
    var params = new URLSearchParams(obj);
    params.sort();
    var str = md5(params.toString() + appkey).toUpperCase();
    Object.assign(obj, { sn: str });
    return encode(JSON.stringify(obj));
}
var storageDecode = function (name, type, storage, key) {
    var _a = JSON.parse(decode(storage)), value = _a.value, ts = _a.ts;
    if (signFun({ value: value, ts: ts }, key) === storage)
        return value;
    else {
        removeStorageSync(name, type);
        throw "服务器正遭受攻击，部分功能可能出现异常。给您带来不便，我们深表歉意！";
    }
};
var getStorageSync = function (name, type, key) {
    if (type === StorageType.SESSION) {
        if (key) {
            var storage = sessionStorage.getItem(md5(name).toUpperCase());
            if (storage)
                return storageDecode(name, type, storage, key);
            else
                return null;
        }
        else {
            var storage = sessionStorage.getItem(name);
            if (storage)
                return storage;
            else
                return null;
        }
    }
    else if (type === StorageType.LOCAL) {
        if (key) {
            var storage = localStorage.getItem(md5(name).toUpperCase());
            if (storage)
                return storageDecode(name, type, storage, key);
            else
                return null;
        }
        else {
            var storage = localStorage.getItem(name);
            if (storage)
                return storage;
            else
                return null;
        }
    }
};
var setStorageSync = function (name, type, value, key) {
    if (type === StorageType.SESSION) {
        if (key) {
            sessionStorage.setItem(md5(name).toUpperCase(), signFun({ value: value }, key));
        }
        else {
            sessionStorage.setItem(name, value);
        }
    }
    else if (type === StorageType.LOCAL) {
        if (key) {
            localStorage.setItem(md5(name).toUpperCase(), signFun({ value: value }, key));
        }
        else {
            localStorage.setItem(name, value);
        }
    }
};
var removeStorageSync = function (key, type) {
    if (type === "session")
        sessionStorage.removeItem(md5(key).toUpperCase());
    else if (type === "local")
        localStorage.removeItem(md5(key).toUpperCase());
};
export var StorageType;
(function (StorageType) {
    StorageType["SESSION"] = "session";
    StorageType["LOCAL"] = "local";
})(StorageType || (StorageType = {}));
export function createStoragePlugin(storageData, storageConfig) {
    storageConfig = storageConfig || {};
    var _loop_1 = function (name_1) {
        if (storageConfig.storageMemory) {
            storageConfig.storageMemory.setData(name_1, getStorageSync(name_1, storageData[name_1].type, storageData[name_1].key || storageConfig.key));
        }
        Object.defineProperty(storageData, name_1, {
            get: function () {
                if (storageConfig.storageMemory) {
                    return storageConfig.storageMemory.getData(name_1);
                }
                else {
                    return getStorageSync(name_1, storageData[name_1].type, storageData[name_1].key || storageConfig.key);
                }
            },
            set: function (value) {
                setStorageSync(name_1, storageData[name_1].type, value, storageData[name_1].key || storageConfig.key);
                if (storageConfig.storageMemory) {
                    storageConfig.storageMemory.setData(name_1, value);
                }
            },
        });
    };
    for (var name_1 in storageData) {
        _loop_1(name_1);
    }
    return storageData;
}

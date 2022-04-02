import { StorageType } from ".";
import md5 from "js-md5";
import { envalue, devalue } from "./storageTypeof";
import { signFun, storageDecode } from "./sign";
export var getStorageSync = function (name, type, key) {
    var value = null;
    if (type === StorageType.SESSION) {
        if (key) {
            var storage = sessionStorage.getItem(md5(name).toUpperCase());
            if (storage)
                value = storageDecode(name, type, storage, key);
        }
        else
            value = sessionStorage.getItem(name);
    }
    else if (type === StorageType.LOCAL) {
        if (key) {
            var storage = localStorage.getItem(md5(name).toUpperCase());
            if (storage)
                value = storageDecode(name, type, storage, key);
        }
        else
            value = localStorage.getItem(name);
    }
    return value || devalue(value);
};
export var setStorageSync = function (name, type, value, key) {
    if (value === null || value === undefined)
        return removeStorageSync(name, type, key);
    value = envalue(value);
    if (type === StorageType.SESSION) {
        if (key)
            sessionStorage.setItem(md5(name).toUpperCase(), signFun({ value: value }, key));
        else
            sessionStorage.setItem(name, value);
    }
    else if (type === StorageType.LOCAL) {
        if (key)
            localStorage.setItem(md5(name).toUpperCase(), signFun({ value: value }, key));
        else
            localStorage.setItem(name, value);
    }
};
export var removeStorageSync = function (name, type, key) {
    if (type === StorageType.SESSION) {
        if (key)
            sessionStorage.removeItem(md5(name).toUpperCase());
        else
            sessionStorage.removeItem(name);
    }
    else if (type === StorageType.LOCAL) {
        if (key)
            localStorage.removeItem(md5(name).toUpperCase());
        else
            localStorage.removeItem(name);
    }
};

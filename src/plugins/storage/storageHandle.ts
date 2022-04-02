import { StorageType } from ".";
import md5 from "js-md5";
import { envalue, devalue } from "./storageTypeof";
import { signFun, storageDecode } from "./sign";

/**
 * 同步获取缓存
 * @param key
 * @param type
 * @returns
 */
export const getStorageSync = (name: string, type: StorageType, key?: string) => {
  let value = null;
  if (type === StorageType.SESSION) {
    if (key) {
      const storage = sessionStorage.getItem(md5(name).toUpperCase());
      if (storage) value = storageDecode(name, type, storage, key);
    } else value = sessionStorage.getItem(name);
  } else if (type === StorageType.LOCAL) {
    if (key) {
      const storage = localStorage.getItem(md5(name).toUpperCase());
      if (storage) value = storageDecode(name, type, storage, key);
    } else value = localStorage.getItem(name);
  }
  if (value) {
    return devalue(value);
  } else return null;
};
/**
 * 同步设置缓存
 * @param key
 * @param type
 * @param value
 */
export const setStorageSync = (name: string, type: StorageType, value: string, key?: string) => {
  if (value === null || value === undefined) return removeStorageSync(name, type, key);
  value = envalue(value);
  if (type === StorageType.SESSION) {
    if (key) sessionStorage.setItem(md5(name).toUpperCase(), signFun({ value }, key));
    else sessionStorage.setItem(name, value);
  } else if (type === StorageType.LOCAL) {
    if (key) localStorage.setItem(md5(name).toUpperCase(), signFun({ value }, key));
    else localStorage.setItem(name, value);
  }
};
/**
 * 同步删除缓存
 * @param key
 * @param type
 */
export const removeStorageSync = (name: string, type: StorageType, key: string) => {
  if (type === StorageType.SESSION) {
    if (key) sessionStorage.removeItem(md5(name).toUpperCase());
    else sessionStorage.removeItem(name);
  } else if (type === StorageType.LOCAL) {
    if (key) localStorage.removeItem(md5(name).toUpperCase());
    else localStorage.removeItem(name);
  }
};

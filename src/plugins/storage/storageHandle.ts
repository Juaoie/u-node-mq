import { StorageType } from ".";
import md5 from "js-md5";
import { signFun, storageDecode } from "./sign";


/**
 * 同步获取缓存
 * @param key
 * @param type
 * @returns
 */
export const getStorageSync = (name: string, type: StorageType, key?: string) => {
  if (type === StorageType.SESSION) {
    if (key) {
      const storage = sessionStorage.getItem(md5(name).toUpperCase());
      if (storage) return storageDecode(name, type, storage, key);
      else return null;
    } else {
      const storage = sessionStorage.getItem(name);
      if (storage) return storage;
      else return null;
    }
  } else if (type === StorageType.LOCAL) {
    if (key) {
      const storage = localStorage.getItem(md5(name).toUpperCase());
      if (storage) return storageDecode(name, type, storage, key);
      else return null;
    } else {
      const storage = localStorage.getItem(name);
      if (storage) return storage;
      else return null;
    }
  }
};
/**
 * 同步设置缓存
 * @param key
 * @param type
 * @param value
 */
export const setStorageSync = (name: string, type: StorageType, value: string, key?: string) => {
  if (value === null || value === undefined) return removeStorageSync(name, type, key);
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

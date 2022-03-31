import StorageAdapterAbstract from "./StorageAdapterAbstract";
import md5 from "js-md5";
import { encode, decode } from "js-base64";
/**
 * @name  sign.js
 * @description  数据传输加密
 * 依赖关系 js-md5 js-base64
 */

/**
 * signFun 导出加密函数
 * @param  {Object} 	obj
 * @param  {string} 	appkey
 * @return {string} 	返回加密字符串发送后端
 */
export function signFun(obj: Record<string, string>, appkey: string): string {
  if (!obj.ts) obj.ts = new Date().getTime().toString();
  const params = new URLSearchParams(obj);
  params.sort();
  const str = md5(params.toString() + appkey).toUpperCase();
  Object.assign(obj, { sn: str });
  return encode(JSON.stringify(obj));
}

/**
 * 缓存解码
 * @param key
 * @param type
 * @param storage
 * @returns
 */
const storageDecode = (name: string, type: StorageType, storage: string, key: string) => {
  const { value, ts } = JSON.parse(decode(storage));
  if (signFun({ value, ts }, key) === storage) return value;
  else {
    removeStorageSync(name, type);
    throw "服务器正遭受攻击，部分功能可能出现异常。给您带来不便，我们深表歉意！";
  }
};

/**
 * 同步获取缓存
 * @param key
 * @param type
 * @returns
 */
const getStorageSync = (name: string, type: StorageType, key?: string) => {
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
const setStorageSync = (name: string, type: StorageType, value: string, key?: string) => {
  if (type === StorageType.SESSION) {
    if (key) {
      sessionStorage.setItem(md5(name).toUpperCase(), signFun({ value }, key));
    } else {
      sessionStorage.setItem(name, value);
    }
  } else if (type === StorageType.LOCAL) {
    if (key) {
      localStorage.setItem(md5(name).toUpperCase(), signFun({ value }, key));
    } else {
      localStorage.setItem(name, value);
    }
  }
};
/**
 * 同步删除缓存
 * @param key
 * @param type
 */
const removeStorageSync = (key: string, type: StorageType) => {
  if (type === StorageType.SESSION) sessionStorage.removeItem(md5(key).toUpperCase());
  else if (type === StorageType.LOCAL) localStorage.removeItem(md5(key).toUpperCase());
};

export enum StorageType {
  SESSION = "session",
  LOCAL = "local",
}

type StorageOption =
  | (StorageType & { type?: StorageType; key?: string })
  | {
      type: StorageType;
      key?: string;
    };
type StorageConfig = {
  storageMemory?: StorageAdapterAbstract;
  key?: string;
};
type B<T> = {
  [k in keyof T]: any;
};
export function createStoragePlugin<StorageData extends Record<string, StorageOption>>(
  storageData: StorageData,
  storageConfig?: StorageConfig
): B<StorageData> {
  storageConfig = storageConfig || {};
  const __storage = {} as B<StorageData>;
  for (const key in storageData) {
    __storage[key] = null;
  }

  for (const name in storageData) {
    if (storageConfig.storageMemory) {
      storageConfig.storageMemory.setData(
        name,
        getStorageSync(name, storageData[name].type, storageData[name].key || storageConfig.key)
      );
    }
    Object.defineProperty(__storage, name, {
      get() {
        if (storageConfig.storageMemory) {
          //从缓存中取
          return storageConfig.storageMemory.getData(name);
        } else {
          //直接取storage
          return getStorageSync(name, storageData[name].type, storageData[name].key || storageConfig.key);
        }
      },
      set(value: string) {
        setStorageSync(name, storageData[name].type, value, storageData[name].key || storageConfig.key);
        if (storageConfig.storageMemory) {
          storageConfig.storageMemory.setData(name, value);
        }
      },
    });
  }

  return __storage;
}

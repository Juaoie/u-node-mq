import StorageAdapterAbstract from "./StorageAdapterAbstract";
import { isString, isObject } from "../../index";
import { getStorageSync, setStorageSync } from "./storageHandle";
import { devalue, envalue } from "./storageTypeof";

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
function getStorageType(storageOption: StorageOption): StorageType {
  if (isString(storageOption)) return storageOption;
  else if (isObject(storageOption)) return storageOption.type;
  else {
    console.log(`类型错误`);
  }
}
function getStorageKey(storageOption: StorageOption): string {
  if (isString(storageOption)) return null;
  else if (isObject(storageOption)) return storageOption.key;
  else {
    console.log(`类型错误`);
  }
}

export function createStoragePlugin<StorageData extends Record<string, StorageOption>>(
  storageData: StorageData,
  storageConfig?: StorageConfig
) {
  storageConfig = storageConfig || {};
  const __storage = {} as B<StorageData>;
  for (const key in storageData) {
    __storage[key] = null;
  }

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
              //从缓存中取
              return storageConfig.storageMemory.getData(name);
            } else {
              //直接取storage
              return devalue(getStorageSync(name, type, key));
            }
          },
          set(value: string) {
            setStorageSync(name, type, envalue(value), key);
            if (storageConfig.storageMemory) {
              storageConfig.storageMemory.setData(name, value);
            }
          },
        });
      }
    },
  };
}

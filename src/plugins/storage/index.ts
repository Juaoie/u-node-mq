import StorageAdapterAbstract from "./StorageAdapterAbstract";
import UNodeMQ, { isString, isObject, Exchange, Queue } from "../../index";
import { getStorageSync, setStorageSync } from "./storageHandle";
import StorageSignAbstract from "./StorageSignAbstract";

//TODO:实现storage存储超出警告
//TODO:抽象sing函数，删除key

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
  storageType: StorageType;
  storageMemory?: StorageAdapterAbstract;
  storageSign?: StorageSignAbstract;
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

class StorageMemory implements StorageAdapterAbstract {
  private memoryData: Record<string, string>;
  init(o: Record<string, null>): void {
    this.memoryData = o;
  }
  getData(key: string): string {
    return this.memoryData[key];
  }
  setData(key: string, value: string): void {
    this.memoryData[key] = value;
  }
}

export default class StoragePlugin {
  private storageMemory: StorageAdapterAbstract; //代理访问内存
  private storageSign: StorageSignAbstract; //加密方法
  private storageType: StorageType; //storage 存储发啊是
  constructor(private readonly storageKey: string[], storageConfig: StorageConfig) {
    this.storageMemory = storageConfig?.storageMemory || new StorageMemory();
    this.storageSign = storageConfig?.storageSign;
    this.storageType = storageConfig.storageType;
  }
  install(unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>, ...options: any[]) {

    const __storage = {}
    for (const key of list) {
      __storage[key]=null
    }
    return __storage;
  }
  init() {}
}

export function createStoragePlugin<StorageData extends Record<string, StorageType>>(
  storageData: StorageData,
  storageConfig?: StorageConfig
) {
  storageConfig = storageConfig || {};
  const __storage = {} as B<StorageData>;
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
              //从缓存中取
              return storageConfig.storageMemory.getData(name);
            } else {
              //直接取storage
              return getStorageSync(name, type, key);
            }
          },
          set(value: string) {
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

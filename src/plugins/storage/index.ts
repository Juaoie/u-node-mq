import StorageAdapterAbstract from "./StorageAdapterAbstract";
import UNodeMQ, { isString, isObject, Exchange, Queue } from "../../index";
import StorageSignAbstract from "./StorageSignAbstract";
import { devalue, envalue } from "./storageTypeof";

//TODO:实现storage存储超出警告

export enum StorageType {
  SESSION = "session",
  LOCAL = "local",
}

type StorageConfig = {
  storageType: StorageType;
  storageMemory?: StorageAdapterAbstract;
  storageSign?: StorageSignAbstract;
};

class StorageMemory implements StorageAdapterAbstract {
  private memoryData: Record<string, any>;
  init(o: Record<string, any>): void {
    this.memoryData = o;
  }
  getData(key: string): string {
    return this.memoryData[key];
  }
  setData(key: string, value: string): void {
    this.memoryData[key] = value;
  }
}
/**
 * storage plugin
 */
export default class StoragePlugin<D extends UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>> {
  private storageMemory: StorageAdapterAbstract = new StorageMemory(); //代理访问内存
  private storageSign: StorageSignAbstract; //加密方法
  private storageType: StorageType = StorageType.SESSION; //storage 存储类型
  private unmq: D | null = null;
  constructor(storageConfig?: StorageConfig) {
    if (storageConfig?.storageMemory) this.storageMemory = storageConfig.storageMemory;
    if (storageConfig?.storageSign) this.storageSign = storageConfig.storageSign;
    if (storageConfig?.storageType) this.storageType = storageConfig.storageType;
  }
  install(unmq: D, ...options: any[]) {
    this.unmq = unmq;
    const __storage: Record<string, any> = {};
    const queueNameList = unmq.getQueueList().map((item) => item.name);
    for (const name of queueNameList) {
      __storage[name] = null;
      Object.defineProperty(__storage, name, {
        get() {
          return this.getStorageSync(name);
        },
        set(value: any) {
          this.setStorageSync(name, value);
        },
      });
    }
    //内存缓存初始化之前从storage里面获取
    function init() {
      for (const name of queueNameList) {
        this.storageMemory.setData(name, this.getStorageSync(name));
        Object.defineProperty(__storage, name, {
          get() {
            return this.storageMemory.getData(name);
          },
          set(value: any) {
            this.setStorageSync(name, value);
            this.storageMemory.setData(name, value);
          },
        });
      }
    }
    return { storage: __storage, init };
  }
  /**
   *
   * @param name
   * @returns
   */
  private getStorageSync(name: string) {
    let value = null;
    const list = { [StorageType.SESSION]: sessionStorage, [StorageType.LOCAL]: localStorage };
    if (this.storageSign) {
      const storage = list[this.storageType].getItem(this.storageSign.encryptName(name));
      if (storage) value = this.storageSign.decryptValue(storage);
    } else value = list[this.storageType].getItem(name);
    //数据类型编码解码
    if (value) return devalue(value);
    else return null;
  }
  /**
   * 同步设置缓存
   * @param key
   * @param type
   * @param value
   */
  private setStorageSync(name: string, value: any) {
    if (value === null || value === undefined) return this.removeStorageSync(name);
    const list = { [StorageType.SESSION]: sessionStorage, [StorageType.LOCAL]: localStorage };
    value = envalue(value);
    if (this.storageSign)
      list[this.storageType].setItem(this.storageSign.encryptName(name), this.storageSign.encryptValue(value));
    else list[this.storageType].setItem(name, value);
  }
  /**
   *
   * @param name
   */
  private removeStorageSync(name: string) {
    const list = { [StorageType.SESSION]: sessionStorage, [StorageType.LOCAL]: localStorage };
    if (this.storageSign) list[this.storageType].removeItem(this.storageSign.encryptName(name));
    else list[this.storageType].removeItem(name);
  }
}

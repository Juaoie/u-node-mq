import { StoreDefinition } from "pinia";
import StorageAdapterAbstract from "../plugins/storage/StorageAdapterAbstract";
/**
 * 实现简单状态管理
 */

export default class VueStorageAdapter implements StorageAdapterAbstract {
  private storeDefinition: StoreDefinition;
  constructor(storeDefinition: StoreDefinition) {
    this.storeDefinition = storeDefinition;
  }
  getData(key: string) {
    const __store = this.storeDefinition();
    return __store[key];
  }
  setData(key: string, value: any) {
    const __store = this.storeDefinition();
    __store[key] = value;
  }
}

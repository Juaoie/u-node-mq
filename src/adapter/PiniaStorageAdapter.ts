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
    const store = this.storeDefinition();
    return store[key];
  }
  setData(key: string, value: any) {
    const store = this.storeDefinition();
    store[key] = value;
  }
}

import { StoreDefinition } from "pinia";
import StorageAdapterAbstract from "../plugins/storage/StorageAdapterAbstract";
/**
 * 实现简单状态管理
 */
//TODO:不让用户填入数据，数据通过storage自动填入

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

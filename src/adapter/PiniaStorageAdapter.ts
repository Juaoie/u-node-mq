import { Store } from "pinia";
import StorageAdapterAbstract from "../plugins/storage/StorageAdapterAbstract";
/**
 * 实现简单状态管理
 */

export default class VueStorageAdapter implements StorageAdapterAbstract {
  private store: Store;
  constructor(store: Store) {
    this.store = store;
  }
  getData(key: string) {
    return this.store[key];
  }
  setData(key: string, value: any) {
    this.store[key] = value;
  }
}

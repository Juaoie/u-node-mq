import StorageAdapterAbstract from "../dist/plugins/storage/StorageAdapterAbstract";
export default class VueStorageAdapter implements StorageAdapterAbstract {
  private storeDefinition;
  init(o: Record<string, null>): void;
  getData(key: string): any;
  setData(key: string, value: any): void;
}

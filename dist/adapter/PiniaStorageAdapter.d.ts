import { Store } from "pinia";
import StorageAdapterAbstract from "../plugins/storage/StorageAdapterAbstract";
export default class VueStorageAdapter implements StorageAdapterAbstract {
    private store;
    constructor(store: Store);
    getData(key: string): any;
    setData(key: string, value: any): void;
}

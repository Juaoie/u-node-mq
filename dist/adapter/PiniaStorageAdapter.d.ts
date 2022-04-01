import { StoreDefinition } from "pinia";
import StorageAdapterAbstract from "../plugins/storage/StorageAdapterAbstract";
export default class VueStorageAdapter implements StorageAdapterAbstract {
    private storeDefinition;
    constructor(storeDefinition: StoreDefinition);
    getData(key: string): any;
    setData(key: string, value: any): void;
}

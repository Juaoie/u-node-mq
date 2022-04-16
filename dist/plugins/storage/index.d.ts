import StorageAdapterAbstract from "./StorageAdapterAbstract";
import UNodeMQ, { Exchange, Queue } from "../../index";
import StorageSignAbstract from "./StorageSignAbstract";
export declare enum StorageType {
    SESSION = "session",
    LOCAL = "local"
}
declare type StorageConfig = {
    storageType: StorageType;
    storageMemory?: StorageAdapterAbstract;
    storageSign?: StorageSignAbstract;
};
declare type B<T> = {
    [k in keyof T]: any;
};
export default class StoragePlugin {
    private readonly storageKey;
    private storageMemory;
    private storageSign;
    private storageType;
    constructor(storageKey: string[], storageConfig: StorageConfig);
    install(unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>, ...options: any[]): {};
    init(): void;
}
export declare function createStoragePlugin<StorageData extends Record<string, StorageType>>(storageData: StorageData, storageConfig?: StorageConfig): {
    storage: B<StorageData>;
    init: () => void;
};
export {};

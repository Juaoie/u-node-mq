import StorageAdapterAbstract from "./StorageAdapterAbstract";
import UNodeMQ, { Exchange, Queue } from "../../index";
import StorageSignAbstract from "./StorageSignAbstract";
export declare enum StorageType {
    SESSION = "session",
    LOCAL = "local"
}
declare type StorageConfig = {
    storageType?: StorageType;
    storageMemory?: StorageAdapterAbstract;
    storageSign?: StorageSignAbstract;
};
export default class StoragePlugin<D extends UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>> {
    private storageMemory;
    private storageSign;
    private storageType;
    constructor(storageConfig?: StorageConfig);
    install(unmq: D, ...options: any[]): {
        storage: Record<string, any>;
        init: () => void;
    };
    private getStorageSync;
    private setStorageSync;
    private removeStorageSync;
}
export {};

import StorageAdapterAbstract from "./StorageAdapterAbstract";
export declare function signFun(obj: Record<string, string>, appkey: string): string;
export declare enum StorageType {
    SESSION = "session",
    LOCAL = "local"
}
declare type StorageOption = (StorageType & {
    type?: StorageType;
    key?: string;
}) | {
    type: StorageType;
    key?: string;
};
declare type StorageConfig = {
    storageMemory?: StorageAdapterAbstract;
    key?: string;
};
export declare function createStoragePlugin<StorageData extends Record<string, StorageOption>>(storageData: StorageData, storageConfig?: StorageConfig): () => void;
export {};

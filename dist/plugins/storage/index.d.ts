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
declare type B<T> = {
    [k in keyof T]: string | null;
};
export declare function createStoragePlugin<StorageData extends Record<string, StorageOption>>(storageData: StorageData, storageConfig?: StorageConfig): B<StorageData>;
export {};

import { StorageType } from ".";
export declare const getStorageSync: (name: string, type: StorageType, key?: string | undefined) => any;
export declare const setStorageSync: (name: string, type: StorageType, value: string, key?: string | undefined) => void;
export declare const removeStorageSync: (name: string, type: StorageType, key: string) => void;

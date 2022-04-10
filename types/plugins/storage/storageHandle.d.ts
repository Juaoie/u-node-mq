import { StorageType } from ".";
export declare const getStorageSync: (name: string, type: StorageType, key?: string) => any;
export declare const setStorageSync: (name: string, type: StorageType, value: string, key?: string) => void;
export declare const removeStorageSync: (name: string, type: StorageType, key: string) => void;

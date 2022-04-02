import { StorageType } from ".";
export declare function signFun(obj: Record<string, string>, appkey: string): string;
export declare const storageDecode: (name: string, type: StorageType, storage: string, key: string) => any;

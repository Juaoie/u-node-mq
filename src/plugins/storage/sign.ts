import { encode, decode } from "js-base64";
import md5 from "js-md5";
import { StorageType } from ".";
import { removeStorageSync } from "./storageHandle";

/**
 * @name  sign.js
 * @description  数据传输加密
 * 依赖关系 js-md5 js-base64
 */

/**
 * signFun 导出加密函数
 * @param  {Object} 	obj
 * @param  {string} 	appkey
 * @return {string} 	返回加密字符串发送后端
 */
export function signFun(obj: Record<string, string>, appkey: string): string {
  if (!obj.ts) obj.ts = new Date().getTime().toString();
  const params = new URLSearchParams(obj);
  params.sort();
  const str = md5(params.toString() + appkey).toUpperCase();
  Object.assign(obj, { sn: str });
  return encode(JSON.stringify(obj));
}
/**
 * 缓存解码
 * @param key
 * @param type
 * @param storage
 * @returns
 */
export const storageDecode = (name: string, type: StorageType, storage: string, key: string) => {
  const { value, ts } = JSON.parse(decode(storage));
  if (signFun({ value, ts }, key) === storage) return value;
  else {
    removeStorageSync(name, type, key);
    throw "服务器正遭受攻击，部分功能可能出现异常。给您带来不便，我们深表歉意！";
  }
};

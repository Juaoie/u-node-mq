/**
 * @name  sign.js
 * @description  数据传输加密
 * 依赖关系 js-md5 js-base64
 */

import md5 from "js-md5";
import { encode } from "js-base64";

/**
 * signFun 导出加密函数
 * @param  {Object} 	obj     请求参数对象
 * @param  {string} 	appkey  请求appkey
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

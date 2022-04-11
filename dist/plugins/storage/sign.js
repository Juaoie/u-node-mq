import { encode, decode } from "js-base64";
import md5 from "js-md5";
import { removeStorageSync } from "./storageHandle";
export function signFun(obj, appkey) {
    if (!obj.ts)
        obj.ts = new Date().getTime().toString();
    const str = md5(Object.entries(obj)
        .filter((item) => item[1] !== undefined)
        .map((item) => item[0] + "=" + item[1])
        .sort()
        .join("&") + appkey).toUpperCase();
    Object.assign(obj, { sn: str });
    return encode(JSON.stringify(obj));
}
export const storageDecode = (name, type, storage, key) => {
    const { value, ts } = JSON.parse(decode(storage));
    if (signFun({ value, ts }, key) === storage)
        return value;
    else {
        removeStorageSync(name, type, key);
        throw "服务器正遭受攻击，部分功能可能出现异常。给您带来不便，我们深表歉意！";
    }
};

import { encode, decode } from "js-base64";
import md5 from "js-md5";
import { removeStorageSync } from "./storageHandle";
export function signFun(obj, appkey) {
    if (!obj.ts)
        obj.ts = new Date().getTime().toString();
    var str = md5(Object.entries(obj)
        .filter(function (item) { return item[1] !== undefined; })
        .map(function (item) { return item[0] + "=" + item[1]; })
        .sort()
        .join("&") + appkey).toUpperCase();
    Object.assign(obj, { sn: str });
    return encode(JSON.stringify(obj));
}
export var storageDecode = function (name, type, storage, key) {
    var _a = JSON.parse(decode(storage)), value = _a.value, ts = _a.ts;
    if (signFun({ value: value, ts: ts }, key) === storage)
        return value;
    else {
        removeStorageSync(name, type, key);
        throw "服务器正遭受攻击，部分功能可能出现异常。给您带来不便，我们深表歉意！";
    }
};

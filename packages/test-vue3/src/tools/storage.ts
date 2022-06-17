import md5 from "js-md5";
import { signFun } from "./sign";
import { decode } from "js-base64";
//可以使用appkey ，也可以灵活配置
const { VITE_APP_KEY } = import.meta.env;
//数据缓存
const STORAGE_NAME_LIST = [
  { key: "mode", type: "local" }, //应用模式 dark晚上 light白天
  { key: "userName", type: "local" },
  { key: "userId", type: "local" },
  { key: "phone", type: "session" },
  { key: "avatarUrl", type: "session" }, //头像
  { key: "sex", type: "session" }, //性别
  { key: "resume", type: "session" }, //个人简介
  { key: "grade", type: "session" }, //用户等级
  { key: "isApproval", type: "session" }, //是否是评审人
  { key: "bankName", type: "session" }, //开户行
  { key: "bankCardNumber", type: "session" }, //银行卡号
  { key: "bankCardUserName", type: "session" }, //持卡人
  { key: "userAccredit", type: "session" }, //是否进行了身份认证，一次登录只认证一次
];
const STORAGE_VERSION = "1";
const storage: Record<string, string | number | null> = {};
const storageMemory: Record<string, string | number | null> = {};

const storageDecode = (key: string, type: string, storage: string) => {
  const { value, ts } = JSON.parse(decode(storage));
  if (signFun({ value, ts }, VITE_APP_KEY as string) === storage) return value;
  else {
    removeStorageSync(key, type);
    throw "服务器正遭受攻击，部分功能可能出现异常。给您带来不便，我们深表歉意！";
  }
};

const getStorageSync = (key: string, type: string) => {
  if (type === "session") {
    const storage = sessionStorage.getItem(md5(key).toUpperCase());
    if (storage) return storageDecode(key, type, storage);
    else return null;
  } else if (type === "local") {
    const storage = localStorage.getItem(md5(key).toUpperCase());
    if (storage) return storageDecode(key, type, storage);
    else return null;
  }
};
const setStorageSync = (key: string, type: string, value: string) => {
  if (type === "session") {
    sessionStorage.setItem(md5(key).toUpperCase(), signFun({ value }, VITE_APP_KEY as string));
  } else if (type === "local") {
    localStorage.setItem(md5(key).toUpperCase(), signFun({ value }, VITE_APP_KEY as string));
  }
};

const removeStorageSync = (key: string, type: string) => {
  if (type === "session") sessionStorage.removeItem(md5(key).toUpperCase());
  else if (type === "local") localStorage.removeItem(md5(key).toUpperCase());
};

STORAGE_NAME_LIST.forEach(({ key, type }) => {
  storageMemory[key] = getStorageSync(key + STORAGE_VERSION, type);
  Object.defineProperty(storage, key, {
    set: (value: any) => {
      if (value === null) removeStorageSync(key + STORAGE_VERSION, type);
      else setStorageSync(key + STORAGE_VERSION, type, value);
      storageMemory[key] = value;
    },
    get: () => {
      return storageMemory[key];
    },
  });
});
export default storage;

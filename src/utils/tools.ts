/**
 * 获取随机数
 * @returns
 */
export const random = (): string => String(Math.round(Math.random() * 10000000000));

export const promiseSetTimeout = (time = 0) => new Promise(resolve => setTimeout(resolve, time));

/**
 * 获取格式化时间
 * @param time
 * @returns
 */
export const getTimeFormat = (time?: string | number): string => {
  let now = null;
  if (time) now = new Date(time);
  else now = new Date();

  const year = now.getFullYear(); //年
  const month = now.getMonth() + 1; //月
  const day = now.getDate(); //日

  const hh = now.getHours(); //时
  const mm = now.getMinutes(); //分

  let clock = year + "-";

  if (month < 10) clock += "0";
  clock += month + "-";

  if (day < 10) clock += "0";
  clock += day + " ";

  if (hh < 10) clock += "0";
  clock += hh + ":";
  if (mm < 10) clock += "0";
  clock += mm;
  return clock;
};
/**
   *   //字符编码数值对应的存储长度：
  //UCS-2编码(16进制) UTF-8 字节流(二进制)
  //0000 - 007F       0xxxxxxx （1字节）
  //0080 - 07FF       110xxxxx 10xxxxxx （2字节）
  //0800 - FFFF       1110xxxx 10xxxxxx 10xxxxxx （3字节）
   * @param str 
   * @returns 
   */
export const memorySize = (str: string): string => {
  let totalLength = 0;
  let charCode;
  for (let i = 0; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    if (charCode < 0x007f) {
      totalLength++;
    } else if (0x0080 <= charCode && charCode <= 0x07ff) {
      totalLength += 2;
    } else if (0x0800 <= charCode && charCode <= 0xffff) {
      totalLength += 3;
    } else {
      totalLength += 4;
    }
  }
  if (totalLength >= 1024 * 1024) return (totalLength / (1024 * 1024)).toFixed(2) + "MB";
  if (totalLength >= 1024 && totalLength < 1024 * 1024) return (totalLength / 1024).toFixed(2) + "KB";
  else return totalLength + "B";
};

/**
 * 转换
 */
export const extend = Object.assign;
export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

/**
 * 类型判断
 */
export const isArray = Array.isArray;
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === "[object Map]";
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === "[object Set]";
export const isDate = (val: unknown): val is Date => val instanceof Date;
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (val: unknown): val is Function => typeof val === "function";
export const isString = (val: unknown): val is string => typeof val === "string";
export const isNumber = (val: unknown): val is number => typeof val === "number";
export const isBoolean = (val: unknown): val is boolean => typeof val === "boolean";
export const isSymbol = (val: unknown): val is symbol => typeof val === "symbol";
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === "object";
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

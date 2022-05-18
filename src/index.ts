import Exchange from "./internal/Exchange";
import Queue, { ConsumMode, Operator } from "./internal/Queue";
import Consumer from "./internal/Consumer";
import News from "./internal/News";
import Logs from "./internal/Logs";

import UNodeMQ, { createUnmq, createQuickUnmq, QuickUNodeMQ, PluginInstallFunction } from "./core/UNodeMQ";
export default UNodeMQ;

export { createUnmq, createQuickUnmq, QuickUNodeMQ, PluginInstallFunction };

export { Exchange, Queue, Consumer, News, Logs };

export { ConsumMode, Operator };

export { map } from "./operators/map";
export { debounceTime } from "./operators/debounceTime";

export const extend = Object.assign;
export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);
export const isArray = Array.isArray;
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === "[object Map]";
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === "[object Set]";

export const isDate = (val: unknown): val is Date => val instanceof Date;
export const isFunction = (val: unknown): val is Function => typeof val === "function";
export const isString = (val: unknown): val is string => typeof val === "string";
export const isNumber = (val: unknown): val is number => typeof val === "number";
export const isBoolean = (val: unknown): val is boolean => typeof val === "boolean";
export const isSymbol = (val: unknown): val is symbol => typeof val === "symbol";
export const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === "object";

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

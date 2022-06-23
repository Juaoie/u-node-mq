import { Operator } from "../..";
/**
 * debounceTime 防抖函数
 * @param dueTime 抖动间隔时间，单位毫秒
 * @param immediate 是否立即执行，默认为false
 * @returns
 * 立即执行代表第一个回调函数会立马执行，防抖函数一般不需要立即执行
 */
export default function debounceTime<D = unknown>(dueTime: number, immediate?: boolean): Operator<D>;

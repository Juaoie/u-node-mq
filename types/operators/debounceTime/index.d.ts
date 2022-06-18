import { Operator } from "../..";
/**
 * debounceTime 防抖函数
 * @param dueTime 抖动间隔时间，单位毫秒
 * @param immediate 是否立即执行，默认为false
 * @returns
 */
export default function debounceTime<D = unknown>(dueTime: number, immediate?: boolean): Operator<D>;

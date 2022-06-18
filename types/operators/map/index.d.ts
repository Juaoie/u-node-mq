import { Operator } from "../..";
/**
 * map 方法返回的数据类型和队列一致
 * @param project
 * @returns
 */
export default function map<D = unknown>(project: (value: D, index: number) => D): Operator<D>;

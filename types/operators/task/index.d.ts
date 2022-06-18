import { Operator } from "../..";
/**
 * task 控制队列能存入几条消息
 * @param count
 * @returns
 */
export default function task<D = unknown>(count: number): Operator<D>;

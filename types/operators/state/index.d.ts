import { Operator } from "../../index";
/**
 * state 将队列state化
 * @param repeatObject 基本数据类型的重复赋值将被过滤，引用数据类型的重复赋值默认也将被过滤，设置为true，将允许object类型的重复赋值
 * @returns
 *
 */
export default function state<D = unknown | null>(repeatObject?: boolean): Operator<D>;

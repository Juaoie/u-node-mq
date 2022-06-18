import { Operator } from "../..";
/**
 * filter 过滤
 * @param fun
 * @returns boolean 返回值控制是否加入队列
 */
export default function filter<D = unknown>(fun: (res: any) => boolean | Promise<boolean>): Operator<D>;

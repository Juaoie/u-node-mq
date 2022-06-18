import { Operator } from "../..";
/**
 * removeDuplicates 去重
 * @param fun 根据fun 返回的id进行判断是否需要去重
 * @returns
 */
export default function removeDuplicates<D = unknown>(fun: (res: any) => any): Operator<D>;

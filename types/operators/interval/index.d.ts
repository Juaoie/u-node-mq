import { Operator } from "../..";
/**
 * setinterval发射数据，发射内容为从0开始的数字
 * @param period 1000 间隔时长
 * @param optimal true 是否在没有消费者的时候暂停发射数据，有消费者则会自动开启发射
 * @returns
 */
export default function interval(period?: number, optimal?: boolean): Operator<number>;

import { Operator } from "../..";
/**
 * 管道操作方法是可以随意组合的，即使在interval之前还有其它操作方法也不影响setInterval的继续运行
 *
 * 在ts文件中使用interval队列内容必须为number
 *
 * 加入的消息内容从1开始
 *
 * setinterval发射数据，发射内容为从0开始的数字
 * @param period 1000 间隔时长
 * @param optimal true 是否在没有消费者的时候暂停发射数据，有消费者则会自动开启发射
 * @returns
 */
export default function interval(period?: number, optimal?: boolean): Operator<number>;

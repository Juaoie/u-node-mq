import { Operator } from "../../index";
/**
 * 扩展为观察者模式，即在同一事件循环内消费所有消息
 * @returns
 */
export default function instant<D = unknown>(log?: boolean): Operator<D>;

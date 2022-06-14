import { Operator, Queue, ConsumMode } from "../index";

/**
 * 扩展为观察者模式，即在同一事件循环内消费所有消息
 * @returns
 */
export function instant(): Operator<number> {
  return {
    mounted(that: Queue<number>) {
      if (that.mode !== ConsumMode.All) throw `${that.name} 队列 mode 需要设置成All`;
      that.pushConsume(() => true);
    },
  };
}

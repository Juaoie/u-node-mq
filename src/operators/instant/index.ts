import { Operator, Queue, ConsumMode } from "../../index";

/**
 * 扩展为观察者模式，即在同一事件循环内消费所有消息
 * @returns
 */
export default function instant<D = unknown>(log?: boolean): Operator<D> {
  return {
    mounted(that: Queue<D>) {
      if (that.mode !== ConsumMode.All) throw `${that.name} 队列 mode 需要设置成All`;
      that.pushConsume(res => {
        if (log) console.log("由instant operate消费的消息：", res);
        return true;
      });
    },
  };
}

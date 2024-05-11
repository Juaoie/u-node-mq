import { Operator, Queue, ConsumMode } from "../../index";

/**
 * 扩展为观察者模式，即在同一事件循环内消费所有消息
 * 使用off方法可以移除此属性，开发时请注意协调
 * @returns
 */
export default function instant<D>(): Operator<D> {
  return {
    mounted(that: Queue<D>) {
      if (that.mode !== ConsumMode.All) throw `${that.name} 队列 mode 需要设置成All`;
      that.pushConsume(() => true);
    },
  };
}

import UNodeMQ from "../core";
import { Consume, Next } from "../core/consumer";
import { Queue } from "../UNodeMQ";
type NextProxy = (name: string) => void;
type ProcessConsume<D> = (content: D, nextProxy: NextProxy, payload?: any) => void;
export default class Process<D> {
  unmq: UNodeMQ<D>;
  install(unmq: UNodeMQ<D>) {
    this.unmq = unmq;
  }
  /**
   *
   * @param n 执行顺序，从小到大执行，相等的同时执行
   */
  on(name: string, consume: ProcessConsume<D>, payload?: any) {
    const queue = new Queue<D>({ name, ask: true });
    this.unmq.queueList.push(queue);
    const consumeProxy = (content: D, next: Next, payload?: any) => {
      const nextProxy = (name: string) => {
        this.unmq.emit(); //这里要使用交换机的中继器分发数据到每个指定的队列
      };
      consume(content, nextProxy, payload);
      next(true);
    };
    this.unmq.on(name, consumeProxy, payload);
  }
  next() {}
  constructor() {}
}

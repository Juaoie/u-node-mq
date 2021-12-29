import UNodeMQ from "../core";
import { Consume, Next } from "../core/consumer";
import { Queue } from "../UNodeMQ";
export default class Process<D> {
  unmq: UNodeMQ<D>;
  private queueNameList: symbol[] = [];
  install(unmq: UNodeMQ<D>) {
    this.unmq = unmq;
  }
  /**
   *
   * @param n 执行顺序，从小到大执行，相等的同时执行
   */
  on(n: number, consume: Consume<D>, payload?: any) {
    const queueName = Symbol(this.unmq.exchange.name);
    this.queueNameList.push(queueName);
    const queue = new Queue<D>({ name: queueName, ask: true });
    this.unmq.queueList.push(queue);
    function consumeProxy(content: D, next: Next, payload?: any) {
      const nextProxy=(n:number)=>{

      }
      consume(content, nextProxy, payload);
      next(true);
    }
    this.unmq.on(queueName, consumeProxy, payload);
  }
  next() {}
  constructor() {}
}

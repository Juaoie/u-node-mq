import UNodeMQ from "../core";
import { Queue } from "../UNodeMQ";
export default class Process<D> {
  unmq: UNodeMQ<D>;
  private queueNameList: symbol[] = [];
  install(unmq: UNodeMQ<D>) {
    this.unmq = unmq;
  }
  on() {
    const queueName = Symbol(this.unmq.exchange.name);
    this.queueNameList.push(queueName);
    new Queue({ name:queueName });
    this.unmq.on();
  }
  next() {}
  constructor() {}
}

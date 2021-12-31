import UNodeMQ from "../core";
import { Consume, Next } from "../core/consumer";
import { Queue } from "../UNodeMQ";
export type NextProxy = (...queueNameList: string[]) => void;
export type ProcessConsume = (queueName: string, nextProxy: NextProxy, payload?: any) => void;
import UnmqFactory from "../core/UnmqFactory";
export default class Process {
  unmq: UNodeMQ<string>;
  private unmqFactory = new UnmqFactory<string>();
  install(unmq: UNodeMQ<string>) {
    this.unmq = unmq;
    this.unmq.exchange.repeater = (queueName: string) => [queueName];
  }
  /**
   *
   * @param contentList
   * @returns
   */
  emit(...queueNameList: string[]) {
    this.unmq.emit(...queueNameList);
    return this;
  }
  /**
   *
   * @param name
   * @param consume
   * @param payload
   */
  on(name: string, consume: ProcessConsume, payload?: any) {
    const consumeProxy = (content: string, next: Next, payload?: any) => {
      next(true);
      const nextProxy = (...nextQueueNameList: string[]) => {
        this.unmq.emit(...nextQueueNameList); //这里要使用交换机的中继器分发数据到每个指定的队列
      };
      consume(content, nextProxy, payload);
    };
    this.unmq.on(name, consumeProxy, payload);
    return this;
  }
  /**
   *
   * @param queueName
   * @param consume
   * @returns
   */
  off(queueName: string | Symbol, consume: Consume<string>) {
    this.unmq.off(queueName, consume);
    return this;
  }
  /**
   *
   * @param queueName
   * @param consume
   * @param payload
   */
  once(queueName: string, consume: Consume<string>, payload?: any) {
    this.unmq.once(queueName, consume, payload);
    return this;
  }
  constructor(...queueNameList: string[]) {
    this.unmq.queueList.push(...this.unmqFactory.produceQueueList(queueNameList, true));
  }
}

import UNodeMQ from "../internal";
import { Consume, Next } from "../internal/consumer";
import Queue from "../internal/queue";
export type NextProxy = (...queueNameList: string[]) => void;
export type ProcessConsume = (queueName: string, nextProxy: NextProxy, payload?: any) => void;
export default class Process {
  unmq: UNodeMQ<string>;
  private consumeMappingList: {
    processConsume: ProcessConsume;
    consume: Consume<string>;
  }[] = [];
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
    this.consumeMappingList.push({
      processConsume: consume,
      consume: consumeProxy,
    });
    this.unmq.on(name, consumeProxy, payload);
    return this;
  }
  /**
   *
   * @param queueName
   * @param consume
   * @returns
   */
  off(queueName: string | Symbol, consume: ProcessConsume) {
    const index = this.consumeMappingList.findIndex(item => item.processConsume === consume);
    if (index === -1) return this;
    this.unmq.off(queueName, this.consumeMappingList[index].consume);
    this.consumeMappingList.splice(index, 1);
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
    this.unmq = new UNodeMQ({
      exchangeName: "process",
      queueNameList,
      ask: true,
    });
    this.unmq.getExchange().setRepeater((queueName: string) => [queueName]);
  }
}

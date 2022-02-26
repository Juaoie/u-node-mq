import Exchange from "./exchange";
import Queue, { QueueName } from "./queue";
import News from "./news";
import Consumer, { Next } from "./consumer";
import { Consume } from "./consumer";
import Logs from "./logs";
import UnmqFactory from "./UnmqFactory";

interface Option {
  exchangeName?: string;
  queueNameList?: string[];
  ask?: boolean;
}
export type PluginInstallFunction<D> = (unmq: UNodeMQ<D>, ...options: any[]) => any;
export type Plugin<D> =
  | (PluginInstallFunction<D> & {
      install?: PluginInstallFunction<D>;
    })
  | {
      install: PluginInstallFunction<D>;
    };
/**
 * unmq：
 * 仅有emit和on方法会触发队列推送消息给消费者
 */
export default class UNodeMQ<D> extends Exchange {
  constructor(option?: Option) {
    //先创建交换机
    super({ name: option.exchangeName || "exchange" });

    if (option.queueNameList !== undefined) {
      //添加队列列表
      super.pushQueueList(option.queueNameList, option.ask);
      //添加静态路由
      super.pushRoutes(option.queueNameList);
    }
  }
  /**
   * 发射数据
   * @param contentList 消息体列表
   * @returns
   */
  emit(...contentList: D[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      super.pushNewsToQueueList(content);
    }
    return this;
  }

  /**
   *  订阅队列消息
   * 队列名称为null 则订阅所有队列
   * 消费方法
   * @param queueName 队列名称
   * @param consume 消费方法
   * @param payload 固定参数，有效载荷，在每次消费的时候都传给消费者
   * @returns
   */
  on(queueName: QueueName, consume: Consume<D>, payload?: any): () => {};
  on(consume: Consume<D>, payload?: any): () => {};
  on(x: QueueName | Consume<D>, y?: Consume<D> | any, z?: any) {
    if (typeof x === "string" || typeof x === "symbol") {
      //订阅一个队列
      super.pushConsumeToQueue(x, y, z);
      return () => this.off(x, y);
    } else if (typeof x === "function") {
      //订阅所有队列
      super.pushConsumeToAllQueue(x, y);
      return () => this.off(x);
    }
  }

  off(queueName: QueueName, consume: Consume<D>): Exchange;
  off(queueName: QueueName): Exchange;
  off(consume: Consume<D>): Exchange;
  off(): Exchange;
  off(x?: QueueName | Consume<D>, y?: Consume<D>) {
    if ((typeof x === "string" || typeof x === "symbol") && typeof y === "function") {
      //移除指定队列的指定消费者
      super.removeConsumeFromQueue(x, y);
    } else if ((typeof x === "string" || typeof x === "symbol") && typeof y === "undefined") {
      //移除指定队列的所有消费者
      super.removeAllConsumeFromQueue(x);
    } else if (typeof x === "function" && typeof y === "undefined") {
      //移除所有队列的指定消费者
      super.removeConsumeFromAllQueue(x);
    } else if (typeof x === "undefined" && typeof y === "undefined") {
      //移除所有消费者
      super.removeConsume();
    }

    return this;
  }

  once(queueName: QueueName, consume: Consume<D>, payload?: any) {
    let consumeNum = 0;
    const consumeProxy = (content: D, next?: Next, payload?: any) => {
      if (consumeNum === 1) return; //一个消费者可能需要消耗多条消息,, error 队列里面的消息被消费了，但是这里返回为未被消费
      consumeNum++;
      this.off(queueName, consumeProxy);
      return consume(content, next, payload);
    };
    this.on(queueName, consumeProxy, payload);
    return this;
  }
}

const unmq = new UNodeMQ<string>();

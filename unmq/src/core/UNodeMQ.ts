import { Exchange, Queue, News, Consume } from "..";
import { queueCollection } from "../core";
import Collection from "./Collection";
export interface Option {
  exchange: Record<string, Exchange<unknown>>;
  queue: Record<string, Queue<unknown>>;
}

/**
 * unmq：
 * 仅有emit和on方法会触发队列推送消息给消费者
 */
export default class UNodeMQ extends Collection {
  constructor(option: Option) {
    super(option);
  }
  /**
   * 发射数据
   * @param contentList 消息体列表
   * @returns
   */
  emit();
  emit(...contentList: D[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      this.exchange.pushNewsToQueueList(content);
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
      queueCollection.pushConsumeToQueue(x, y, z);
      return () => this.off(x, y);
    } else if (typeof x === "function") {
      //订阅所有队列
      queueCollection.pushConsumeToAllQueue(x, y);
      return () => this.off(x);
    }
  }

  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off(queueName: QueueName, consume: Consume<D>): Exchange<D>;
  off(queueName: QueueName): Exchange<D>;
  off(consume: Consume<D>): Exchange<D>;
  off(): Exchange<D>;
  off(x?: QueueName | Consume<D>, y?: Consume<D>) {
    if ((typeof x === "string" || typeof x === "symbol") && typeof y === "function") {
      //移除指定队列的指定消费者
      queueCollection.removeConsumeFromQueue(x, y);
    } else if ((typeof x === "string" || typeof x === "symbol") && typeof y === "undefined") {
      //移除指定队列的所有消费者
      queueCollection.removeAllConsumeFromQueue(x);
    } else if (typeof x === "function" && typeof y === "undefined") {
      //移除所有队列的指定消费者
      queueCollection.removeConsumeFromAllQueue(x);
    } else if (typeof x === "undefined" && typeof y === "undefined") {
      //移除所有消费者
      queueCollection.removeConsume();
    }

    return this.exchange;
  }

  /**
   * 一次性订阅消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
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

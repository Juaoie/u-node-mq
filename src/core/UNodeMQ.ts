import { Exchange, Queue, News } from "../index.js";
import { Consume, Next } from "../internal/Consumer.js";

import Collection from "./Collection.js";

export type ReturnPanShapeExchange<T> = T extends Exchange<infer U> ? U : never;
export type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;

export type UnionAttribute<T> = keyof T;

export function createUnmq<
  ExchangeCollection extends Record<string, Exchange<any>>,
  QueueCollection extends Record<string, Queue<any>>
>(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
  return new UNodeMQ(exchangeCollection, queueCollection);
}
/**
 * unmq：
 * 仅有emit和on方法会触发队列推送消息给消费者
 */
export default class UNodeMQ<
  ExchangeCollection extends Record<string, Exchange<any>>,
  QueueCollection extends Record<string, Queue<any>>
> extends Collection<ExchangeCollection, QueueCollection> {
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
    for (const name in exchangeCollection) {
      exchangeCollection[name].name = name;
    }
    for (const name in queueCollection) {
      queueCollection[name].name = name;
    }
    super(exchangeCollection, queueCollection);
  }
  /**
   * 发射数据到交换机
   * @param contentList 消息体列表
   * @returns
   */
  emit<E extends keyof ExchangeCollection>(
    exchangeName: E,
    ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]
  ) {
    super.pushContentListToExchange(exchangeName, ...contentList);
    return this;
  }
  /**
   * 发射数据到队列
   * @param queueName
   * @param contentList
   * @returns
   */
  emitToQueue<Q extends keyof QueueCollection>(
    queueName: Q,
    ...contentList: ReturnPanShapeQueue<QueueCollection[Q]>[]
  ) {
    super.pushContentListToQueue(queueName, ...contentList);
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
  on<Q extends keyof QueueCollection>(
    queueName: Q,
    consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>,
    payload?: any
  ) {
    super.subscribeQueue(queueName, consume, payload);
    return () => this.off(queueName, consume);
  }

  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
  off<Q extends keyof QueueCollection>(queueName: Q): this;
  off<Q extends keyof QueueCollection>(x: Q, y?: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this {
    super.unsubscribeQueue(x, y);
    return this;
  }

  /**
   * 一次性订阅消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends keyof QueueCollection>(
    queueName: Q,
    consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>,
    payload?: any
  ) {
    let consumeNum = 0;
    const consumeProxy = (content: ReturnPanShapeQueue<QueueCollection[Q]>, next?: Next, payload?: any) => {
      if (consumeNum === 1) return; //一个消费者可能需要消耗多条消息,, error 队列里面的消息被消费了，但是这里返回为未被消费
      consumeNum++;
      this.off(queueName, consumeProxy);
      return consume(content, next, payload);
    };
    this.on(queueName, consumeProxy, payload);
    return this;
  }
}

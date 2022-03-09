import { Exchange, Queue, News } from "..";
import { Consume, Next } from "../internal/Consumer";

import Collection from "./Collection";
//TODO:组合它两
type ReturnPanShapeExchange<T> = T extends Exchange<infer U> ? U : never;
type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;

export type PluginComponent<Q> = {
  readonly name: string;
  install: <Q>(queueNameList) => void;
};

export function createUnmq<ExchangeCollection extends Record<string, Exchange<unknown>>, QueueCollection extends Record<string, Queue<unknown>>>(
  exchangeCollection: ExchangeCollection,
  queueCollection: QueueCollection,
) {
  return new UNodeMQ(exchangeCollection, queueCollection);
}
/**
 * unmq：
 * 仅有emit和on方法会触发队列推送消息给消费者
 */
export default class UNodeMQ<
  ExchangeCollection extends Record<string, Exchange<unknown>>,
  ExchangeName extends keyof ExchangeCollection,
  QueueCollection extends Record<string, Queue<unknown>>,
  QueueName extends keyof QueueCollection,
> extends Collection<ExchangeCollection, QueueCollection> {
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
    super(exchangeCollection, queueCollection);
  }
  private _plugin: PluginComponent<QueueName>[];

  use(plugin: PluginComponent<QueueName>) {
    plugin.install<QueueName>();
    this._plugin.push(plugin);
  }
  /**
   * 发射数据到交换机
   * @param contentList 消息体列表
   * @returns
   */
  emit<E extends ExchangeName>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]) {
    super.pushContentListToExchange(exchangeName as string, contentList);
    return this;
  }
  /**
   * 发射数据到队列
   * @param queueName
   * @param contentList
   * @returns
   */
  emitToQueue<Q extends QueueName>(queueName: Q, ...contentList: ReturnPanShapeQueue<QueueCollection[Q]>[]) {
    super.pushContentListToQueue(queueName as string, contentList);
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
  on<Q extends QueueName>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any) {
    super.subscribeQueue(queueName as string, consume, payload);
    return () => this.off(queueName, consume);
  }

  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off<Q extends QueueName>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
  off<Q extends QueueName>(queueName: Q): this;
  off<Q extends QueueName>(x: Q, y?: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this {
    if (y !== undefined) {
      //
      super.unsubscribeQueue(x as string, y);
    } else {
      //
      super.unsubscribeQueue(x as string);
    }
    return this;
  }

  /**
   * 一次性订阅消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends QueueName>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any) {
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

import { Exchange, Queue, isFunction } from "../index";
import { Consume, Next } from "../internal/Consumer";

/**
 * 获取队列名称返回的promise导致消费事件加入微任务队列延迟消费（ios属于加入普通任务队列）
 * 这样同时保证了在观察者模式中数据能准确分发
 */

import Collection from "./Collection";

export type ReturnPanShapeExchange<T> = T extends Exchange<infer U> ? U : never;
export type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;

type PluginInstallFunction = (unmq: UNodeMQ<any, any>, ...options: any[]) => any;
export type Plugin =
  | (PluginInstallFunction & { install?: PluginInstallFunction })
  | {
      install: PluginInstallFunction;
    };
export function createUnmq<
  ExchangeCollection extends Record<string, Exchange<any>>,
  QueueCollection extends Record<string, Queue<any>>
>(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
  return new UNodeMQ(exchangeCollection, queueCollection);
}
//TODO:增加可以使用数组的方式创建Exchange和Queue
/**
 * UNodeMQ 发布订阅模型
 */
export default class UNodeMQ<
  ExchangeCollection extends Record<string, Exchange<any>>,
  QueueCollection extends Record<string, Queue<any>>
> extends Collection<ExchangeCollection, QueueCollection> {
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
    super(exchangeCollection, queueCollection);
  }
  private readonly installedPlugins: Set<Plugin> = new Set();
  use(plugin: Plugin, ...options: any[]) {
    if (this.installedPlugins.has(plugin)) {
      console.log(`Plugin has already been applied to target unmq.`);
    } else if (plugin && isFunction(plugin.install)) {
      this.installedPlugins.add(plugin);
      plugin.install(this, ...options);
    } else if (isFunction(plugin)) {
      this.installedPlugins.add(plugin);
      plugin(this, ...options);
    }
    return this;
  }
  /**
   * 发射数据到交换机
   * @param contentList 消息体列表
   * @returns
   */
  emit<E extends keyof ExchangeCollection & string>(
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
  emitToQueue<Q extends keyof QueueCollection & string>(
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
  on<Q extends keyof QueueCollection & string>(
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
  off<Q extends keyof QueueCollection & string>(x: Q, y?: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this {
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
  once<Q extends keyof QueueCollection & string>(
    queueName: Q,
    consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>,
    payload?: any
  ) {
    let consumeNum = 0;
    const consumeProxy = (content: any, next?: Next, payload?: any) => {
      if (consumeNum === 1) return; //一个消费者可能需要消耗多条消息,, error 队列里面的消息被消费了，但是这里返回为未被消费
      consumeNum++;
      this.off(queueName, consumeProxy);
      return consume(content, next, payload);
    };
    this.on(queueName, consumeProxy, payload);
    return this;
  }
}
export function createQuickUnmq<D, QueueCollection extends Record<string, Queue<D>>>(
  exchange: Exchange<D>,
  queueCollection: QueueCollection
) {
  return new QuickUNodeMQ(exchange, queueCollection);
}
/**
 * quick unmq
 * single type unmq
 */
export class QuickUNodeMQ<D, QueueCollection extends Record<string, Queue<D>>> {
  constructor(private readonly exchange: Exchange<D>, private readonly queueCollection: QueueCollection) {
    for (const name in queueCollection) {
      queueCollection[name].name = name;
    }
  }
  /**
   * 发射数据到交换机
   * @param contentList 消息体列表
   * @returns
   */
  emit(...contentList: D[]) {
    for (const content of contentList) {
      this.exchange.getQueueNameList(content).then((queueNameList: string[]) => {
        for (const queueName of queueNameList) {
          if (this.queueCollection[queueName] === undefined) continue;
          this.queueCollection[queueName].pushContent(content);
        }
      });
    }
    return this;
  }
  /**
   * 发射数据到队列
   * @param queueName
   * @param contentList
   * @returns
   */
  emitToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: D[]) {
    for (const content of contentList) {
      this.queueCollection[queueName].pushContent(content);
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
  on<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<D>, payload?: any) {
    this.queueCollection[queueName].pushConsume(consume, payload);
    return () => this.off(queueName, consume);
  }

  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<D>): this;
  off<Q extends keyof QueueCollection>(queueName: Q): this;
  off<Q extends keyof QueueCollection & string>(x: Q, y?: Consume<D>): this {
    if (y === undefined) {
      this.queueCollection[x].removeAllConsumer();
    } else this.queueCollection[x].removeConsumer(y);
    return this;
  }

  /**
   * 一次性订阅消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<D>, payload?: any) {
    let consumeNum = 0;
    const consumeProxy = (content: any, next?: Next, payload?: any) => {
      if (consumeNum === 1) return; //一个消费者可能需要消耗多条消息,, error 队列里面的消息被消费了，但是这里返回为未被消费
      consumeNum++;
      this.off(queueName, consumeProxy);
      return consume(content, next, payload);
    };
    this.on(queueName, consumeProxy, payload);
    return this;
  }
}

import { isFunction } from "../utils/tools";
import { Exchange, Queue } from "../index";
import { Consume, Next } from "../internal/Consumer";
import Collection from "./Collection";
import { Plugin } from "@/plugins/index";

/**
 * 获取队列名称返回的promise导致消费事件加入微任务队列延迟消费（ios属于加入普通任务队列）
 * 这样同时保证了在观察者模式中数据能准确分发
 */

export type ReturnPanShapeExchange<T> = T extends Exchange<infer U> ? U : never;
export type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;

/**
 * 使用普通函数创建unmq
 * @param exchangeCollection
 * @param queueCollection
 * @returns
 */
export function createUnmq<ExchangeCollection extends Record<string, Exchange<any>>, QueueCollection extends Record<string, Queue<any>>>(
  exchangeCollection: ExchangeCollection,
  queueCollection: QueueCollection,
) {
  return new UNodeMQ(exchangeCollection, queueCollection);
}
/**
 * UNodeMQ 发布订阅模型
 * 从3.7.0版本开始，一个u-node-mq仅支持一种消息类型
 */
export default class UNodeMQ<
  D,
  ExchangeCollection extends Record<string, Exchange<D>>,
  QueueCollection extends Record<string, Queue<D>>,
> extends Collection<D, ExchangeCollection, QueueCollection> {
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
  emit<E extends keyof ExchangeCollection & string>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]) {
    super.pushContentListToExchange(exchangeName, ...contentList);
    return this;
  }
  /**
   * 发射数据到队列
   * @param queueName
   * @param contentList
   * @returns
   */
  emitToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: ReturnPanShapeQueue<QueueCollection[Q]>[]) {
    super.pushContentListToQueue(queueName, ...contentList);
    return this;
  }

  /**
   * 订阅队列消息
   * @param queueName 队列名称
   * @param consume 消费方法
   * @param payload 固定参数，有效载荷，在每次消费的时候都传给消费者
   * @returns
   */
  on<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any) {
    super.subscribeQueue(queueName, consume, payload);
    return () => this.off(queueName, consume);
  }

  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off<Q extends keyof QueueCollection & string>(queueName: Q, consume?: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this {
    super.unsubscribeQueue(queueName, consume);
    return this;
  }

  /**
   * 订阅一条消息
   * 不传入消费方法，则返回Promise<D>
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): this;
  once<Q extends keyof QueueCollection & string>(queueName: Q): Promise<ReturnPanShapeQueue<QueueCollection[Q]>>;
  once<Q extends keyof QueueCollection & string>(queueName: Q, consume?: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any) {
    if (!isFunction(consume)) {
      return new Promise(resolve => {
        const consumeProxy = (content: any) => {
          this.off(queueName, consumeProxy);
          resolve(content);
          return true;
        };
        this.on(queueName, consumeProxy, payload);
      });
    } else {
      const consumeProxy = (content: any, next?: Next, payload?: any) => {
        this.off(queueName, consumeProxy);
        return consume(content, next, payload);
      };
      this.on(queueName, consumeProxy, payload);
      return this;
    }
  }
}

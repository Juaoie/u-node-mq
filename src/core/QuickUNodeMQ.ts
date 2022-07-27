import { ConstructorParameter, isFunction } from "../utils/tools";
import { Exchange, Queue } from "../index";
import { Consume, Next } from "../internal/Consumer";

function createQuickUnmq<D, QueueCollection extends Record<string, Queue<D>>>(
  exchangeOption: ConstructorParameter<typeof Exchange>,
  queueCollection: QueueCollection,
): QuickUNodeMQ<D, QueueCollection>;
function createQuickUnmq<D, QueueCollection extends Record<string, Queue<D>>>(
  exchange: Exchange<D>,
  queueCollection: QueueCollection,
): QuickUNodeMQ<D, QueueCollection>;
function createQuickUnmq<D, QueueCollection extends Record<string, Queue<D>>>(
  x: ConstructorParameter<typeof Exchange> | Exchange<D>,
  y: QueueCollection,
) {
  return new QuickUNodeMQ(x, y);
}
export { createQuickUnmq };
/**
 * 单交换机的UNodeMQ类
 */
export default class QuickUNodeMQ<D, QueueCollection extends Record<string, Queue<D>>> {
  private exchange: Exchange<D>;
  private queueCollection: QueueCollection;
  constructor(exchangeOption: ConstructorParameter<typeof Exchange>, queueCollection: QueueCollection);
  constructor(exchange: Exchange<D>, queueCollection: QueueCollection);
  constructor(x: ConstructorParameter<typeof Exchange> | Exchange<D>, y: QueueCollection) {
    if (x instanceof Exchange) this.exchange = x;
    else this.exchange = new Exchange<D>(x);

    for (const name in y) {
      y[name].name = name;
    }
    this.queueCollection = y;
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
    if (isFunction(y)) {
      this.queueCollection[x].removeConsumer(y);
    } else this.queueCollection[x].removeAllConsumer();
    return this;
  }

  /**
   * 订阅一条消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<D>, payload?: any): this;
  once<Q extends keyof QueueCollection & string>(queueName: Q): Promise<D>;
  once<Q extends keyof QueueCollection & string>(queueName: Q, consume?: Consume<D>, payload?: any) {
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

import { ConstructorParameter, isFunction } from "../utils/tools";
import { Operator, Queue } from "../index";
import { Consume, Next } from "../internal/Consumer";
type QueueOption = NonNullable<ConstructorParameter<typeof Queue>>;

/**
 * 创建SingleUNodeMQ函数
 * @param queueOption
 */
function createSingleUnmq<D>(queueOption: QueueOption): SingleUNodeMQ<D>;
function createSingleUnmq<D>(queue: Queue<D>): SingleUNodeMQ<D>;
function createSingleUnmq<D>(): SingleUNodeMQ<D>;
function createSingleUnmq<D>(x?: Queue<D> | QueueOption) {
  if (typeof x === "undefined") return new SingleUNodeMQ();
  else return new SingleUNodeMQ(x);
}
export { createSingleUnmq };
/**
 * 单Queue的UNodeMQ类
 */
export default class SingleUNodeMQ<D> {
  private queue: Queue<D>;

  constructor(queueOption: QueueOption);
  constructor(queue: Queue<D>);
  constructor();
  constructor(x?: Queue<D> | QueueOption) {
    if (x instanceof Queue) this.queue = x;
    else this.queue = new Queue(x);
  }
  /**
   * 发送消息
   * @param contentList
   * @returns
   */
  emit(...contentList: D[]) {
    for (const content of contentList) {
      this.queue.pushContent(content);
    }
    return this;
  }
  /**
   * 订阅消息
   * @param consume
   * @param payload
   * @returns
   */
  on(consume: Consume<D>, payload?: any) {
    this.queue.pushConsume(consume, payload);
    return this;
  }
  /**
   * 移除消费者
   * @param consume
   */
  off(consume: Consume<D>): this;
  off(): this;
  off(x?: Consume<D>): this {
    if (isFunction(x)) this.queue.removeConsumer(x);
    else this.queue.removeAllConsumer();
    return this;
  }
  /**
   * 订阅一条消息
   * @param consume
   * @param payload
   */
  once(consume: Consume<D>, payload?: any): this;
  once(): Promise<D>;
  once(consume?: Consume<D>, payload?: any) {
    if (isFunction(consume)) {
      const consumeProxy = (content: any, next?: Next, payload?: any) => {
        this.off(consumeProxy);
        return consume(content, next, payload);
      };
      this.on(consumeProxy, payload);
      return this;
    } else {
      return new Promise(resolve => {
        const consumeProxy = (content: any) => {
          this.off(consumeProxy);
          resolve(content);
          return true;
        };
        this.on(consumeProxy, payload);
      });
    }
  }
  /**
   * 添加operators
   * @param operators
   * @returns
   */
  add(...operators: Operator<D>[]) {
    this.queue.add(...operators);
    return this;
  }
}

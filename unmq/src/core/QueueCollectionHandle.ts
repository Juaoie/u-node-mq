import { Logs, Queue } from "..";
import { Consume } from "../internal/Consumer";

/**
 * 队列集合
 */
export default class QueueCollectionHandle<QueueCollection extends Record<string, Queue<unknown>>> {
  private queueCollection: QueueCollection;
  setQueueCollection(queueCollection: QueueCollection) {
    this.queueCollection = queueCollection;
  }
  getQueue<Q extends keyof QueueCollection>(queueName: Q) {
    return this.queueCollection[queueName];
  }
  /**
   * 添加一个消息内容到队列
   * @param queueName
   * @param content
   * @returns
   */
  pushContentToQueue<Q extends keyof QueueCollection>(queueName: Q, content: unknown) {
    if (this.queueCollection[queueName] === undefined) {
      Logs.error(`${queueName} not find`);
      return false;
    }
    this.queueCollection[queueName].pushContent(content);
    return true;
  }
  /**
   * 订阅队列
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  subscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<unknown>, payload?: any) {
    if (this.queueCollection[queueName] === undefined) {
      Logs.error(`${queueName} not find`);
      return false;
    }
    this.queueCollection[queueName].pushConsume(consume, payload);
    return true;
  }
  /**
   * 取消订阅队列
   * @param queueName
   * @param consume
   */
  unsubscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume?: Consume<unknown>) {
    if (this.queueCollection[queueName] === undefined) {
      Logs.error(`${queueName} not find`);
      return false;
    }
    if (consume === undefined) {
      return this.queueCollection[queueName].removeAllConsumer();
    } else {
      return this.queueCollection[queueName].removeConsumer(consume);
    }
  }
}

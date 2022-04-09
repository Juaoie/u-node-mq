import { Logs, Queue, News } from "../index.js";
import { Consume } from "../internal/Consumer.js";

/**
 * 队列集合
 */
export default class QueueCollectionHandle {
  private queueCollection: Map<string, Queue<any>>;
  has(queueName: string) {
    if (this.queueCollection.has(queueName)) return true;
    else {
      Logs.error(`${queueName} not find`);
      return false;
    }
  }
  setQueueCollection(queueCollection: Record<string, Queue<unknown>>) {
    this.queueCollection = new Map(Object.entries(queueCollection));
  }
  getQueue(queueName: string) {
    if (!this.has(queueName)) return;
    return this.queueCollection.get(queueName);
  }
  getQueueList() {
    return [...this.queueCollection.values()];
  }
  addQueue(queue: Queue<unknown>) {
    this.queueCollection.set(queue.name, queue);
  }
  pushNewsToQueue(queueName: string, news: News<unknown>) {
    if (!this.has(queueName)) return;
    this.queueCollection.get(queueName).pushNews(news);
  }
  /**
   * 添加一个消息内容到队列
   * @param queueName
   * @param content
   * @returns
   */
  pushContentToQueue(queueName: string, content: unknown) {
    if (!this.has(queueName)) return;
    this.queueCollection.get(queueName).pushContent(content);
  }
  /**
   * 订阅队列
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  subscribeQueue(queueName: string, consume: Consume<unknown>, payload?: any) {
    if (!this.has(queueName)) return;
    this.queueCollection.get(queueName).pushConsume(consume, payload);
  }
  /**
   * 取消订阅队列
   * @param queueName
   * @param consume
   */
  unsubscribeQueue(queueName: string, consume?: Consume<unknown>) {
    if (!this.has(queueName)) return;
    if (consume === undefined) {
      return this.queueCollection.get(queueName).removeAllConsumer();
    } else {
      return this.queueCollection.get(queueName).removeConsumer(consume);
    }
  }
}

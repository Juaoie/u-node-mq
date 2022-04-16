import { Logs, Queue, News } from "../index";
import { Consume } from "../internal/Consumer";

/**
 * 队列集合
 */
export default class QueueCollectionHandle {
  private queueCollection = new Map<string, Queue<any>>();
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
  getQueue(queueName: string): Queue<unknown> | null {
    const queue = this.queueCollection.get(queueName);
    if (queue === undefined) {
      Logs.error(`${queueName} not find`);
      return null;
    }
    return queue;
  }
  getQueueList() {
    return [...this.queueCollection.values()];
  }
  addQueue(queue: Queue<unknown>) {
    if (queue.name === undefined) throw "queue.name is undefined";
    this.queueCollection.set(queue.name, queue);
  }
  pushNewsToQueue(queueName: string, news: News<unknown>) {
    this.getQueue(queueName)?.pushNews(news);
  }
  /**
   * 添加一个消息内容到队列
   * @param queueName
   * @param content
   * @returns
   */
  pushContentToQueue(queueName: string, content: unknown) {
    this.getQueue(queueName)?.pushContent(content);
  }
  /**
   * 订阅队列
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  subscribeQueue(queueName: string, consume: Consume<unknown>, payload?: any) {
    this.getQueue(queueName)?.pushConsume(consume, payload);
  }
  /**
   * 取消订阅队列
   * @param queueName
   * @param consume
   */
  unsubscribeQueue(queueName: string, consume?: Consume<unknown>): boolean {
    if (!this.has(queueName)) return false;
    if (consume === undefined) {
      return !!this.getQueue(queueName)?.removeAllConsumer();
    } else {
      return !!this.getQueue(queueName)?.removeConsumer(consume);
    }
  }
}

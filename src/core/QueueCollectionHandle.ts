import { isFunction } from "../utils/tools";
import { Queue, News } from "../index";
import { Consume } from "../internal/Consumer";

/**
 * 队列集合
 */
export default class QueueCollectionHandle<D> {
  /**
   * 队列集合
   */
  private queueCollection = new Map<string, Queue<D>>();
  /**
   * 根据队列名称判断队列是否存在
   * @param queueName
   * @returns
   */
  has(queueName: string) {
    if (this.queueCollection.has(queueName)) return true;
    else {
      return false;
    }
  }
  /**
   * 设置队列集合
   * @param queueCollection
   */
  setQueueCollection(queueCollection: Record<string, Queue<D>>) {
    this.queueCollection = new Map(Object.entries(queueCollection));
  }
  /**
   * 根据队列名称获取单个队列对象
   * @param queueName
   * @returns
   */
  getQueue(queueName: string): Queue<D> | null {
    const queue = this.queueCollection.get(queueName);
    if (queue === undefined) {
      return null;
    }
    return queue;
  }
  /**
   * 获取所有队列
   * @returns
   */
  getQueueList() {
    return [...this.queueCollection.values()];
  }
  /**
   * 添加单条队列
   * @param queue
   */
  addQueue(queueName: string, queue: Queue<D>) {
    queue.name = queueName;
    return this.queueCollection.set(queueName, queue);
  }
  /**
   * 向指定队列添加数据
   * @param queueName
   * @param news
   */
  pushNewsToQueue(queueName: string, news: News<D>) {
    this.getQueue(queueName)?.pushNews(news);
  }
  /**
   * 添加一个消息内容到队列
   * @param queueName
   * @param content
   * @returns
   */
  pushContentToQueue(queueName: string, content: D) {
    this.getQueue(queueName)?.pushContent(content);
  }
  /**
   * 订阅队列
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  subscribeQueue(queueName: string, consume: Consume<D>, payload?: any) {
    this.getQueue(queueName)?.pushConsume(consume, payload);
  }
  /**
   * 取消订阅队列
   * @param queueName
   * @param consume
   */
  unsubscribeQueue(queueName: string, consume?: Consume<D>): boolean {
    if (!this.has(queueName)) return false;
    if (isFunction(consume)) {
      return !!this.getQueue(queueName)?.removeConsumer(consume);
    } else {
      return !!this.getQueue(queueName)?.removeAllConsumer();
    }
  }
}

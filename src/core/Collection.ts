import { Exchange, Queue, News } from "../index";
import { Consume } from "../internal/Consumer";
import ExchangeCollectionHandle from "./ExchangeCollectionHandle";
import QueueCollectionHandle from "./QueueCollectionHandle";
export default class Collection<
  ExchangeCollection extends Record<string, Exchange<unknown>>,
  QueueCollection extends Record<string, Queue<unknown>>,
> {
  private readonly exchangeCollectionHandle = new ExchangeCollectionHandle();
  private readonly queueCollectionHandle = new QueueCollectionHandle();

  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
    for (const name in exchangeCollection) {
      exchangeCollection[name].name = name;
    }
    for (const name in queueCollection) {
      queueCollection[name].name = name;
    }
    this.exchangeCollectionHandle.setExchangeCollection(exchangeCollection);
    this.queueCollectionHandle.setQueueCollection(queueCollection);
  }
  getExchange<E extends keyof ExchangeCollection & string>(exchangeName: E) {
    return this.exchangeCollectionHandle.getExchange(exchangeName);
  }
  getExchangeList() {
    return this.exchangeCollectionHandle.getExchangeList();
  }
  getQueue<Q extends keyof QueueCollection & string>(queueName: Q) {
    return this.queueCollectionHandle.getQueue(queueName);
  }
  getQueueList() {
    return this.queueCollectionHandle.getQueueList();
  }
  addQueue(queue: Queue<unknown>) {
    this.queueCollectionHandle.addQueue(queue);
  }
  /**
   * 发送消息到交换机
   * @param exchangeName
   * @param news
   */
  pushNewsListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...news: News<unknown>[]) {
    for (const newsItem of news) {
      //分别发送每一条消息
      this.exchangeCollectionHandle.getQueueNameList(exchangeName, newsItem.content).then(queueNameList => {
        for (const queueName in queueNameList) {
          this.pushNewsListToQueue(queueName, newsItem);
        }
      });
    }
  }
  /**
   * 发送消息到队列
   * @param queueName
   * @param news
   */
  pushNewsListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...news: News<unknown>[]) {
    for (const newsItem of news) {
      //分别发送每一条消息
      this.queueCollectionHandle.pushNewsToQueue(queueName, newsItem);
    }
  }
  /**
   * 发送消息内容到交换机
   * @param exchangeName
   * @param contentList
   */
  pushContentListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...contentList: unknown[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      this.exchangeCollectionHandle.getQueueNameList(exchangeName, content).then(queueNameList => {
        for (const queueName of queueNameList) {
          this.pushContentListToQueue(queueName, content);
        }
      });
    }
  }
  /**
   *  发送消息内容到队列
   * @param queueName
   * @param contentList
   */
  pushContentListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: unknown[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      this.queueCollectionHandle.pushContentToQueue(queueName, content);
    }
  }
  /**
   * 订阅队列
   * @param queueName
   * @param consume
   * @param payload
   */
  subscribeQueue<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<any>, payload?: any) {
    this.queueCollectionHandle.subscribeQueue(queueName, consume, payload);
  }
  /**
   * 取消订阅队列
   */
  unsubscribeQueue<Q extends keyof QueueCollection & string>(queueName: Q, consume?: Consume<any>) {
    this.queueCollectionHandle.unsubscribeQueue(queueName, consume);
  }
}

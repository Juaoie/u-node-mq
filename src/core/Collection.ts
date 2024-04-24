import { Exchange, Queue, News } from "../index";
import { Consume } from "../internal/Consumer";
import ExchangeCollectionHandle from "./ExchangeCollectionHandle";
import QueueCollectionHandle from "./QueueCollectionHandle";
export default class Collection<D, ExchangeCollection extends Record<string, Exchange<D>>, QueueCollection extends Record<string, Queue<D>>> {
  /**
   * 交换机集合
   */
  private readonly exchangeCollectionHandle = new ExchangeCollectionHandle<D>();
  /**
   * 队列集合
   */
  private readonly queueCollectionHandle = new QueueCollectionHandle<D>();

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
  /**
   * 根据交换机名称获取交换机
   * @param exchangeName
   * @returns
   */
  getExchange<E extends keyof ExchangeCollection & string>(exchangeName: E) {
    return this.exchangeCollectionHandle.getExchange(exchangeName);
  }
  /**
   * 获取交换机集合列表
   * @returns
   */
  getExchangeList() {
    return this.exchangeCollectionHandle.getExchangeList();
  }
  /**
   * 添加交换机
   * @param exchangeName
   * @param exchange
   * @returns
   */
  addExchage(exchangeName: string, exchange: Exchange<D>) {
    return this.exchangeCollectionHandle.addExchage(exchangeName, exchange);
  }
  /**
   * 根据
   * @param queueName
   * @returns
   */
  getQueue<Q extends keyof QueueCollection & string>(queueName: Q) {
    return this.queueCollectionHandle.getQueue(queueName);
  }
  /**
   * 获取队列集合列表
   * @returns
   */
  getQueueList() {
    return this.queueCollectionHandle.getQueueList();
  }
  /**
   * 添加一个队列到队列集合
   * @param queurName
   * @param queue
   * @returns
   */
  addQueue(queurName: string, queue: Queue<D>) {
    return this.queueCollectionHandle.addQueue(queurName, queue);
  }
  /**
   * 发送消息到交换机
   * @param exchangeName
   * @param news
   */
  pushNewsListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...news: News<D>[]) {
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
  pushNewsListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...news: News<D>[]) {
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
  pushContentListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...contentList: D[]) {
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
  pushContentListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: D[]) {
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

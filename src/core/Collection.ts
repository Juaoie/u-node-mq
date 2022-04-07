import { Exchange, Queue, News, isFunction } from "../index.js";
import { Consume } from "../internal/Consumer.js";
import ExchangeCollectionHandle from "./ExchangeCollectionHandle.js";
import QueueCollectionHandle from "./QueueCollectionHandle.js";

type PluginInstallFunction = (app: Collection<any, any>, ...options: any[]) => any;
export type Plugin =
  | (PluginInstallFunction & { install?: PluginInstallFunction })
  | {
      install: PluginInstallFunction;
    };
export default class Collection<
  ExchangeCollection extends Record<string, Exchange<unknown>>,
  QueueCollection extends Record<string, Queue<unknown>>
> {
  private readonly exchangeCollectionHandle = new ExchangeCollectionHandle<ExchangeCollection>();
  private readonly queueCollectionHandle = new QueueCollectionHandle<QueueCollection>();
  private readonly installedPlugins: Set<Plugin> = new Set();
  use(plugin: Plugin, ...options: any[]) {
    //thanks， Evan You
    if (this.installedPlugins.has(plugin)) {
      console.log(`Plugin has already been applied to target app.`);
    } else if (plugin && isFunction(plugin.install)) {
      this.installedPlugins.add(plugin);
      plugin.install(this, ...options);
    } else if (isFunction(plugin)) {
      this.installedPlugins.add(plugin);
      plugin(this, ...options);
    }
    return this;
  }
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
    this.exchangeCollectionHandle.setExchangeCollection(exchangeCollection);
    this.queueCollectionHandle.setQueueCollection(queueCollection);
  }
  getExchange<E extends keyof ExchangeCollection>(exchangeName: E) {
    return this.exchangeCollectionHandle.getExchange(exchangeName);
  }
  getQueue<Q extends keyof QueueCollection>(queueName: Q) {
    return this.queueCollectionHandle.getQueue(queueName);
  }
  /**
   * 发送消息到交换机
   * @param exchangeName
   * @param news
   */
  pushNewsListToExchange<E extends keyof ExchangeCollection>(exchangeName: E, ...news: News<unknown>[]) {
    for (const newsItem of news) {
      //分别发送每一条消息
      this.exchangeCollectionHandle.getQueueNameList(exchangeName, newsItem.content).then((queueNameList) => {
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
  pushNewsListToQueue<Q extends keyof QueueCollection>(queueName: Q, ...news: News<unknown>[]) {
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
  pushContentListToExchange<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: unknown[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      this.exchangeCollectionHandle.getQueueNameList(exchangeName, content).then((queueNameList) => {
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
  pushContentListToQueue<Q extends keyof QueueCollection>(queueName: Q, ...contentList: unknown[]) {
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
  subscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<unknown>, payload?: any) {
    this.queueCollectionHandle.subscribeQueue(queueName, consume, payload);
  }
  /**
   * 取消订阅队列
   */
  unsubscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume?: Consume<unknown>) {
    this.queueCollectionHandle.unsubscribeQueue(queueName, consume);
  }
}

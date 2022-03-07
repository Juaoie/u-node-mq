import { Exchange, Queue, Consume } from "..";
import ExchangeCollectionHandle from "./ExchangeCollectionHandle";
import QueueCollectionHandle from "./QueueCollectionHandle";

export default class Collection<
  ExchangeCollection extends Record<string, Exchange<unknown>>,
  QueueCollection extends Record<string, Queue<unknown>>,
> {
  private readonly exchangeCollection: ExchangeCollectionHandle<ExchangeCollection>;
  private readonly queueCollection: QueueCollectionHandle<QueueCollection>;
  constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection) {
    this.exchangeCollection.setExchangeCollection(exchangeCollection);
    this.queueCollection.setQueueCollection(queueCollection);
  }
  /**
   * 发送消息到交换机
   * @param exchangeName
   * @param contentList
   */
  pushContentListToExchange(exchangeName: string, ...contentList: unknown[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      this.exchangeCollection.getQueueNameList(exchangeName, content).then(queueNameList => {
        for (const queueName in queueNameList) {
          this.pushContentListToQueue(queueName, content);
        }
      });
    }
  }
  /**
   *  发送消息到队列
   * @param queueName
   * @param contentList
   */
  pushContentListToQueue(queueName: string, ...contentList: unknown[]) {
    for (const content of contentList) {
      //分别发送每一条消息
      this.queueCollection.pushContentToQueue(queueName, content);
    }
  }
  /**
   * 订阅队列
   * @param queueName
   * @param consume
   * @param payload
   */
  subscribeQueue(queueName: string, consume: Consume<unknown>, payload?: any) {
    this.queueCollection.subscribeQueue(queueName, consume, payload);
  }
  /**
   * 取消订阅队列
   */
  unsubscribeQueue(queueName: string, consume?: Consume<unknown>) {
    this.queueCollection.unsubscribeQueue(queueName, consume);
  }
}

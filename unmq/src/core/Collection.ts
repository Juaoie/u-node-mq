import { Exchange, Queue } from "..";
import ExchangeCollectionHandle from "./ExchangeCollectionHandle";
import QueueCollectionHandle from "./QueueCollectionHandle";
import { N } from "./UNodeMQ";

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
  async pushContentToExchange(exchangeName: string, ...contentList: N) {
    for (const content of contentList) {
      //分别发送每一条消息
      const queueNameList = await this.exchangeCollection.getQueueNameList(exchangeName, content);
      for (const queueName in queueNameList) {
        this.pushContentListToQueue(queueName, content);
      }
    }
  }
  /**
   *
   * @param queueName
   * @param contentList
   */
  pushContentListToQueue(queueName: string, ...contentList: N) {
    for (const content of contentList) {
      //分别发送每一条消息
      this.queueCollection.pushContentToQueue(queueName, content);
    }
  }
}

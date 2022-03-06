import { Exchange, Queue } from "..";
import ExchangeCollection from "./ExchangeCollection";
import QueueCollection from "./QueueCollection";
import { AbstractCollection, N } from "./UNodeMQ";

export default class Collection<E extends AbstractCollection<Exchange<unknown>>, Q extends AbstractCollection<Queue<unknown>>> {
  private readonly exchangeCollection: ExchangeCollection<E>;
  private readonly queueCollection: QueueCollection<E>;
  constructor(exchangeCollection: E, queueCollection: Q) {
    this.exchangeCollection.setExchangeCollection(exchangeCollection);
  }
  /**
   * 发送消息到交换机
   * @param exchangeName
   * @param contentList
   */
  async pushNewsToExchange(exchangeName: string, ...contentList: N) {
    for (const content of contentList) {
      //分别发送每一条消息
      const queueNameList = await this.exchangeCollection.getQueueNameList(exchangeName, content);
      for (const queueName in queueNameList) {
        this.pushNewsToQueue(queueName, content);
      }
    }
  }
  pushNewsToQueue(queueName: string, ...contentList: N) {
    for (const content of contentList) {
      //分别发送每一条消息
      
    }
  }
}

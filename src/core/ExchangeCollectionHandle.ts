import { Exchange } from "../index";
import Logs from "../internal/Logs";

export default class ExchangeCollectionHandle {
  private exchangeCollection = new Map<string, Exchange<any>>();
  has(exchangeName: string) {
    if (this.exchangeCollection.has(exchangeName)) return true;
    else {
      Logs.error(`${exchangeName} not find`);
      return false;
    }
  }
  setExchangeCollection(exchangeCollection: Record<string, Exchange<unknown>>) {
    this.exchangeCollection = new Map(Object.entries(exchangeCollection));
  }
  getExchange(exchangeName: string) {
    if (!this.has(exchangeName)) return;
    return this.exchangeCollection.get(exchangeName);
  }
  getExchangeList() {
    return [...this.exchangeCollection.values()];
  }
  /**
   * 根据交换机名称获取队列名称列表
   * @param exchangeName
   * @param content
   * @returns
   */
  getQueueNameList(exchangeName: string, content: unknown) {
    if (!this.has(exchangeName)) return;
    return this.getExchange(exchangeName).getQueueNameList(content);
  }
}

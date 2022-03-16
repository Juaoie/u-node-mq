import { Exchange } from "../index.js";
import Logs from "../internal/Logs.js";

export default class ExchangeCollectionHandle<ExchangeCollection extends Record<string, Exchange<unknown>>> {
  private exchangeCollection: ExchangeCollection;
  setExchangeCollection(exchangeCollection: ExchangeCollection) {
    this.exchangeCollection = exchangeCollection;
  }
  getExchange<E extends keyof ExchangeCollection>(exchangeName: E) {
    return this.exchangeCollection[exchangeName];
  }
  /**
   * 根据交换机名称获取队列名称列表
   * @param exchangeName
   * @param content
   * @returns
   */
  getQueueNameList<E extends keyof ExchangeCollection>(exchangeName: E, content: unknown) {
    if (this.exchangeCollection[exchangeName] === undefined) {
      Logs.error(`${exchangeName} not find`);
      throw `${exchangeName} not find`;
    }
    return this.exchangeCollection[exchangeName].getQueueNameList(content);
  }
}

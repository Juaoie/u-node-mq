import { Exchange } from "..";
import Logs from "../internal/Logs";

export default class ExchangeCollectionHandle<ExchangeCollection extends Record<string, Exchange<unknown>>> {
  private exchangeCollection: ExchangeCollection;
  setExchangeCollection(exchangeCollection: ExchangeCollection) {
    this.exchangeCollection = exchangeCollection;
  }
  /**
   * 根据交换机名称获取队列名称列表
   * @param exchangeName
   * @param content
   * @returns
   */
  getQueueNameList(exchangeName: string, content: unknown) {
    if (this.exchangeCollection[exchangeName] === undefined) {
      Logs.error(`${exchangeName} not find`);
      throw `${exchangeName} not find`;
    }
    return this.exchangeCollection[exchangeName].getQueueNameList(content);
  }
}

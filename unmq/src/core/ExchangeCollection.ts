import { Exchange } from "..";
import Logs from "../internal/Logs";
import { AbstractCollection } from "./UNodeMQ";

export default class ExchangeCollection<E extends AbstractCollection<Exchange<unknown>>> {
  private exchangeCollection: E;
  setExchangeCollection(exchangeCollection: E) {
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
      return [];
    }
    return this.exchangeCollection[exchangeName].getQueueNameList(content);
  }
}

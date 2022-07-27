import { Exchange } from "../index";

export default class ExchangeCollectionHandle {
  private exchangeCollection = new Map<string, Exchange<any>>();
  has(exchangeName: string) {
    if (this.exchangeCollection.has(exchangeName)) return true;
    else {
      return false;
    }
  }
  setExchangeCollection(exchangeCollection: Record<string, Exchange<unknown>>) {
    this.exchangeCollection = new Map(Object.entries(exchangeCollection));
  }
  getExchange(exchangeName: string): Exchange<unknown> | null {
    const exchange = this.exchangeCollection.get(exchangeName);
    if (exchange === undefined) {
      return null;
    }
    return exchange;
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
  async getQueueNameList(exchangeName: string, content: unknown) {
    const exchagne = this.getExchange(exchangeName);
    if (exchagne === null) return [];
    return exchagne.getQueueNameList(content);
  }
}

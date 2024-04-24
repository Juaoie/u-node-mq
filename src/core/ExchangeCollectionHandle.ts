import { Exchange } from "../index";

export default class ExchangeCollectionHandle<D> {
  /**
   * 交换机集合
   */
  private exchangeCollection = new Map<string, Exchange<D>>();
  /**
   * 通过名称判断交换机是否存在
   * @param exchangeName
   * @returns 返回是否存在
   */
  has(exchangeName: string) {
    if (this.exchangeCollection.has(exchangeName)) return true;
    else {
      return false;
    }
  }
  /**
   * 设置交换机集合
   * @param exchangeCollection
   */
  setExchangeCollection(exchangeCollection: Record<string, Exchange<D>>) {
    this.exchangeCollection = new Map(Object.entries(exchangeCollection));
  }
  /**
   * 添加单条交换机
   * @param exchangeName
   * @param exchange
   * @returns 返回新的交换机集合
   */
  addExchage(exchangeName: string, exchange: Exchange<D>) {
    exchange.name = exchangeName;
    return this.exchangeCollection.set(exchangeName, exchange);
  }
  /**
   * 获取单个交换机
   * @param exchangeName
   * @returns 返回交换机名称对应的交换机
   */
  getExchange(exchangeName: string): Exchange<D> | null {
    const exchange = this.exchangeCollection.get(exchangeName);
    if (exchange === undefined) {
      return null;
    }
    return exchange;
  }
  /**
   * 获取所有交换机
   * @returns
   */
  getExchangeList() {
    return [...this.exchangeCollection.values()];
  }
  /**
   * 根据交换机名称获取队列名称列表
   * @param exchangeName
   * @param content
   * @returns
   */
  async getQueueNameList(exchangeName: string, content: D) {
    const exchagne = this.getExchange(exchangeName);
    if (exchagne === null) return [];
    return exchagne.getQueueNameList(content);
  }
}

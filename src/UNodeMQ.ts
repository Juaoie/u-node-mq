import Exchange from "./exchange";
import Logs from "./logs/logs";
import News from "./news";
import Queue from "./queue";

type Option = {
  exchanges?: Exchange[];
  queues?: Queue[];
  logs?: Logs;
};
/**
 *
 */
export default class UNodeMQ {
  /**
   * 交换机列表
   */
  exchanges: Exchange[];
  /**
   * 队列列表
   */
  queues: Queue[];
  /**
   * 日志系统
   */
  logs: Logs;
  constructor(option?: Option) {
    this.exchanges = option.exchanges;
    this.queues = option.queues;
    this.logs = option.logs;
  }
  /**
   * 获取单个交换机
   * @param exchangeName 
   * @returns 
   */
  getExchange(exchangeName: string): Exchange {
    const exchange = this.exchanges.find((item) => item.name === exchangeName);
    if (exchange === undefined) throw `交换机${exchangeName}不存在`;
    return exchange;
  }
  emit(exchangeName: string, content: any) {
  const exchange:Exchange=  this.getExchange(exchangeName)
    new News(content);
    exchange.
  }
}

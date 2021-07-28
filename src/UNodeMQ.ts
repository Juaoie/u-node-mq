import Exchange from "./exchange";
import Logs from "./logs/logs";
import News from "./news";
import Queue from "./queue";

type Option = {
  exchanges?: Exchange[];
  queues?: Queue[];
  logs?: UNodeMQ;
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
  logs: UNodeMQ;
  constructor(option?: Option) {
    this.exchanges = option.exchanges;
    this.queues = option.queues;
    this.logs = option.logs;
    //记录
    if (this.logs) {
      if (this.exchanges) {
        //遍历发送交换机日志给logs
        this.exchanges.forEach((item) => {
          this.logs.emit("EXCHANGE_LOGS", {
            id: item.id,
            name: item.name,
            queueIdList: this.exchanges.map((item) => item.id),
            queueNameList: this.exchanges.map((item) => item.name),
          });
        });
      }

      if (this.queues) {
        //遍历发送队列日志给logs
        this.queues.forEach((item) => {
          this.logs.emit("QUEUE_LOGS", {
            id: item.id,
            name: item.name,
            ask: item.ask,
            newsIdList: item.news.map((item) => item.id),
            consumerIdList: item.consumers.map((item) => item.id),
          });
        });
      }
    }
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
    const exchange: Exchange = this.getExchange(exchangeName);
    const news = new News(content);
    exchange.emit(news, this.logs);
  }
}

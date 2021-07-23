import ConsumerLogs from "./consumerLogs";
import ExchangeLogs from "./exchangeLogs";
import NewsLogs from "./newsLogs";
import QueueLogs from "./queueLogs";

export default class Logs {
  constructor() {}
  /**
   * 所有交换机日志
   */
  allExchangelogs: ExchangeLogs[];
  /**
   * 所有队列日志
   */
  allQueueLogs: QueueLogs[];
  /**
   * 所有消息日志
   */
  allNewsLogs: NewsLogs[];
  /**
   * 所有消费者日志
   */
  allConsumerLogs: ConsumerLogs[];
  /**
   * 清空所有日志
   */
  clear(): Boolean {
    this.allExchangelogs = [];
    this.allQueueLogs = [];
    this.allNewsLogs = [];
    this.allConsumerLogs = [];
    return true;
  }
  /**
   *  获取所有 exchange 日志
   */
  getAllExchangeLogs(): ExchangeLogs[] {
    //排序
    this.allExchangelogs.sort((x, y) => x.emitNum - y.emitNum);
    return this.allExchangelogs;
  }
  /**
   * 获取所有 queue 日志
   */
  getAllQueueLogs(): QueueLogs[] {
    //排序
    this.allQueueLogs.sort((x, y) => x.allNewsNum - y.allNewsNum);
    return this.allQueueLogs;
  }
  /**
   * 获取所有的消息日志
   */
  getAllNewsLogs(): NewsLogs[] {
    //排序
    this.allNewsLogs.sort((x, y) => x.readNum - y.readNum);
    return this.allNewsLogs;
  }
  /**
   * 获取所有的消费者列表
   */
  getAllConsumerLogs(): ConsumerLogs[] {
    //排序
    this.allConsumerLogs.sort((x, y) => x.consumeNum - y.consumeNum);
    return this.allConsumerLogs;
  }
}

import Consumer from "./data/consumer";
import Exchange from "./data/exchange";
import News from "./data/news";
import Queue from "./data/queue";
import Tools from "./utils/tools";
import { Event } from "./logs/enum";

type Option = {
  exchanges?: Exchange[];
  queues?: Queue[];
  logs?: UNodeMQ;
};
type Consume = (content: any) => Promise<Boolean>;
/**
 * 交换机和队列并没有直接的绑定关系
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
   * 消息列表
   */
  news: News[];
  /**
   * 消费者列表
   */
  consumers: Consumer[];
  /**
   * 日志系统
   */
  logs: UNodeMQ;
  constructor(option?: Option) {
    this.exchanges = option.exchanges || [];
    this.queues = option.queues || [];
    this.logs = option.logs;
    this.createLogs();
  }
  /**
   * 创建日志
   * @returns
   */
  createLogs() {
    if (!this.logs) return;

    this.exchanges.forEach((item) => {
      item.logs = this.logs;
      this.logs.emit(Event.AddExchange, {
        id: item.id,
        name: item.name,
      });
    });

    this.queues.forEach((queue) => {
      queue.logs = this.logs;
      if (queue.news) {
        queue.news.forEach((item) => {
          this.logs.emit(Event.AddNews, {
            id: item.id,
            createTimeFormat: Tools.getTimeFormat(item.createTime),
            consumptionSuccess: false, //初始化的消息不能是被消费的消息
            size: Tools.memorySize(String(item.content)),
          });
        });
      }

      if (queue.consumers) {
        queue.consumers.forEach((item) => {
          this.logs.emit(Event.AddConsumer, {
            id: item.id,
            createTimeFormat: Tools.getTimeFormat(item.createTime),
          });
        });
      }

      this.logs.emit(Event.AddQueue, {
        id: queue.id,
        name: queue.name,
        ask: queue.ask,
        newsIdList: queue?.news.map((item) => item.id),
        consumerIdList: queue?.consumers.map((item) => item.id),
      });
    });
  }
  /**
   * 获取单个交换机
   * @param exchangeName
   * @returns
   */
  getExchange(exchangeName: string): Exchange {
    return this.exchanges.find((item) => item.name === exchangeName);
  }
  /**
   * 获取单个队列
   * @param queueName
   * @returns
   */
  getQueue(queueName: string): Queue {
    return this.queues.find((item) => item.name === queueName);
  }
  /**
   * 获取队列列表
   * @param queueNameList
   * @returns
   */
  getQueueList(queueNameList: string[]): Queue[] {
    return this.queues.filter((item) => queueNameList.indexOf(item.name) !== -1);
  }
  /**
   *工厂创建消息
   * @param content
   * @returns
   */
  newsFactory(content: any) {
    const news = new News(content);
    if (this.logs) {
      //发送消息日志
      this.logs.emit("ADD_NEWS", {
        id: news.id,
        createTimeFormat: Tools.getTimeFormat(news.createTime),
        consumptionSuccess: false, //初始化的消息不能是被消费的消息
        size: Tools.memorySize(String(news.content)),
      });
    }
    return news;
  }
  /**
   * 添加错误日志
   * @param msg
   * @returns
   */
  addErrLogs(msg: string) {
    if (!this.logs) return;
    this.logs.emit(Event.AddErrLogs, msg);
  }
  /**
   * 发送消息
   * @param exchangeName
   * @param content
   */
  async emit(exchangeName: string, content: any) {
    //获取交换机
    const exchange: Exchange = this.getExchange(exchangeName);
    if (!exchange) this.addErrLogs(`交换机${exchangeName}不存在`);
    //获取队列列表
    const queueNameList = await exchange.getQueueNameList(content);
    const queueList = this.getQueueList(queueNameList);

    queueList.forEach((queue) => {
      queue.pushNews(content);
    });
  }

  /**
   * 创建消费者
   */
  async on(queueName: string, consume: Consume) {
    const queue = this.getQueue(queueName);
    if (!queue) this.addErrLogs(`队列${queueName}不存在`);
    queue.pushConsumer(consume);
  }
}

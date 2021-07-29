import Consumer from "./data/consumer";
import Exchange from "./data/exchange";
import Logs from "./logs/logs";
import News from "./data/news";
import Queue from "./data/queue";
import Tools from "./utils/tools";

type Option = {
  exchanges?: Exchange[];
  queues?: Queue[];
  news?: News[];
  consumers?: Consumer[];
  logs?: UNodeMQ;
};

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
    this.news = option.news || [];
    this.consumers = option.consumers || [];
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
      this.logs.emit("ADD_EXCHANGE", {
        id: item.id,
        name: item.name,
      });
    });

    this.queues.forEach((item) => {
      this.logs.emit("ADD_QUEUE", {
        id: item.id,
        name: item.name,
        ask: item.ask,
        newsIdList: this.news
          .filter((itemNews) => itemNews.queueId === item.id)
          .map((item) => item.id),
        consumerIdList: this.consumers
          .filter((itemCons) => itemCons.queueId === item.id)
          .map((item) => item.id),
      });
    });

    this.news.forEach((item) => {
      this.logs.emit("ADD_NEWS", {
        id: item.id,
        createTimeFormat: Tools.getTimeFormat(item.createTime),
        consumptionSuccess: false, //初始化的消息不能是被消费的消息
        size: Tools.memorySize(String(item.content)),
      });
    });

    this.consumers.forEach((item) => {
      this.logs.emit("ADD_CONSUMER", {
        id: item.id,
        createTimeFormat: Tools.getTimeFormat(item.createTime),
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
   * 获取消费者
   * @param queueId
   * @returns
   */
  getConsumer(queueId: string): Consumer {
    return this.consumers.find((item) => item.queueId === queueId);
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
   * 发送消息
   * @param exchangeName
   * @param content
   */
  emit(exchangeName: string, content?: any) {
    //获取交换机
    const exchange: Exchange = this.getExchange(exchangeName);
    if (!exchange)
      return this.logs.emit("ADD_ERR_LOGS", `交换机${exchangeName}不存在`);

    if (exchange.repeater) {
      //中继器模式
    } else if (exchange.routes) {
      //路由模式
      exchange.routes.forEach((item) => {
        //获取队列
        const queue = this.getQueue(item);
        if (!queue) return this.logs.emit("ADD_ERR_LOGS", `队列${item}不存在`);
        //生成消息
        const news = this.newsFactory(content);
        //写入队列id
        news.queueId = queue.id;
        //push消息
        this.news.push(news);
        //发送消息
      });

      if (this.logs) {
        this.logs.emit("EDIT_EXCHANGE_DISPENSE_NUM", {
          id: exchange.id,
          addDispenseNum: exchange.routes.length,
        });
      }
    } else {
      throw "routes不存在";
    }
  }
}

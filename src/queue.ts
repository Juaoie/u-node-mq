import Consumer from "./consumer";
import News from "./news";
import UNodeMQ from "./uNodeMQ";
import Tools from "./utils/tools";
type Option = {
  name: string;
  news?: News[];
  consumers?: Consumer[];
  ask?: boolean;
  awaitTime?: number;
};
/**
 * 队列，理论上一个队列的数据格式应该具有一致性
 */
export default class Queue {
  /**
   * id
   */
  id: string;
  /**
   * 队列名字
   */
  name: string;
  /**
   * 消息列表
   */
  news: News[];
  /**
   * 消费者列表
   */
  consumers: Consumer[];
  /**
   * 是否需要消息确认
   */
  ask: boolean;
  /**
   * 等待时长
   */
  awaitTime: number;
  constructor(option: Option) {
    this.name = option.name;
    this.news = option.news;
    this.consumers = option.consumers;
    this.ask = option.ask;
    this.awaitTime = option.awaitTime;
    this.id = Tools.random();
  }
  /**
   * 添加消息
   * @param news
   */
  pushNews(news: News, logs?: UNodeMQ) {
    this.news.push(news);
    logs.emit("EDI_QUEUE_")
    this.send(logs);
  }
  /**
   * 发送消息
   * @returns
   */
  send(logs?: UNodeMQ) {
    // 不存在消费者
    if (this.consumers.length === 0) return;
    this.news.forEach(async (item) => {
      //获取随机index
      const index = Math.round(Math.random() * (this.consumers.length - 1));
      if (this.ask) {
        //需要消息确定
        const isOk = await this.consumers[index].consume(item);
        if (logs) {
          logs.emit("EDIT_NEWS_STATUS", {
            destroyTimeFormat: Tools.getTimeFormat(),
            consumptionSuccess: Boolean(isOk),
          });
        }
      } else {
        //不需要消息确定
        this.consumers[index].consume(item);
        if (logs) {
          logs.emit("EDIT_NEWS_STATUS", {
            destroyTimeFormat: Tools.getTimeFormat(),
            consumptionSuccess: true,
          });
        }
      }
    });
    this.news = [];
  }
}

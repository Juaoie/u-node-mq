import Consumer from "../consumer";
import News from "../news";
import Tools from "../utils/tools";
enum QueueType {
  Random = "Random",
}
type Option = {
  name: string;
  news?: News[];
  consumers?: Consumer[];
  ask?: boolean;
  awaitTime?: number;
  type?: QueueType.Random;
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
  /**
   * 队列类型
   */
  type: QueueType.Random;
  constructor(option: Option) {
    this.name = option.name;
    this.news = option.news;
    this.consumers = option.consumers;
    this.ask = option.ask;
    this.awaitTime = option.awaitTime;
    this.type = option.type;
    this.id = Tools.random();
  }
  /**
   * 添加消息
   * @param news
   */
  pushNews(news: News) {
    this.news.push(news);
    this.send();
  }
  send() {
    
  }
}

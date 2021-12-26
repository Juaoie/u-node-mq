import News from "./news";
import Consumer, { ConsumptionStatus } from "./consumer";
import Logs from "./logs";
interface Option<D> {
  name: string;
  ask?: boolean;
  news?: News<D>[];
  consumerList?: Consumer<D>[];
}
/**
 * 队列，理论上一个队列的数据格式应该具有一致性
 *
 *
 */
export default class Queue<D> {
  /**
   * 队列名字
   */
  name: string;
  /**
   * 是否需要消息确认
   */
  ask: boolean = false;
  /**
   * 消息 list
   */
  news: News<D>[] = [];
  /**
   * 消费者 list
   */
  consumerList: Consumer<D>[] = [];
  constructor(option: Option<D>) {
    this.name = option.name;
    if (option.ask !== undefined) this.ask = option.ask;
    if (option.news !== undefined) this.news = option.news;
    if (option.consumerList !== undefined) this.consumerList = option.consumerList;
  }
  /**
   * 消费方法
   * 只要消费者和消息存在就会消费掉所有的消息
   * @returns
   */
  consumeNews() {
    if (this.news.length === 0) return;
    if (this.consumerList.length === 0) return;
    for (const news of this.news) {
      const index = Math.round(Math.random() * (this.consumerList.length - 1));
      const consumer = this.consumerList.splice(index, 1)[0];
      consumer.consumption(news, this.ask).then((res: ConsumptionStatus<D>) => {
        if (res.isOk) {
          //消费成功
          Logs.log(`队列${this.name} 消费成功`);
        } else {
          this.news.push(res.news);
          Logs.log(`队列${this.name} 消费失败`);
        }
      });
    }
    this.news = [];
  }
}

import News from "./news";
import Consumer, { ConsumptionStatus } from "./consumer";
import Logs from "./logs";
interface Option<D> {
  name: string;
  ask?: boolean;
  rcn?: number;
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
   * 可重新消费次数，消费失败会重复消费
   */
  rcn: number = 3;
  /**
   * 消息 list
   */
  private news: News<D>[] = [];
  /**
   * 消费者 list
   */
  private consumerList: Consumer<D>[] = [];
  constructor(option: Option<D>) {
    this.name = option.name;
    if (option.ask !== undefined) this.ask = option.ask;
    if (option.news !== undefined) this.news = option.news;
    if (option.consumerList !== undefined) this.consumerList = option.consumerList;
    if (option.rcn !== undefined) this.rcn = option.rcn;
  }
  pushNews(...news: News<D>[]) {
    news.filter(item=>item.)
    this.news.push(...news);
  }
  pushConsumer(...consumerList: Consumer<D>[]) {
    this.consumerList.push(...consumerList);
  }
  eject(): News<D> | null {
    if (this.news.length > 0) return this.news.splice(0, 1)[0];
    else null;
  }
  /**
   * 消费方法
   * 只要消费者和消息存在就会消费掉所有的消息
   * @returns
   */
  consumeNews() {
    if (this.news.length === 0) return;
    if (this.consumerList.length === 0) return;
    const news = this.eject();
    //随机消费者的索引
    const index = Math.round(Math.random() * (this.consumerList.length - 1));
    const consumer = this.consumerList.slice(index, 1)[0];
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
}

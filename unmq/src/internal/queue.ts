import News from "./News";
import Consumer, { Consume, ConsumptionStatus } from "./Consumer";
import Logs from "./Logs";
import Tools from "../utils/tools";
interface Option<D> {
  ask?: boolean;
  rcn?: number;
  news?: News<D>[];
  consumerList?: Consumer<D>[];
}
/**
 * 队列，理论上一个队列的数据格式应该具有一致性
 */
export default class Queue<D> {
  /**
   * id
   */
  private readonly id: string = Tools.random();
  getId() {
    return this.id;
  }
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
  getNews() {
    return this.news;
  }
  /**
   * 消费者 list
   */
  private consumerList: Consumer<D>[] = [];
  getConsumerList() {
    return this.consumerList;
  }
  constructor(option: Option<D>) {
    if (option.ask !== undefined) this.ask = option.ask;
    if (option.news !== undefined) this.news = option.news;
    if (option.consumerList !== undefined) this.consumerList = option.consumerList;
    if (option.rcn !== undefined) this.rcn = option.rcn;
  }
  /**
   * 通过消费方法移除指定消费者
   * @param consume
   * @returns
   */
  removeConsumer(consume: Consume<D>) {
    const index = this.consumerList.findIndex(item => item.consume === consume);
    if (index === -1) return false;
    this.consumerList.splice(index, 1);
    return true;
  }
  /**
   * 移除所有消费者
   * @returns
   */
  removeAllConsumer() {
    this.consumerList = [];
    return true;
  }
  /**
   * 通过id移除指定消费者
   * @param consumerId
   * @returns
   */
  removeConsumerById(consumerId: string) {
    const index = this.consumerList.findIndex(item => item.getId() === consumerId);
    if (index === -1) return false;
    this.consumerList.splice(index, 1);
    return true;
  }
  /**
   * 加入消费者
   * @param consumerList
   */
  pushConsumer(consumer: Consumer<D>) {
    this.consumerList.push(consumer);
    if (this.news.length > 0 && this.consumerList.length > 0) this.consumeNews();
  }
  /**
   * 加入消费者消费主体
   * @param consume
   * @param payload
   */
  pushConsume(consume: Consume<D>, payload?: any) {
    const consumer = new Consumer(consume, payload);
    this.pushConsumer(consumer);
  }
  /**
   * 加入消息
   * @param news
   */
  pushNews(news: News<D>) {
    if (news.consumedTimes === -1) news.consumedTimes === this.rcn;

    if (news.consumedTimes > 0) this.news.push(news);

    if (this.news.length > 0 && this.consumerList.length > 0) this.consumeNews();
  }
  /**
   * 加入消息内容
   * @param content
   */
  pushContent(content: D) {
    const news = new News(content);
    this.pushNews(news);
  }

  /**
   * 弹出一条消息
   * @returns
   *
   */
  eject(): News<D> | null {
    if (this.news.length > 0) return this.news.splice(0, 1)[0];
    else null;
  }
  /**
   * 消费方法
   * 只要消费者和消息存在就会消费掉所有的消息
   * @returns
   * TODO:配置是随机消费还是所有消费者都消费
   */
  consumeNews() {
    if (this.news.length === 0) return;
    if (this.consumerList.length === 0) return;
    const news = this.eject();
    //随机消费者的索引
    const index = Math.round(Math.random() * (this.consumerList.length - 1));
    const consumer = this.consumerList.slice(index, index + 1)[0];
    consumer.consumption(news, this.ask).then((res: ConsumptionStatus<D>) => {
      if (res.isOk) {
        //消费成功
        Logs.log(`队列 消费成功`);
      } else {
        res.news.consumedTimes--;
        this.pushNews(res.news);
        Logs.log(`队列 消费失败`);
      }
    });
    if (this.news.length > 0) this.consumeNews();
  }
}

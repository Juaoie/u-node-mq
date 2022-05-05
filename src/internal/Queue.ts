import News from "./News";
import Consumer, { Consume } from "./Consumer";
import Logs from "./Logs";
import Tools from "../utils/tools";
interface Option<D> {
  ask?: boolean;
  rcn?: number;
  news?: News<D>[];
  consumerList?: Consumer<D>[];
  mode?: ConsumMode;
  name?: string;
  async?: boolean;
  maxTime?: number;
  [k: string]: any;
}
export enum ConsumMode {
  "Random" = "Random",
  "All" = "All",
}
/**
 * 队列，理论上一个队列的数据格式应该具有一致性
 *
 */
export default class Queue<D> {
  [k: string]: any;
  name?: string;
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
   * 消费模式
   * - Random 随机抽取消费者消费
   * - All 一条消息所有消费者都消费
   */
  mode: ConsumMode = ConsumMode.Random;
  /**
   * 默认是同步消费
   * 是否是异步消费，如果是同步消费，则一条消息消费完成或者消费失败才会消费下一条消息
   * 为异步消费时，仅在ask为true且消费方法为异步方法时生效
   * 为同步消费时，mode为ALL则需要所有消费者都消费完或者消费失败才能消费下一条消息
   */
  async: boolean = false;
  /**
   * 消费状态，true为正在消费，false为未消费
   */
  private state: boolean = false;
  /**
   * 每个消费者最长消费时长
   * 同步阻塞型代码计算所花时长不计算入内，仅仅控制异步消费者消费代码所花时长
   * 设置为-1表示无时长限制
   * 在ask为true和async为false的情况下设置maxTime为-1可能会导致队列将被阻塞
   */
  maxTime: number = 3000;
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
  constructor(option?: Option<D>) {
    Object.assign(this, option);
  }
  /**
   * 通过消费方法移除指定消费者
   * @param consume
   * @returns
   */
  removeConsumer(consume: Consume<D>) {
    const index = this.consumerList.findIndex((item) => item.consume === consume);
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
   * 移除所有消息
   * @returns
   */
  removeAllNews() {
    this.news = [];
    return true;
  }
  /**
   * 通过id移除指定消费者
   * @param consumerId
   * @returns
   */
  removeConsumerById(consumerId: string) {
    const index = this.consumerList.findIndex((item) => item.getId() === consumerId);
    if (index === -1) return false;
    this.consumerList.splice(index, 1);
    return true;
  }
  /**
   * 加入消费者
   * @param consumerList
   */
  pushConsumer(consumer: Consumer<D>) {
    //过滤重复的消费者id
    if (this.consumerList.findIndex((item) => item.getId() === consumer.getId()) === -1)
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
    if (news.consumedTimes === -1) news.consumedTimes = this.rcn;

    if (news.consumedTimes > 0) {
      //过滤重复的消息id
      if (this.news.findIndex((item) => item.getId() === news.getId()) === -1) this.news.push(news);
    }

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
    else return null;
  }
  /**
   * 消费方法
   * 只要消费者和消息存在就会消费掉所有的消息
   * @returns
   */
  consumeNews() {
    if (this.news.length === 0) return;
    if (this.consumerList.length === 0) return;
    if (!this.async && this.state) return;
    const news = this.eject();
    if (news === null) return;

    this.state = true;

    const getConsumePromise = (): Promise<boolean[]> => {
      if (this.mode === ConsumMode.Random) {
        //随机消费者的索引
        const index = Math.round(Math.random() * (this.consumerList.length - 1));
        const consumer = this.consumerList[index];
        return Promise.all([this.consumption(news, consumer)]);
      }
      //else if (this.mode === ConsumMode.All) {}
      //每个消息消费之间是异步的
      return Promise.all(this.consumerList.map((consumer) => this.consumption(news, consumer)));
    };
    getConsumePromise()
      .then(() => {
        //消息被成功消费
      })
      .catch(() => {
        //消费失败
        news.consumedTimes--;
        this.pushNews(news);
      })
      .finally(() => {
        this.state = false;
        if (this.news.length > 0) this.consumeNews();
      });
    if (this.async && this.news.length > 0) this.consumeNews();
  }
  consumption(news: News<D>, consumer: Consumer<D>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const maxTime = this.maxTime;
      const id: NodeJS.Timeout | null =
        maxTime >= 0
          ? setTimeout(() => {
              Logs.log(`队列 消费超时`);
              reject(false);
            }, maxTime)
          : null;

      consumer.consumption(news, this.ask).then((isOk: boolean) => {
        if (isOk) {
          Logs.log(`队列 消费成功`);
          resolve(isOk);
        } else {
          Logs.log(`队列 消费失败`);
          reject(isOk);
        }
        if (maxTime >= 0) clearTimeout(id as NodeJS.Timeout);
      });
    });
  }
}

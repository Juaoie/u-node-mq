import News from "./news";
import Consumer from "./consumer";
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
  readonly name: string;
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
    this.ask = option.ask;
    this.news = option.news;
    this.consumerList = option.consumerList;
  }
  /**
   * 消费方法
   * 只要消费者和消息存在就会消费掉所有的消息
   * @returns
   */
  consumeNews() {
    if (this.news.length === 0) return;
    if (this.consumerList.length === 0) return;
    const failNews = [];
    if (this.ask) {
      //需要消息确认
      this.news.forEach(async (news) => {
        const index = Math.round(Math.random() * (this.consumerList.length - 1));
        try {
          const isOk = await new Promise(async (resolve, reject) => {
            resolve(await this.consumerList[index].consume(news.content, (value: boolean) => resolve(value)));
          });
          if (isOk) {
          } else {
            //消费失败
            failNews.push(news);
          }
        } catch (error) {
          Logs.error(`${this.consumerList[index].id}消费错误了`);
        }
      });
    } else {
      //不需要消息确认
      this.news.forEach((news) => {
        const index = Math.round(Math.random() * (this.consumerList.length - 1));
        try {
          this.consumerList[index].consume(news.content);
        } catch (error) {
          Logs.error(`${this.consumerList[index].id}消费错误了`);
        }
      });
    }
    this.news = failNews;
  }
}

import News from "./News";
import Consumer, { Consume } from "./Consumer";
import { random } from "../utils/tools";
import Logs, { queueLogsOperator } from "./Logs";
interface Option {
  ask?: boolean;
  rcn?: number;
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
 * 会异步执行的运算方法
 * 不需要通过返回值控制是否继续执行流程
 */
interface AsyncOperator<D> {
  /**
   * 操作挂载执行方法
   * 多个操作符的同个钩子函数会同时执行，所以应该谨慎操作数据，避免产生异步操作数据的问题
   */
  mounted?: (that: Queue<D>) => unknown;
  /**
   * 消息成功添加到队列以后
   */
  addedNews?: (news: News<D>) => unknown;

  /**
   * 消费者成功加入到队列以后
   */
  addedConsumer?: (consumer: Consumer<D>) => unknown;
  /**
   * 消费者成功被移除以后
   * consumerList 被删除的消费列表
   */
  removedConsumer?: (consumerList: Consumer<D>[]) => unknown;
}

/**
 * 会同步的执行的运算符方法
 * 每个运算符方法列表都会同步执行，且一个返回false，后面则不会继续执行，用于控制流程是否继续
 */
interface SyncOperator<D> {
  /**
   * 将消息添加到队列之前
   * 返回的boolean控制消息是否加入队列
   */
  beforeAddNews?: (news: News<D>) => boolean | Promise<boolean>;
  /**
   * 加入消费者之前
   * 返回的boolean控制消费者是否能加入队列
   */
  // beforeAddConsumer?: (consumer: Consumer<D>) => boolean | Promise<boolean>;

  /**
   * 控制消息是否可以被弹出，为false则移除消息
   */
  ejectNews?: (news: News<D>) => boolean | Promise<boolean>;
}
function isAsyncOperator<D>(arg: keyof Operator<D>): arg is keyof AsyncOperator<D> {
  return ["mounted", "addedNews", "addedConsumer", "removedConsumer"].indexOf(arg) !== -1;
}
function isSyncOperator<D>(arg: keyof Operator<D>): arg is keyof SyncOperator<D> {
  return ["beforeAddNews", "ejectNews"].indexOf(arg) !== -1;
}
export type Operator<D> = AsyncOperator<D> & SyncOperator<D>;
/**
 * 队列，理论上一个队列的数据格式应该具有一致性
 *
 */
export default class Queue<D> {
  [k: string]: any;
  name?: string;
  /**
   * 创建时间戳
   */
  readonly createdTime: number;
  /**
   * id
   */
  private readonly id: string = random();
  getId() {
    return this.id;
  }
  /**
   * 是否需要消息确认
   */
  ask = false;
  /**
   * 可重新消费次数，消费失败会重复消费
   */
  rcn = 3;
  /**
   * 消费模式
   * - Random 随机抽取消费者消费
   * - All 一条消息所有消费者都消费
   */
  mode: ConsumMode = ConsumMode.All;
  /**
   * 是否是异步消费，默认false是同步消费
   *
   * 如果是同步消费，则一条消息消费完成或者消费失败才会消费下一条消息
   * 为同步消费时，mode为ALL则需要所有消费者都消费完或者消费失败才能消费下一条消息
   *
   * 如果是异步消费，则会在同一时间内去消费所有消息
   */
  async = false;
  /**
   * 消费状态，true为正在消费，false为未在消费
   * 用于同步消费判断当前的消费状态
   */
  private state = false;
  /**
   * 每个消费者最长消费时长
   * 同步阻塞型代码计算所花时长不计算入内，仅仅控制异步消费者消费代码所花时长
   * 设置为-1表示无时长限制
   * 在ask为true和async为false的情况下设置maxTime为-1可能会导致队列将被阻塞
   */
  maxTime = 3000;
  /**
   * 消息 list
   */
  private news: News<D>[] = [];
  getNews() {
    return this.news;
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
   * 加入消息
   * @param news
   */
  pushNews(news: News<D>) {
    if (news.consumedTimes === -1) news.consumedTimes = this.rcn;

    if (news.consumedTimes > 0) {
      //过滤重复的消息id
      if (this.news.findIndex(item => item.getId() === news.getId()) === -1) {
        this.operate("beforeAddNews", news).then(isOk => {
          if (!isOk) return;
          this.news.push(news);
          this.operate("addedNews", news);
          if (this.news.length > 0 && this.consumerList.length > 0) this.consumeNews();
        });
      }
    }
  }
  /**
   * 弹出一条消息
   * @returns
   *
   */
  async eject(start: number = 0): Promise<News<D> | null> {
    if (this.news.length > 0) {
      const news = this.news.splice(start, 1)[0];
      if (!(await this.operate("ejectNews", news))) return null;

      return news;
    } else return null;
  }
  /**
   * 加入消息内容
   * @param content
   */
  pushContent = ((content: D) => {
    const news = new News(content);
    this.pushNews(news);
  }).bind(this);
  /**
   * 通过id移除指定消息
   * @param newsId
   * @returns
   */
  removeNewsById(newsId: string) {
    const index = this.news.findIndex(item => item.getId() === newsId);
    if (index === -1) return false;
    this.eject(index);
    return true;
  }

  /**
   * 消费者 list
   */
  private consumerList: Consumer<D>[] = [];
  getConsumerList() {
    return this.consumerList;
  }
  /**
   * 加入消费者
   * @param consumerList
   */
  pushConsumer(consumer: Consumer<D>) {
    //过滤重复的消费者id
    if (this.consumerList.findIndex(item => item.getId() === consumer.getId()) === -1) {
      //TODO:暂不能限制开发者绑定消费者
      // this.operate("beforeAddConsumer", consumer).then((isOk) => {
      //   if (!isOk) return;
      //   this.consumerList.push(consumer);
      //   if (this.news.length > 0 && this.consumerList.length > 0) this.consumeNews();
      //   this.operate("addedConsumer", consumer);
      // });
      this.consumerList.push(consumer);
      this.operate("addedConsumer", consumer);
      if (this.news.length > 0 && this.consumerList.length > 0) this.consumeNews();
    }
  }
  /**
   *
   * 通过消费方法移除指定消费者
   * @param consume
   * @returns
   */
  removeConsumer(consume: Consume<D>) {
    const index = this.consumerList.findIndex(item => item.consume === consume);
    if (index === -1) return false;
    const consumerList = this.consumerList.splice(index, 1);
    this.operate("removedConsumer", consumerList);
    return true;
  }
  /**
   * 加入消费者消费主体
   *
   * @param consume
   * @param payload 消费载体，每次消费都会传入给消费者
   */
  pushConsume(consume: Consume<D>, payload?: any) {
    const consumer = new Consumer(consume, payload);
    this.pushConsumer(consumer);
  }

  /**
   * 通过id移除指定消费者
   * @param consumerId
   * @returns
   */
  removeConsumerById(consumerId: string) {
    const index = this.consumerList.findIndex(item => item.getId() === consumerId);
    if (index === -1) return false;
    const consumerList = this.consumerList.splice(index, 1);
    this.operate("removedConsumer", consumerList);
    return true;
  }
  /**
   * 移除所有消费者
   * @returns
   */
  removeAllConsumer() {
    const consumerList = this.consumerList.splice(0);
    this.operate("removedConsumer", consumerList);
    return true;
  }
  /**
   * 操作符集合
   */
  private operators: Operator<D>[] = [];

  /**
   * 添加钩子函数方法
   * @param operator
   * @returns
   */
  add(...operators: Operator<D>[]) {
    operators.forEach(operator => {
      this.operators.push(operator ?? {});
      if (operator?.mounted) operator.mounted(this);
    });
    return this;
  }
  /**
   * 管道操作符执行
   * 其中需要阻塞获取返回值（boolea）的是按顺序执行的
   * @param fun
   * @param args
   * @returns
   */
  private async operate(fun: keyof Operator<D>, ...args: any[]) {
    //先过滤数据
    const list = this.operators
      .filter(operator => operator[fun])
      //
      .map(operator => operator[fun]);
    if (isAsyncOperator(fun)) {
      for (const iterator of list) {
        //异步处理
        iterator?.(args[0]);
      }
    } else if (isSyncOperator(fun)) {
      //同步处理
      for (const iterator of list) {
        if (!(await iterator?.(args[0]))) return false;
      }
    }
    //类型异常
    else throw "operate error";

    return true;
  }
  constructor(option?: Option) {
    Object.assign(this, option);
    this.createdTime = new Date().getTime();
    this.add(queueLogsOperator());
  }

  /**
   * 消费方法
   * 每次执行消费一条消息
   * @returns
   */
  async consumeNews() {
    if (this.news.length === 0) return;
    if (this.consumerList.length === 0) return;
    if (!this.async && this.state) return;

    //先把状态设置为消费中
    this.state = true;

    const consumerList =
      this.mode === ConsumMode.Random ? [this.consumerList[Math.round(Math.random() * (this.consumerList.length - 1))]] : [...this.consumerList];

    this.eject().then(news => {
      if (news === null) {
        this.state = false;
        this.consumeNews();
        return;
      }

      Promise.all(consumerList.map(consumer => this.consumption(news, consumer)))
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
          this.consumeNews();
        });
    });

    //如果是异步的就需要执行，因为此时消息已被弹出
    if (this.async) this.consumeNews();
  }
  /**
   * 指定消费者消费某一条消息的方法
   * @param news
   * @param consumer
   * @returns
   */
  consumption(news: News<D>, consumer: Consumer<D>): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const maxTime = this.maxTime;
      const id =
        maxTime >= 0
          ? setTimeout(() => {
              // Logs.log(`队列 消费超时`);
              reject(false);
            }, maxTime)
          : undefined;

      consumer.consumption(news, this.ask).then((isOk: boolean) => {
        if (isOk) {
          // Logs.log(`队列 消费成功`);
          resolve(isOk);
        } else {
          // Logs.log(`队列 消费失败`);
          reject(isOk);
        }
        if (maxTime >= 0) clearTimeout(id);
      });
    });
  }
}

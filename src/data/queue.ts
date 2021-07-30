import UNodeMQ from "../uNodeMQ";
import Tools from "../utils/tools";
import Consumer from "./consumer";
import News from "./news";
import { Event } from "../logs/enum";
type Option = {
  name: string;
  ask?: boolean;
  news?: News[];
  consumers?: Consumer[];
};
type Consume = (content: any) => Promise<Boolean>;
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
   * 是否需要消息确认
   */
  ask: boolean;
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
  constructor(option: Option) {
    this.id = Tools.random();
    this.name = option.name;
    this.ask = option.ask;
    this.news = option.news || [];
    this.consumers = option.consumers || [];
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
   * 添加消息日志
   * @param id
   * @param createTimeFormat
   * @param size
   * @returns
   */
  addNews(id: string, createTimeFormat: string, size: string) {
    if (!this.logs) return;
    this.logs.emit(Event.AddNews, {
      id,
      createTimeFormat,
      size,
    });
  }
  /**
   * 添加消费者日志
   * @param id
   * @param createTimeFormat
   * @returns
   */
  addConsumer(id: string, createTimeFormat: string) {
    if (!this.logs) return;
    this.logs.emit(Event.AddConsumer, {
      id,
      createTimeFormat,
      consumeNum: 0,
      consumeFail: 0,
    });
  }
  /**
   *编辑消息消费日志
   * @param id
   * @param consumptionSuccess
   */
  editNews(id: string, consumptionSuccess: boolean) {
    if (!this.logs) return;
    this.logs.emit(Event.EditNews, {
      id,
      destroyTimeFormat: Tools.getTimeFormat(), //只要编辑，就代表需要销毁了
      consumptionSuccess,
    });
  }
  /**
   *编辑消费者消费数量日志
   * @param id
   * @param consumeNum
   * @param consumeFail
   */
  editConsumer(
    id: string,
    destroyTimeFormat: string,
    consumeNum: number,
    consumeFail: number
  ) {
    if (!this.logs) return;
    this.logs.emit(Event.EditConsumer, {
      id,
      destroyTimeFormat,
      consumeNum,
      consumeFail,
    });
  }
  /**
   * 添加消息
   * @param contet
   */
  pushNews(contet: any) {
    if (this.news === undefined) this.news = [];
    const news = new News(contet);
    this.news.push(news);
    //添加消息日志
    this.addNews(
      news.id,
      Tools.getTimeFormat(news.createTime),
      Tools.memorySize(String(news.content))
    );
    //消费
    this.consumeNews();
  }
  /**
   * 添加消费者
   * @param consume
   */
  pushConsumer(consume: Consume) {
    if (this.consumers === undefined) this.consumers = [];
    const consumer = new Consumer(consume);
    this.consumers.push(consumer);
    //添加消费者日志
    this.addConsumer(consumer.id, Tools.getTimeFormat(consumer.createTime));
    //消费
    this.consumeNews();
  }
  /**
   *移除消费者
   * @param consume
   * @returns
   */
  offConsumer(consume: Consume) {
    if (this.consumers === undefined) this.consumers = [];
    const index = this.consumers.findIndex((item) => item.consume === consume);
    if (index === -1) return this.addErrLogs(`消费者不存在`);
    this.editConsumer(this.consumers[index].id, Tools.getTimeFormat(), 0, 0);
    this.consumers.splice(index, 1);
  }
  /**
   * 消费方法
   * 只要消费者和消息存在就会消费掉所有的消息
   * @returns
   */
  consumeNews() {
    //如果不存在消费者
    if (this.consumers?.length) return;
    //如果不存在消息
    if (this.news?.length) return;
    if (this.ask) {
      //需要消息确认
      this.news.forEach(async (news) => {
        //获取随机index
        const index = Math.round(Math.random() * (this.consumers.length - 1));
        try {
          const isOk = await this.consumers[index].consume(news.content);
          if (isOk) {
            //消费成功
            this.editNews(news.id, true);
            this.editConsumer(this.consumers[index].id, null, 1, 0);
          } else {
            //消费失败
            this.editNews(news.id, false);
            this.editConsumer(this.consumers[index].id, null, 1, 1);
          }
        } catch (error) {
          this.addErrLogs(`消费者${this.consumers[index].id}消费错误了`);
        }
      });
    } else {
      //不需要消息确认
      this.news.forEach((news) => {
        //获取随机index
        const index = Math.round(Math.random() * (this.consumers.length - 1));
        try {
          this.consumers[index].consume(news.content);
          //不需要确认的情况，都属于消费成功
          this.editNews(news.id, true);
          this.editConsumer(this.consumers[index].id, null, 1, 0);
        } catch (error) {
          this.addErrLogs(`消费者${this.consumers[index].id}消费错误了`);
        }
      });
    }
    //无论消费情况是怎么样，都需要清空数据
    this.news = [];
  }
}
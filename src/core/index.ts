import Exchange from "./exchange";
import Queue from "./queue";
import News from "./news";
import Consumer, { Next } from "./consumer";
import { Consume } from "./consumer";
import Logs from "./logs";
import UnmqFactory from "./UnmqFactory";

interface Option {
  exchangeName: string;
  queueNameList?: string[];
}
export type PluginInstallFunction<D> = (unmq: UNodeMQ<D>, ...options: any[]) => any;
export type Plugin<D> =
  | (PluginInstallFunction<D> & {
      install?: PluginInstallFunction<D>;
    })
  | {
      install: PluginInstallFunction<D>;
    };
/**
 * 仅有emit和on方法会触发队列推送消息给消费者
 */
export default class UNodeMQ<D> {
  exchange: Exchange<D>;
  queueList: Queue<D>[] = [];
  private unmqFactory = new UnmqFactory<D>();

  constructor(option: Option) {
    this.exchange = new Exchange({ name: option.exchangeName });
    if (option.queueNameList !== undefined) this.queueList = this.unmqFactory.produceQueueList(option.queueNameList);
  }
  use(plugin: Plugin<D>, ...options: any[]) {
    plugin.install(this, options);
    return this;
  }
  emit(...contentList: D[]) {
    const news = this.unmqFactory.produceNews(contentList);
    news.forEach(async (news) => {
      const queueNameList = await this.exchange.getQueueNameList(news.content);
      queueNameList.forEach((queueName) => {
        const queue = this.queueList.find((queue) => queue.name === queueName);
        if (queue === undefined) {
          Logs.error(`${queueName} queue not find`);
        } else {
          queue.news.push(news);
          //消费消息
          queue.consumeNews();
        }
      });
    });
    return this;
  }
  /**
   *
   * @param queueName
   * @param consume
   * @param payload 固定参数，有效载荷，在每次消费的时候都传给消费者
   * @returns
   */
  on(queueName: string, consume: Consume<D>, payload?: any) {
    const queue = this.queueList.find((item) => item.name === queueName);
    if (queue === undefined) {
      Logs.error(`${queueName} queue not find`);
      return () => {};
    }
    const consumerList = this.unmqFactory.produceConsumer([consume], payload);
    queue.consumerList.push(consumerList[0]);
    //消费消息
    queue.consumeNews();
    //直接return 需要off传递参数
    return () => this.off(queueName, consume);
  }
  once(queueName: string, consume: Consume<D>, payload?: any) {
    let consumeNum = 0;
    const consumeProxy = (content: D, next?: Next, payload?: any) => {
      if (consumeNum === 1) return; //一个消费者可能需要消耗多条消息,, error 队列里面的消息被消费了，但是这里返回为未被消费
      consumeNum++;
      this.off(queueName, consumeProxy);
      return consume(content, next, payload);
    };
    this.on(queueName, consumeProxy, payload);
    return this;
  }
  off(queueName: string, consume: Consume<D>) {
    const queue = this.queueList.find((item) => item.name === queueName);
    if (queue === undefined) {
      Logs.error(`${queueName} queue not find`);
      return this;
    }
    queue.consumerList = queue.consumerList.filter((item) => item.consume !== consume);
    return this;
  }
}

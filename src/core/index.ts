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
      try {
        const queueNameList = await this.exchange.getQueueNameList(news.content);
        queueNameList.forEach((queueName) => {
          const queue = this.queueList.find((queue) => queue.name === queueName);
          if (queue === undefined) {
            Logs.error(`${queueName} queue not find`);
            return this;
          }
          queue.news.push(news);
          //消费消息
          queue.consumeNews();
        });
      } catch (error) {
        Logs.error(`${this.exchange.name} exchange function getQueueNameList exception`);
      }
    });
    return this;
  }
  on(queueName: string, consume: Consume<D>) {
    const queue = this.queueList.find((item) => item.name === queueName);
    if (queue === undefined) {
      Logs.error(`${queueName} queue not find`);
      return () => {};
    }
    const consumerList = this.unmqFactory.produceConsumer([consume]);
    queue.consumerList.push(consumerList[0]);
    //消费消息
    queue.consumeNews();
    //直接return 需要off传递参数
    return () => this.off(queueName, consume);
  }
  once(queueName: string, consume: Consume<D>) {
    const consumeProxy = (content: D, next?: Next) => {
      this.off(queueName, consumeProxy);
      return consume(content, next);
    };
    this.on(queueName, consumeProxy);
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

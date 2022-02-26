import Exchange from "./exchange";
import Queue from "./queue";
import News from "./news";
import Consumer, { Next } from "./consumer";
import { Consume } from "./consumer";
import Logs from "./logs";
import UnmqFactory from "./UnmqFactory";

interface Option {
  exchangeName?: string;
  queueNameList?: string[];
  ask?: boolean;
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
  private unmqFactory = new UnmqFactory<D>();
  [key: string]: any;
  private queueList: Queue<D>[] = [];
  constructor(option: Option) {
    this.exchange = new Exchange({ name: option.exchangeName || "exchange" });
    if (option.queueNameList !== undefined) {
      this.pushQueueList(option.queueNameList, option.ask);
      if (this.exchange.routes.length === 0) this.exchange.routes = option.queueNameList;
    }
  }
  use(plugin: Plugin<D>, ...options: any[]) {
    plugin.install(this, options);
    return this;
  }
  /**
   * 添加队列列表，驱虫
   * @param queueNameList
   */
  pushQueueList(queueNameList: string[], ask?: boolean) {
    const currentQuestionNameList = this.queueList.map((queue) => queue.name);
    this.queueList.push(
      ...this.unmqFactory.produceQueueList(
        queueNameList.filter((queueName) => currentQuestionNameList.indexOf(queueName) == -1),
        ask
      )
    );
  }
  emit(...contentList: D[]) {
    contentList.forEach(async (content) => {
      const queueNameList = await this.exchange.getQueueNameList(content);
      queueNameList.forEach((queueName) => {
        const queue = this.queueList.find((queue) => queue.name === queueName);
        if (queue === undefined) {
          Logs.error(`${queueName} queue not find`);
        } else {
          queue.pushNews(...this.unmqFactory.produceNews([content]));
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
  on(queueName: string | Symbol, consume: Consume<D>, payload?: any) {
    const queue = this.queueList.find((item) => item.name === queueName);
    if (queue === undefined) {
      Logs.error(`${queueName} queue not find`);
      return () => {};
    }
    const consumerList = this.unmqFactory.produceConsumer([consume], payload);
    queue.pushConsumer(...consumerList);
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
  off(queueName: string | Symbol, consume: Consume<D>) {
    const queue = this.queueList.find((item) => item.name === queueName);
    if (queue === undefined) Logs.error(`${queueName} queue not find`);
    else queue.delConsumer(consume);
    return this;
  }
}

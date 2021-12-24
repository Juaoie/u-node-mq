import Exchange from "./exchange";
import Queue from "./queue";
import News from "./news";
import Consumer, { Next } from "./consumer";
import { Consume } from "./consumer";
import Logs from "./logs";

/**
 * 仅有emit和on方法会触发队列推送消息给消费者
 */
class UnmqFactory<D> {
  produceQueueList(queueName: string | string[]): Queue<D>[] {
    if (typeof queueName === "string") return [new Queue({ name: queueName })];
    else if (queueName instanceof Array) return queueName.map((item) => new Queue({ name: item }));
    else throw "Data type exception";
  }
  produceNews(content: D | D[]): News<D>[] {
    if (typeof content === "string") return [new News<D>(content)];
    else if (content instanceof Array) return content.map((item) => new News<D>(item));
    else throw "Data type exception";
  }
  produceConsumer(consume: Consume<D> | Consume<D>[]) {
    if (typeof consume === "string") return [new Consumer(consume)];
    else if (consume instanceof Array) return consume.map((item) => new Consumer(item));
    else throw "Data type exception";
  }
}

interface Option {
  exchangeName: string;
  queueName?: string | string[];
}

export default class UNodeMQ<D> {
  exchange: Exchange<D>;
  queueList: Queue<D>[] = [];

  constructor(option: Option) {
    this.exchange = new Exchange({ name: option.exchangeName });
    if (option.queueName) this.queueList = new UnmqFactory<D>().produceQueueList(option.queueName);
  }
  emit(...contentList: D[]) {
    const unmqFactory = new UnmqFactory<D>();
    const news = unmqFactory.produceNews(contentList);
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
      return this;
    }
    const unmqFactory = new UnmqFactory<D>();
    const consumerList = unmqFactory.produceConsumer(consume);
    queue.consumerList.push(consumerList[0]);
    //消费消息
    queue.consumeNews();
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
  once(queueName: string, consume: Consume<D>) {
    function consumeProxy(content: D, next?: Next) {
      this.off(queueName, consume);
      return consume(content, next);
    }
    this.on(queueName, consumeProxy);
    return this;
  }
}

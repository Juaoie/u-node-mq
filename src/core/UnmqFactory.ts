import Queue from "./queue";
import News from "./news";
import Consumer, { Consume } from "./consumer";

export default class UnmqFactory<D> {
  produceQueueList(queueName: string[]): Queue<D>[] {
    return queueName.map((item) => new Queue({ name: item }));
  }
  produceNews(content: D[]): News<D>[] {
    return content.map((item) => new News<D>(item));
  }
  produceConsumer(consume: Consume<D>[]): Consumer<D>[] {
    return consume.map((item) => new Consumer(item));
  }
}

import { News } from "../UNodeMQ";
import Consumer, { Consume } from "./consumer";
import Logs from "./logs";
import Queue, { QueueName } from "./queue";

export default class QueueCollection<D> {
  private queueList: Queue<D>[] = [];
  /**
   * 生产队列列表
   * @param queueName
   * @param ask
   * @returns
   */
  private produceQueueList(queueName: QueueName[], ask?: boolean): Queue<D>[] {
    return queueName.map((item) => new Queue({ name: item, ask }));
  }
  /**
   *  生产消息列表
   * @param content
   * @returns
   */
  private produceNews(content: D[]): News<D>[] {
    return content.map((item) => new News<D>(item));
  }
  /**
   * 生产消费者列表
   * @param consume
   * @param payload
   * @returns
   */
  private produceConsumer(consume: Consume<D>[], payload?: any): Consumer<D>[] {
    return consume.map((item) => new Consumer(item, payload));
  }
  /**
   * 添加队列列表，驱虫
   * @param queueNameList
   */
  pushQueueList(queueNameList: QueueName[], ask?: boolean) {
    const currentQuestionNameList = this.queueList.map((queue) => queue.name);
    //驱虫
    this.queueList.push(
      ...this.produceQueueList(
        queueNameList.filter((queueName) => currentQuestionNameList.indexOf(queueName) == -1),
        ask
      )
    );
  }
  /**
   * 添加一条消息到单个队列
   * @param queueName
   * @param news
   */
  pushNewsToQueue(queueName: QueueName, contentList: D) {
    const queue = this.queueList.find((queue) => queue.name === queueName);
    if (queue === undefined) return Logs.error(`${queueName} queue not find`);
    //生产消息，然后加入队列
    queue.pushNews(...this.produceNews([contentList]));
  }
  /**
   * 添加一个消费者到单个队列
   * @param queueName
   * @param consume
   * @param payload
   */
  pushConsumeToQueue(queueName: QueueName, consume: Consume<D>, payload?: any) {
    const queue = this.queueList.find((queue) => queue.name === queueName);
    if (queue === undefined) return Logs.error(`${queueName} queue not find`);
    //添加消费者到队列
    queue.pushConsumer(...this.produceConsumer([consume]));
  }
  /**
   * 获取所有队列名称
   * @returns
   */
  getAllQueueNameList() {
    return this.queueList.map((queue) => queue.name);
  }
}

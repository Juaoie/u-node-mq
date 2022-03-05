import Consumer, { Consume } from "../internal/Consumer";
import Logs from "../internal/Logs";
import News from "../internal/News";
import Queue, { QueueName } from "../internal/Queue";

/**
 * 队列集合
 */
export default class QueueCollection<D> {
  private queueList: Queue<D>[] = [];
  getQueueList() {
    return this.queueList;
  }
  pushQueue(queue: Queue<D>) {
    this.queueList.push(queue);
  }
  getQueueById(queueId: string) {
    return this.queueList.find(item => item.getId() === queueId);
  }
  /**
   * 获取所有队列name列表
   * @returns
   */
  getAllQueueNameList() {
    return this.queueList.map(queue => queue.getName());
  }
  /**
   * 生产队列列表
   * @param queueName
   * @param ask
   * @returns
   */
  private produceQueueList(queueName: QueueName[], ask?: boolean): Queue<D>[] {
    return queueName.map(item => new Queue({ name: item, ask }));
  }
  /**
   *  生产消息列表
   * @param content
   * @returns
   */
  private produceNews(content: D[]): News<D>[] {
    return content.map(item => new News<D>(item));
  }
  /**
   * 生产消费者列表
   * @param consume
   * @param payload
   * @returns
   */
  private produceConsumer(consume: Consume<D>[], payload?: any): Consumer<D>[] {
    return consume.map(item => new Consumer(item, payload));
  }
  /**
   * 通过队列名称生成队列，驱虫添加队列
   * @param queueNameList
   */
  pushQueueList(queueNameList: QueueName[], ask?: boolean) {
    const currentQuestionNameList = this.queueList.map(queue => queue.getName());
    //驱虫
    this.queueList.push(
      ...this.produceQueueList(
        queueNameList.filter(queueName => currentQuestionNameList.indexOf(queueName) == -1),
        ask,
      ),
    );
  }
  /**
   * 添加一条消息到单个队列
   * @param queueName
   * @param news
   */
  pushNewsToQueue(queueName: QueueName, contentList: D) {
    const queue = this.queueList.find(queue => queue.getName() === queueName);
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
    const queue = this.queueList.find(queue => queue.getName() === queueName);
    if (queue === undefined) return Logs.error(`${queueName} queue not find`);
    //添加消费者到队列
    queue.pushConsumer(...this.produceConsumer([consume], payload));
  }
  /**
   * 添加一个消费者到所有队列
   * @param consume
   * @param payload
   */
  pushConsumeToAllQueue(consume: Consume<D>, payload?: any) {
    for (const queue of this.queueList) {
      //添加消费者到队列
      queue.pushConsumer(...this.produceConsumer([consume], payload));
    }
  }
  /**
   * 移除队列中的消费者
   * @param queueName
   * @param consume
   * @returns
   */
  removeConsumeFromQueue(queueName: QueueName, consume: Consume<D>) {
    const queue = this.queueList.find(queue => queue.getName() === queueName);
    if (queue === undefined) return Logs.error(`${queueName} queue not find`);
    //移除消费者
    queue.removeConsumer(consume);
  }
  /**
   * 移除队列中所有消费者
   * @param queueName
   * @returns
   */
  removeAllConsumeFromQueue(queueName: QueueName) {
    const queue = this.queueList.find(queue => queue.getName() === queueName);
    if (queue === undefined) return Logs.error(`${queueName} queue not find`);
    //移除所有消费者
    queue.removeAllConsumer();
  }
  /**
   * 移除所有队列中的指定消费者
   * @param consume
   */
  removeConsumeFromAllQueue(consume: Consume<D>) {
    for (const queue of this.queueList) {
      queue.removeConsumer(consume);
    }
  }
  /**
   * 移除所有消费者
   */
  removeConsume() {
    for (const queue of this.queueList) {
      queue.removeAllConsumer();
    }
  }
  /**
   *根据名称删除队列
   * @param queueName
   */
  removeQueueByName(queueName?: QueueName) {
    if (queueName) {
      const queue = this.queueList.find(queue => queue.getName() === queueName);
      if (queue === undefined) return Logs.error(`${queueName} queue not find`);
      this.queueList.splice(
        this.queueList.findIndex(item => item.getName() === queueName),
        1,
      );
    } else {
      this.queueList = [];
    }
  }
  removeQueueById(queueId?: string) {
    if (queueId) {
      const queue = this.queueList.find(queue => queue.getId() === queueId);
      if (queue === undefined) return Logs.error(`${queueId} queue not find`);
      this.queueList.splice(
        this.queueList.findIndex(item => item.getId() === queueId),
        1,
      );
    } else {
      this.queueList = [];
    }
  }
}

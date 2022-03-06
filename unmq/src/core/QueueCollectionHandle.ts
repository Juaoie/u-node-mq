import Consumer, { Consume } from "../internal/Consumer";
import Logs from "../internal/Logs";
import News from "../internal/News";
import Queue from "../internal/Queue";

/**
 * 队列集合
 */
export default class QueueCollectionHandle<QueueCollection extends Record<string, Queue<unknown>>> {
  private queueCollection: QueueCollection;
  setQueueCollection(queueCollection: QueueCollection) {
    this.queueCollection = queueCollection;
  }
  /**
   * 添加一个消息内容到队列
   * @param queueName
   * @param content
   * @returns
   */
  pushContentToQueue(queueName: string, content: unknown) {
    if (this.queueCollection[queueName] === undefined) {
      Logs.error(`${queueName} not find`);
      return false;
    }
    this.queueCollection[queueName].pushContent(content);
    return true;
  }
}

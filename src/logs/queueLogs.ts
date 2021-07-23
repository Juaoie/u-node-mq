enum Type {
  random = "random",
}

export default class QueueLogs {
  /**
   * 队列 id
   */
  id: string;
  /**
   * 队列名称
   */
  name: string;
  /**
   * 	是否需要消息确认
   */
  ask: boolean;
  /**
   * 等待消息确认的最大时长，ask 为 true 才有
   */
  awaitTimeFormat: number;
  /**
   * 多个消费者的时候如何分发消息
   */
  type: Type;
  /**
   * 	队列内消息 id 列表
   */
  newsIdList: string[];
  /**
   * 队列内消息数量
   */
  newsNum: number;
  /**
   * 队列内所有消息数量（包括已消费的）
   */
  allNewsNum: number;
  /**
   * 队列消费者 id 列表
   */
  consumerIdList: string[];
  /**
   * 	队列消费者者数量
   */
  consumerNum: number;
  /**
   * 队列内所有消费者数量（包括已取消的）
   */
  allConsumerNum: number;
  constructor() {}
}

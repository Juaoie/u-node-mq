enum Type {
  random = "random",
}

export default class AllQueueLogs {
  /**
   * 队列名称
   */
  name: String;
  /**
   * 队列 id
   */
  id: String;
  /**
   * 	是否需要消息确认
   */
  ask: Boolean;
  /**
   * 等待消息确认的最大时长，ask 为 true 才有
   */
  awaitTimeFormat: Number;
  /**
   * 多个消费者的时候如何分发消息
   */
  type: Type;
  /**
   * 	队列内消息 id 列表
   */
  newsIdList: String[];
  /**
   * 队列内消息数量
   */
  newsNum: Number;
  /**
   * 队列内所有消息数量（包括已消费的）
   */
  allNewsnum: Number;
  /**
   * 队列消费者 id 列表
   */
  consumerIdList: String[];
  /**
   * 	队列消费者者数量
   */
  consumerNum: Number;
  /**
   * 队列内所有消费者数量（包括已取消的）
   */
  allConsumerNum: Number;
  constructor() {}
}

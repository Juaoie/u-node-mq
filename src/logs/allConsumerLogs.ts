export default class AllConsumerLogs {
  /**
   * 消费者 id
   */
  id: Number;
  /**
   * 	消费者创建时间
   */
  createTimeFormat: String;
  /**
   * 消费次数
   */
  consumeNum: Number;
  /**
   * 最近消费时间
   */
  latestConsumeTimeFormat: String;
  constructor() {}
}

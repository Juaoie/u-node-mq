export default class ConsumerLogs {
  /**
   * 消费者 id
   */
  id: number;
  /**
   * 	消费者创建时间
   */
  createTimeFormat: string;
  /**
   * 销毁时间
   */
  destroyTimeFormat: string;
  /**
   * 消费次数
   */
  consumeNum: number;
  /**
   * 最近消费时间
   */
  latestConsumeTimeFormat: string;
  constructor() {}
}

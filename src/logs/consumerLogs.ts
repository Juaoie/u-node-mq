export default class ConsumerLogs {
  /**
   * 消费者 id
   */
  id: string;
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
  constructor(id: string, createTimeFormat: string) {
    this.id = id;
    this.createTimeFormat = createTimeFormat;
    this.consumeNum = 0;
  }
}

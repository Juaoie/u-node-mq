export default class ExchangeLogs {
  /**
   * 交换机 id
   */
  id: string;
  /**
   * 交换机名称
   */
  name: string;
  /**
   * 	emit 成功数量
   */
  emitNum: number;
  /**
   * 数据分配成功数量
   */
  dispenseNum: number;
  /**
   * emit 消息队列名称列表
   */
  emitQueueNameList: string[];
  /**
   * emit 消息队列数量
   */
  emitQueueNum: number;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.emitNum = 0;
    this.dispenseNum = 0;
    this.emitQueueNameList = [];
    this.emitQueueNum = 0;
  }
}

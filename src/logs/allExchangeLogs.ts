export default class AllExchangeLogs {
  /**
   * 交换机名称
   */
  name: String;
  /**
   * 交换机 id
   */
  id: String;
  /**
   * 	emit 成功数量
   */
  emitNum: Boolean;
  /**
   * 数据分配成功数量
   */
  dispenseNum: Number;
  /**
   * 	消息队列 id 的数量
   */
  queueIdList: String[];
  /**
   * 消息队列名称列表
   */
  queueNameList: String[];
  /**
   * 消息队列数量
   */
  queueNum: Number;

  constructor() {}
}

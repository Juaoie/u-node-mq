/**
 * 记录交换机日志
 */
interface ExchangeLogs {
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
   * 	消息队列 id 的数量
   */
  queueIdList: string[];
  /**
   * 消息队列名称列表
   */
  queueNameList: string[];
  /**
   * 消息队列数量
   */
  queueNum: number;
}

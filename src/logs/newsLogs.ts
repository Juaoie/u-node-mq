import tools from "../utils/tools";

export default class NewsLogs {
  /**
   * 消息 id
   */
  id: string;
  /**
   * 	消息创建时间
   */
  createTimeFormat: string;
  /**
   * 销毁时间
   */
  destroyTimeFormat: string;
  /**
   * 是否被成功消费
   */
  consumptionSuccess: boolean;
  /**
   * 消息大小
   */
  size: string;
  constructor(id: string, createTimeFormat: string, consumptionSuccess: boolean, size: string) {
    this.id = id;
    this.createTimeFormat = createTimeFormat;
    this.consumptionSuccess = consumptionSuccess;
    this.size = size;
  }
}

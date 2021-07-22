import tools from "../utils/tools";

export default class AllNewsLogs {
  /**
   * 消息 id
   */
  id: String;
  /**
   * 	消息创建时间
   */
  createTimeFormat: String;
  /**
   * 消息大小
   */
  size: String;
  /**
   * 读取次数
   */
  readNum: Number;
  /**
   * 最近读取时间
   */
  latestReadTimeFormat: String;
  constructor() {}
  setSize(news: any) {
    this.size = tools.memorySize(JSON.stringify(news));
  }
}

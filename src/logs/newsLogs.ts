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
   * 消息大小
   */
  size: string;
  /**
   * 读取次数
   */
  readNum: number;
  /**
   * 最近读取时间
   */
  latestReadTimeFormat: string;
  constructor() {}
  setSize(news: any) {
    this.size = tools.memorySize(JSON.stringify(news));
  }
}

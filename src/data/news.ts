import Tools from "../utils/tools";

export default class News<T> {
  /**
   * id
   */
  id: string;
  /**
   * 消费者创建时间戳
   */
  createTime: number;
  /**
   * 消息内容
   */
  content: T;
  constructor(content: T) {
    this.id = Tools.random();
    this.createTime = new Date().getTime();
    this.content = content;
  }
}

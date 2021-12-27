import Tools from "../utils/tools";

export default class News<D> {
  /**
   * id
   */
  readonly id: string = Tools.random();
  /**
   * 消费者创建时间戳
   */
  createTime: number;
  /**
   * 消息内容
   */
  content: D;
  constructor(content: D) {
    this.createTime = new Date().getTime();
    this.content = content;
  }
}
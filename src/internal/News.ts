import { random } from "src/utils/tools";
import { ComponentEnum } from "../utils/types";
import Logs from "./Logs";

export default class News<D> {
  [k: string]: any;
  /**
   * id
   */
  private readonly id: string = random();
  getId() {
    return this.id;
  }
  /**
   * 消费者创建时间戳
   */
  readonly createdTime: number;
  /**
   * 消息内容
   */
  content: D;
  /**
   * 剩余可重复消费次数
   */
  consumedTimes = -1;

  constructor(content: D) {
    this.createdTime = new Date().getTime();
    this.content = content;
    Logs.getLogsInstance()?.setLogs(ComponentEnum.NEWS, { id: this.getId(), createdTime: this.createdTime });
  }
}

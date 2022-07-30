import { ComponentEnum } from "../utils/types";
import { random } from "../utils/tools";
import Logs from "./Logs";
/**
 * 中继器类型
 */
type Repeater<D> = (content: D) => Promise<string[]> | string[];

export type ExchangeOption<D> = {
  routes?: string[];
  repeater?: Repeater<D>;
  name?: string;
  [k: string]: any;
};
/**
 * 交换机
 */
export default class Exchange<D> {
  [k: string]: any;
  name?: string;
  /**
   * 创建时间戳
   */
  readonly createdTime: number;
  /**
   * id
   */
  private readonly id: string = random();
  getId() {
    return this.id;
  }
  /**
   * 静态路由
   */
  private routes: string[] = [];
  getRoutes() {
    return this.routes;
  }
  pushRoutes(routes: string[]) {
    this.routes = Array.from(new Set(this.routes.concat(routes)));
  }
  setRoutes(routes: string[]) {
    this.routes = routes;
  }
  /**
   * 动态路由（中继器）
   */
  private repeater: Repeater<D> = () => this.getRoutes();
  getRepeater() {
    return this.repeater;
  }
  setRepeater(repeater: Repeater<D>) {
    this.repeater = repeater;
  }

  constructor(option?: ExchangeOption<D>) {
    Object.assign(this, option);
    this.createdTime = new Date().getTime();
    Logs.getLogsInstance()?.setLogs(ComponentEnum.EXCHANGE, { id: this.getId(), name: this.name, createdTime: this.createdTime });
  }

  /**
   * 删除routes
   * @param routes
   */
  removeRoutes(routes?: string[]) {
    if (routes === undefined) this.routes = [];
    else this.routes = this.routes.filter(item => routes.indexOf(item) !== -1);
  }

  /**
   * 获取队列名称列表
   * @param content
   * @returns
   */
  async getQueueNameList(content: D): Promise<string[]> {
    Logs.getLogsInstance()?.setLogs(ComponentEnum.EXCHANGE, { id: this.getId(), accepted: 1, name: this.name, createdTime: this.createdTime });
    try {
      //中继器模式
      const queueNames = await this.repeater(content);
      Logs.getLogsInstance()?.setLogs(ComponentEnum.EXCHANGE, {
        id: this.getId(),
        send: queueNames.length,
        queueNames,
        name: this.name,
        createdTime: this.createdTime,
      });
      return queueNames;
    } catch (error) {
      Logs.getLogsInstance()?.setLogs(ComponentEnum.EXCHANGE, {
        id: this.getId(),
        name: this.name,
        createdTime: this.createdTime,
        message: JSON.stringify(error),
      });
      return [];
    }
  }
}

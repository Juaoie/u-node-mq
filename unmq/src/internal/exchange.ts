import Tools from "../utils/tools";
import Logs from "./Logs";
import { QueueName } from "./Queue";
/**
 * 中继器类型
 */
type Repeater<D> = (content: D) => Promise<QueueName[]> | QueueName[];

export type Option<D> = {
  name: string;
  routes?: QueueName[];
  repeater?: Repeater<D>;
};
/**
 * 交换机
 */
export default class Exchange<D> {
  /**
   * id
   */
  private readonly id: string = Tools.random();
  getId() {
    return this.id;
  }
  /**
   * 静态路由
   */
  private routes: QueueName[] = [];
  getRoutes() {
    return this.routes;
  }
  pushRoutes(routes: QueueName[]) {
    this.routes = Array.from(new Set(this.routes.concat(routes)));
  }
  setRoutes(routes: QueueName[]) {
    this.routes = routes;
  }
  /**
   * 动态路由（中继器）
   */
  private repeater: Repeater<D>;
  getRepeater() {
    return this.repeater;
  }
  setRepeater(repeater: Repeater<D>) {
    this.repeater = repeater;
  }

  constructor(option: Option<D>) {
    if (option.routes !== undefined) this.routes = option.routes;
    if (option.repeater !== undefined) this.repeater = option.repeater;
  }

  /**
   * 删除routes
   * @param routes
   */
  removeRoutes(routes?: QueueName[]) {
    if (routes === undefined) this.routes = [];
    else this.routes = this.routes.filter(item => routes.indexOf(item) !== -1);
  }

  /**
   * 获取队列名称列表
   * @param content
   * @returns
   */
  async getQueueNameList(content: D): Promise<QueueName[]> {
    try {
      //中继器模式
      if (this.repeater) {
        return await this.repeater(content);
      } else if (this.routes) {
        return this.routes;
      }
    } catch (error) {
      Logs.error(`exchange function getQueueNameList exception`);
      return [];
    }
  }
}

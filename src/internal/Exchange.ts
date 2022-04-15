import Tools from "../utils/tools";
import Logs from "./Logs";
/**
 * 中继器类型
 */
type Repeater<D> = (content: D) => Promise<string[]> | string[];

export type Option<D> = {
  routes?: string[];
  repeater?: Repeater<D>;
  name?: string;
};
/**
 * 交换机
 */
export default class Exchange<D> {
  [k: string]: any;
  name?: string;
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

  constructor(option?: Option<D>) {
    if (option?.routes !== undefined) this.routes = option.routes;
    if (option?.repeater !== undefined) this.repeater = option.repeater;
    if (option?.name !== undefined) this.name = option.name;
  }

  /**
   * 删除routes
   * @param routes
   */
  removeRoutes(routes?: string[]) {
    if (routes === undefined) this.routes = [];
    else this.routes = this.routes.filter((item) => routes.indexOf(item) !== -1);
  }

  /**
   * 获取队列名称列表
   * @param content
   * @returns
   */
  async getQueueNameList(content: D): Promise<string[]> {
    try {
      //中继器模式
      return await this.repeater(content);
    } catch (error) {
      Logs.error(`exchange function getstringList exception`);
      return [];
    }
  }
}

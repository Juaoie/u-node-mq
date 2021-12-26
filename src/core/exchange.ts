import Logs from "./logs";

type Repeater<D> = (content: D) => Promise<string[]> | string[];

export type Option<D> = {
  name: string;
  routes?: string[];
  repeater?: Repeater<D>;
};

/**
 * 交换机
 */
export default class Exchange<D = any> {
  /**
   * 交换机名字
   */
  readonly name: string;
  /**
   * 需要匹配的队列名称
   */
  routes: string[] = [];
  /**
   * 中继器
   */
  repeater?: Repeater<D>;

  constructor(option: Option<D>) {
    this.name = option.name;
    if (option.routes !== undefined) this.routes = option.routes;
    if (option.repeater !== undefined) this.repeater = option.repeater;
  }
  /**
   * 获取队列名称列表
   * @param content
   * @returns
   */
  async getQueueNameList(content: D): Promise<string[]> {
    //中继器模式
    if (this.repeater) {
      try {
        const queueNameList = await this.repeater(content);
        //记录日志分配成功的数量
        return queueNameList;
      } catch (error) {
        Logs.error(`${this.name} exchange error`);
      }
    } else if (this.routes) {
      return this.routes;
    }
  }
}

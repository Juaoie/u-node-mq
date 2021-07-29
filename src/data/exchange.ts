import Tools from "../utils/tools";
import News from "./news";
import Queue from "./queue";

type Repeater = (content: any) => string[];

type Option = {
  name: string;
  routes?: string[];
  queues?: Queue[];
  repeater?: Repeater;
};

/**
 * 交换机
 */
export default class Exchange {
  /**
   * id
   */
  id: string;
  /**
   * 交换机名字
   */
  name: string;
  /**
   * 需要匹配的队列名称
   */
  routes: string[];
  /**
   * 中继器
   */
  repeater: Repeater;

  constructor(option: Option) {
    this.name = option.name;
    this.routes = option.routes;
    this.repeater = option.repeater;
    this.id = Tools.random();
  }
}

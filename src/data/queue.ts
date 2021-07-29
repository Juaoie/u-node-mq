import Tools from "../utils/tools";
type Option = {
  name: string;
  ask?: boolean;
};
/**
 * 队列，理论上一个队列的数据格式应该具有一致性
 */
export default class Queue {
  /**
   * id
   */
  id: string;
  /**
   * 队列名字
   */
  name: string;
  /**
   * 是否需要消息确认
   */
  ask: boolean;
  constructor(option: Option) {
    this.id = Tools.random();
    this.name = option.name;
    this.ask = option.ask;
  }
}

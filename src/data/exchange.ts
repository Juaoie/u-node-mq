import UNodeMQ from "../UNodeMQ";
import Tools from "../utils/tools";
import Queue from "./queue";
import { Event } from "../logs/enum";

type Repeater = (content: any) => Promise<string[]>;

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
  /**
   * 日志系统
   */
  logs: UNodeMQ;

  constructor(option: Option) {
    this.name = option.name;
    this.routes = option.routes || [];
    this.repeater = option.repeater;
    this.id = Tools.random();
  }
  /**
   * 添加错误日志
   * @param msg
   * @returns
   */
  addErrLogs(msg: string) {
    if (!this.logs) return;
    this.logs.emit(Event.AddErrLogs, msg);
  }
  /**
   * 编辑交换机分配成功数量
   * @param id
   * @param dispenseNum
   * @returns
   */
  editExchangeDispenseNum(id: string, dispenseNum: number) {
    if (!this.logs) return;
    this.logs.emit(Event.EditExchangeDispenseNum, { id, dispenseNum });
  }
  /**
   * 编辑交换机emit数量
   * @param id
   * @param emitNum
   * @returns
   */
  editExchangeEmitNum(id: string, emitNum: number) {
    if (!this.logs) return;
    this.logs.emit(Event.EditExchangeEmitNum, { id, emitNum });
  }
  /**
   * 获取队列名称列表
   * @param content
   * @returns
   */
  async getQueueNameList(content: any): Promise<string[]> {
    //无论返回什么，都算emit成功
    this.editExchangeEmitNum(this.id, 1);
    //中继器模式
    if (this.repeater) {
      try {
        const queueNameList = await this.repeater(content);
        //记录日志分配成功的数量
        this.editExchangeDispenseNum(this.id, queueNameList.length);
        return queueNameList;
      } catch (error) {
        this.addErrLogs(`${this.name}交换机的repeater属性错误`);
      }
    } else if (this.routes) {
      //记录日志分配成功的数量
      this.editExchangeDispenseNum(this.id, this.routes.length);
      return this.routes;
    } else {
      this.addErrLogs(`${this.name}交换机的repeater和routes属性不存在`);
    }
    return [];
  }
}

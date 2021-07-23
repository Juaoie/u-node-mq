import { Exchange } from "./exchange";
import Logs from "./logs/logs";
import { Queue } from "./queue";

type Option = {
  exchanges?: Exchange[];
  queues?: Queue[];
  logs?: Logs[];
};
/**
 *
 */
export default class UNodeMQ {
  /**
   * 交换机列表
   */
  exchanges: Exchange[];
  /**
   * 队列列表
   */
  queues: Queue[];
  /**
   * 日志系统
   */
  logs: Logs[];
  constructor(option: Option) {
    this.exchanges = option.exchanges;
    this.queues = option.queues;
    this.logs = option.logs;
  }
}

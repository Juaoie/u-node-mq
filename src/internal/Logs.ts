import Queue, { Operator } from "./Queue";
import { ComponentEnum } from "../utils/types";
/**
 * 应该尽量避免生产环境中把日志混入代码，减少代码量，除非生产环境中需要使用到日志
 * unmq:{
 *    log:false      //默认false
 *    type:'http'|'console'  //默认'console'
 *    components:['Exchange','Queue','News','Consumer']   //默认*
 *
 * }
 */
/**
 * 使用operator记录queue日志
 * @returns
 */
export function queueLogsOperator<D = unknown>(): Operator<D> {
  let queueInstance: Queue<D>;
  function addQueueData() {
    Logs.getLogsInstance()?.setLogs(ComponentEnum.QUEUE, {
      name: queueInstance.name,
      createdTime: queueInstance.createdTime,
      id: queueInstance.getId(),
      newsNum: queueInstance.getNews().length,
      newsIds: queueInstance.getNews().map(item => item.getId()),
      consumerNum: queueInstance.getConsumerList().length,
      consumerIds: queueInstance.getConsumerList().map(item => item.getId()),
      message: "queue ok!",
    });
  }
  return {
    mounted(queue) {
      queueInstance = queue;
      addQueueData();
    },
    addedNews(news) {
      addQueueData();
    },
    ejectNews(news) {
      addQueueData();
      return true;
    },
    addedConsumer(consumer) {
      addQueueData();
    },
    removedConsumer(consumerList) {
      addQueueData();
    },
  };
}
enum LogsEnum {
  "CUSTOM" = "custom",
  "CONSOLE" = "console",
}
type LogsType = LogsEnum.CUSTOM | LogsEnum.CONSOLE;
type LogsComponent = ComponentEnum.EXCHANGE | ComponentEnum.QUEUE | ComponentEnum.NEWS | ComponentEnum.CONSUMER;
interface LogsConfig {
  logs: boolean;
  types?: LogsType[];
  logsComponents?: LogsComponent[];
  customFunction?: <D>(name: LogsComponent, data: D) => void;
}
interface BaseLogData {
  id: string; //id
  createdTime: number; //创建时间戳
  name?: string; //名称
  message?: string; //描述日志
}
interface ExchangeLogData {
  accepted?: number; //当前接收写入交换机的消息数量
  send?: number; //当前发送给队列的消息数量，一条消费发送给两个队列，send则为2
  queueNames?: string[]; //已发送给队列的队列名称列表
}
interface QueueLogData {
  newsNum: number; //当前消息数量
  newsIds: string[]; //当前消息的id列表
  consumerNum: number; //当前消费者数量
  consumerIds: string[]; //当前消费者id列表
}
interface NewsLogData {}
interface ConsumerLogData {
  accepted?: number; //当前消费数量
}

interface LogDataTypes {
  [ComponentEnum.EXCHANGE]: BaseLogData & ExchangeLogData;
  [ComponentEnum.QUEUE]: BaseLogData & QueueLogData;
  [ComponentEnum.NEWS]: BaseLogData & NewsLogData;
  [ComponentEnum.CONSUMER]: BaseLogData & ConsumerLogData;
}
type CustomLogFunction = <K extends LogsComponent>(name: LogsComponent, data: LogDataTypes[K]) => unknown;
/**
 * 添加队列事件
  ```ts
    Logs.getLogsInstance()?.addQueueData({});
  ```
 */
export default class Logs {
  private constructor() {}
  private static logs: boolean = false;
  private static types: LogsType[];
  private static logsComponents: LogsComponent[];
  private static customFunction: CustomLogFunction;
  static setLogsConfig(logsConfig: LogsConfig) {
    this.logs = logsConfig.logs;
    this.types = logsConfig.types ?? [LogsEnum.CONSOLE];
    this.logsComponents = logsConfig.logsComponents ?? [ComponentEnum.EXCHANGE, ComponentEnum.QUEUE, ComponentEnum.NEWS, ComponentEnum.CONSUMER];
    this.customFunction = logsConfig.customFunction ?? function () {};
  }
  /**
   * 获取日志实例
   * @returns
   */
  static getLogsInstance() {
    if (!this.logs) return;
    return {
      setLogs: this.setLogs.bind(this),
    };
  }
  /**
   * 设置日志
   * @param name
   * @param data
   * @returns
   */
  private static setLogs<K extends LogsComponent>(name: LogsComponent, data: LogDataTypes[K]) {
    if (this.logsComponents.indexOf(name) === -1) return;

    this.types.forEach(type => {
      if (type === LogsEnum.CUSTOM) {
        this.customFunction(ComponentEnum.QUEUE, data);
      } else if (type === LogsEnum.CONSOLE) {
        console.log(ComponentEnum.QUEUE, data);
      }
    });
  }
}

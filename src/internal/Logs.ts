import { isObject } from "../utils/tools";
import Queue, { Operator } from "./Queue";
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
    Logs.getLogsInstance()?.addQueueData({
      name: queueInstance.name || "",
      createdTime: queueInstance.createdTime,
      id: queueInstance.getId(),
      newsNum: queueInstance.getNews().length,
      newsIds: queueInstance.getNews().map(item => item.getId()),
      consumerNum: queueInstance.getConsumerList().length,
      consumerIds: queueInstance.getConsumerList().map(item => item.getId()),
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

/**
 * 所有平台请求
 */
function allPlatformRequest(url: string, data: any) {
  if (isObject(wx)) wechatRequest(url, data);
  else if (isObject(window)) browserRequest(url, data);
  else nodeRequest(url, data);
}
/**
 * 浏览器请求
 */
function browserRequest(url: string, data: any) {
  const oReq = new XMLHttpRequest();
  oReq.open("POST", url);
  oReq.setRequestHeader("content-type", "application/json");
  oReq.send(JSON.stringify(data));
}
/**
 * node端请求
 */
function nodeRequest(url: string, data: any) {
  try {
    const request = require("request");
    request({
      headers: { "content-type": "application/json" },
      url,
      method: "POST",
      json: true,
      body: data,
    });
  } catch (error) {
    Logs.getLogsInstance()?.error(error);
  }
}
/**
 * 微信请求
 */
declare var wx: any;
function wechatRequest(url: string, data: any) {
  wx.request({
    url,
    data,
    header: {
      "content-type": "application/json", // 小程序默认值
    },
  });
}
type LogsType = "http" | "console";
type LogsComponent = "Exchange" | "Queue" | "News" | "Consumer";
interface LogsConfig {
  logs: boolean;
  types?: LogsType[];
  logsComponents?: LogsComponent[];
  httpUrl?: string; //日志发送服务器地址
}
interface QueueLogData {
  id: string; //队列id
  name: string; //队列名称
  createdTime: number; //队列创建时间戳
  newsNum: number; //当前消息数量
  newsIds: string[]; //当前消息的id列表
  consumerNum: number; //当前消费者数量
  consumerIds: string[]; //当前消费者id列表
}
interface ExchangeLogData {
  id: string; //交换机id
  name: string; //交换机名称
  createdTime: number; //交换机创建时间戳
  accepted?: number; //当前接收写入交换机的消息数量
  send?: number; //当前发送给队列的消息数量，一条消费发送给两个队列，send则为2
  queueNames?: string[]; //已发送给队列的队列名称列表
}
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
  private static httpUrl: string;
  static setLogsConfig(logsConfig: LogsConfig) {
    this.logs = logsConfig.logs;
    this.types = logsConfig.types ?? ["console"];
    this.logsComponents = logsConfig.logsComponents ?? ["Exchange", "Queue", "News", "Consumer"];
    this.httpUrl = logsConfig.httpUrl ?? "http://localhost:9090";
  }
  /**
   *
   * @returns
   */
  static getLogsInstance() {
    if (!this.logs) return;
    return {
      logs: this.logs,
      types: this.types,
      logsComponents: this.logsComponents,
      httpUrl: this.httpUrl,
      error: this.error,
      addQueueData: this.addQueueData,
      addExchangeData: this.addExchangeData,
    };
  }
  /**
   *
   * @param message
   */
  private static error(message: any) {
    console.error(message);
  }
  /**
   * 添加队列数据
   * @param data
   * @returns
   */
  private static addQueueData(data: QueueLogData) {
    if (this.logsComponents.indexOf("Queue") === -1) return;
    this.types.forEach(type => {
      if (type === "http") allPlatformRequest(this.httpUrl, data);
      else if (type === "console") {
        console.log(data);
      }
    });
  }
  /**
   *
   * @param data
   * @returns
   */
  private static addExchangeData(data: ExchangeLogData) {
    if (this.logsComponents.indexOf("Exchange") === -1) return;
    this.types.forEach(type => {
      if (type === "http") allPlatformRequest(this.httpUrl, data);
      else if (type === "console") {
        console.log(data);
      }
    });
  }
}

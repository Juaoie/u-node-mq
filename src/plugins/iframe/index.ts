import UNodeMQ, { Exchange, Queue } from "../../index.js";
import { Coordinate } from "./coordinate/index.js";
import { broadcastGetCoordinateMessage, broadcastMessage } from "./sender.js";
export enum MessageType {
  GeneralMessage, //普通消息
  FindExchangeMessage, //广播查找交换机消息
  SendCoordinateMessage, //发送exchange消息
  OnlineNotificationMessage, //上线通知消息
}
//直发消息队列，即主动发送
export const getInternalIframeMessageQueueName = (queueName: string) => queueName + "_Message";
//等待消息发送队列，被动发送
export const getInternalIframeWaitMessageQueueName = (queueName: string) => queueName + "_Wait_Message";
//坐标消息队列
export const getInternalIframeCoordinateQueueName = (queueName: string) => queueName + "_Coordinate";

export default class IframeMessage {
  private static __name: string;
  static getName() {
    return IframeMessage.__name;
  }
  private static __unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>;
  static getUnmq() {
    return IframeMessage.__unmq;
  }
  constructor(name: string) {
    IframeMessage.__name = name;
  }
  install(unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>, ...options: any[]) {
    const selfExchange = unmq.getExchange(IframeMessage.__name);
    if (!selfExchange) {
      throw `${IframeMessage.__name}交换机不存在`;
    }
    IframeMessage.__unmq = unmq;
    const list = unmq.getExchangeList();
    const otherIframe = list.filter((item) => item.name !== IframeMessage.getName());

    for (const name in otherIframe) {
      //用于接受直接发送的消息
      unmq.addQueue(new Queue({ name: getInternalIframeMessageQueueName(name) }));
      //为直发的队列挂载消费者
      unmq.on(getInternalIframeWaitMessageQueueName(name), this.sendMessage, name);
      //当直接发送的消息发送失败了，就进入等待发送队列
      unmq.addQueue(new Queue({ name: getInternalIframeWaitMessageQueueName(name) }));
      //设置队列消息存储的队列
      unmq.addQueue(new Queue({ name: getInternalIframeCoordinateQueueName(name) }));
    }

    //广播发送上线通知
    broadcastMessage(MessageType.OnlineNotificationMessage, null);
  }
  private async sendMessage(content: any, name: string) {
    try {
      await broadcastGetCoordinateMessage(name);
    } catch (error) {}
  }
}

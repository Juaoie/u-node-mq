import UNodeMQ, { Exchange, isObject, isString, Queue } from "../../index.js";
import { getOtherAllIframeDoc } from "./loader.js";
//TODO:解决插件引用路径长度问题
//TODO:跨iframe共享storage
//TODO:单元测试框架集成
export enum MessageType {
  GeneralMessage, //普通消息
  FindExchangeMessage, //广播查找交换机消息
  SendCoordinateMessage, //发送exchange坐标消息
  OnlineNotificationMessage, //上线通知消息
}

//直发消息队列，即主动发送
export const getInternalIframeMessageQueueName = (queueName: string) => queueName + "_Message";
//用来广播获取地址的消息
export const getInternalIframeBroadcasMessageQueueName = (queueName: string) => queueName + "_Wait_Message";

export default class IframeMessage {
  private name: string;
  private unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>;
  constructor(name: string) {
    this.name = name;
  }
  install(unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>, ...options: any[]) {
    const selfExchange = unmq.getExchange(this.name);
    if (!selfExchange) {
      throw `${this.name}交换机不存在`;
    }
    this.unmq = unmq;
    const list = unmq.getExchangeList();
    const otherIframe = list.filter((item) => item.name !== this.name);

    for (const iframe of otherIframe) {
      iframe.setRepeater(null);
      iframe.setRoutes([
        getInternalIframeMessageQueueName(iframe.name),
        getInternalIframeBroadcasMessageQueueName(iframe.name),
      ]);
      //用于存储消息的队列
      unmq.addQueue(new Queue({ name: getInternalIframeMessageQueueName(iframe.name) }));
      //用来广播获取地址的消息
      unmq.addQueue(new Queue({ name: getInternalIframeBroadcasMessageQueueName(iframe.name) }));

      //为广播消息挂载消费方法
      unmq.on(getInternalIframeBroadcasMessageQueueName(iframe.name), () => {
        //广播查找交换机地址消息
        this.broadcastMessage(MessageType.FindExchangeMessage, {
          exchangeName: iframe.name,
          msg: `who is ${this.name}`,
        });
      });
    }

    //广播发送上线通知
    this.broadcastMessage(MessageType.OnlineNotificationMessage, null);

    //监听unmq的消息
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }
  /**
   *
   * @param param0
   * @returns
   */
  private receiveMessage({ source, data, origin }) {
    if (!isObject(data)) return;
    const { mask, type, message, fromName } = data;
    if (mask !== "u-node-mq-plugin") return;
    ///////////需要判断来源的消息
    if ([MessageType.OnlineNotificationMessage, MessageType.SendCoordinateMessage].indexOf(type) !== -1) {
      //发送者是否存在
      const fromIframe = this.unmq.getExchange(fromName);
      if (!fromIframe) return;
      //判断真实的origin 是否是我想要的 origin
      if (isString(fromIframe.origin) && fromIframe.origin !== origin) return;
      // 拿到对方坐标，准备发送消息
      this.unmq.on(getInternalIframeMessageQueueName(fromName), (data) => {
        this.postMessage(source, MessageType.GeneralMessage, data, origin);
      })();
      return;
    }

    ///////////不需要判断来源的消息

    //普通消息
    if (type === MessageType.GeneralMessage) return this.unmq.emit(this.name, message);

    //查找交换机消息
    if (type === MessageType.FindExchangeMessage && message.exchangeName === this.name) {
      this.postMessage(source, MessageType.SendCoordinateMessage, { msg: `my name is ${this.name}` }, origin);
    }
  }

  /**
   *发送消息
   * @param currentWindow
   * @param type
   * @param message
   * @param origin
   * @param transfer
   */
  private postMessage(
    currentWindow: Window,
    type: MessageType,
    message: any,
    origin?: string,
    transfer?: Transferable[]
  ) {
    currentWindow.postMessage(
      {
        mask: "u-node-mq-plugin",
        type,
        message,
        fromName: this.name,
      },
      origin,
      transfer
    );
  }
  /**
   *广播消息
   * @param type
   * @param message
   */
  private broadcastMessage(type: MessageType, message: any) {
    const list = getOtherAllIframeDoc();
    list.forEach((item) => {
      this.postMessage(item.window, type, message, "*");
    });
  }
}

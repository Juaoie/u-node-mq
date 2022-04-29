import UNodeMQ, { Exchange, isObject, isString, Queue } from "../../index";
import { getOtherAllIframeDoc } from "./loader";
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
export const getInternalIframeMessageQueueName = (queueName: string) => queueName + "_Iframe_Message";
//用来广播获取地址的消息
export const getInternalIframeBroadcasMessageQueueName = (queueName: string) => queueName + "_Iframe_Wait_Message";

export default class IframePlugin {
  private unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>> | null = null;
  constructor(private readonly name: string) {
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
      if (iframe.name === undefined) throw `系统错误`;
      iframe.setRepeater(() => [
        getInternalIframeMessageQueueName(iframe.name as string),
        getInternalIframeBroadcasMessageQueueName(iframe.name as string),
      ]);
      //用于存储消息的队列
      unmq.addQueue(new Queue({ name: getInternalIframeMessageQueueName(iframe.name), async: true }));
      //用来广播获取地址的消息
      unmq.addQueue(new Queue({ name: getInternalIframeBroadcasMessageQueueName(iframe.name), async: true }));

      //为广播消息挂载消费方法
      unmq.on(getInternalIframeBroadcasMessageQueueName(iframe.name), () => {
        //广播查找交换机地址消息
        this.broadcastMessage(MessageType.FindExchangeMessage, {
          exchangeName: iframe.name,
          msg: `who is ${iframe.name} ?`,
        });
      });
    }

    //广播发送上线通知
    this.broadcastMessage(MessageType.OnlineNotificationMessage, { msg: `${this.name} is online` });

    //监听unmq的消息
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }
  /**
   *
   * @param param0
   * @returns
   */
  private receiveMessage({ source, data, origin }: MessageEventInit) {
    if (this.unmq === null) throw `${this.name} iframe 未安装`;
    if (!isObject(data)) return;
    const { mask, type, message, fromName } = data;
    if (mask !== "u-node-mq-plugin") return;
    if (source === null || source === undefined) return;
    //发送者是否存在
    const fromIframe = this.unmq.getExchange(fromName);
    if (!fromIframe) return;
    //判断真实的origin 是否是我想要的 origin
    if (isString(fromIframe.origin) && fromIframe.origin !== origin) return;

    if ([MessageType.OnlineNotificationMessage, MessageType.SendCoordinateMessage].indexOf(type) !== -1) {
      // 拿到对方坐标，准备发送消息
      const off = this.unmq.on(getInternalIframeMessageQueueName(fromName), (data) => {
        this.postMessage(source as Window, MessageType.GeneralMessage, data, origin);
      });
      setTimeout(off);
      return true;
    }

    //普通消息
    if (type === MessageType.GeneralMessage) {
      //发送确认收到消息
      this.unmq.emit(this.name, message);
      return true;
    }

    //查找交换机消息
    if (type === MessageType.FindExchangeMessage && message.exchangeName === this.name) {
      this.postMessage(source as Window, MessageType.SendCoordinateMessage, { msg: `my name is ${this.name}` }, origin);
      return true;
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
    origin: string = "*",
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

import UNodeMQ, { Exchange, Queue } from "../../index";
import { isObject, isString } from "../../utils/tools";
// type Option = {};
/**
 * 使用postMessage进行iframe跨域通信
 */
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
    //
  }
  install(unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>) {
    const selfExchange = unmq.getExchange(this.name);
    if (!selfExchange) {
      throw `${this.name}交换机不存在`;
    }
    this.unmq = unmq;
    const list = unmq.getExchangeList();
    const otherIframe = list.filter(item => item.name !== this.name);

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
      const off = this.unmq.on(getInternalIframeMessageQueueName(fromName), data => {
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
  private postMessage(currentWindow: Window, type: MessageType, message: any, origin = "*", transfer?: Transferable[]) {
    currentWindow.postMessage(
      {
        mask: "u-node-mq-plugin",
        type,
        message,
        fromName: this.name,
      },
      origin,
      transfer,
    );
  }
  /**
   *广播消息
   * @param type
   * @param message
   */
  private broadcastMessage(type: MessageType, message: any) {
    const list = getOtherAllIframeDoc();
    list.forEach(item => {
      this.postMessage(item.window, type, message, "*");
    });
  }
}
/**
 * 饼平化方便取值
 * 但是需要标记每个window在多维数组中的位置
 * window为第一层，记为0，0
 * window下第一个iframe记为0，1
 * y 是深度
 *
 * x 是索引
 *
 * 只要有一个window产生就全局核对坐标点
 * 只要有一个IframeMessage被创建则代表当前创建了一个window
 *
 *
 */

/**
 * 获取其他所有Iframe doc
 * @returns
 */
export function getOtherAllIframeDoc(): T[] {
  if (window.top === null) throw "window.top is null";
  const list = getAllIframeDoc(window.top, 0, 0);
  return list.filter(item => item.window !== window.self);
}
/**
 * 获取自己的iframe doc
 * @returns
 */
export function getSelfIframeDoc() {
  if (window.top === null) throw "window.top is null";
  const list = getAllIframeDoc(window.top, 0, 0);
  return list.find(item => item.window === window.self);
}
type T = {
  window: Window;
  x: number;
  y: number;
};
/**
 * 获取所有node doc
 * @param w
 * @param x
 * @param y
 * @returns
 */
export function getAllIframeDoc(w: Window, x: number, y: number): T[] {
  const arr: T[] = [];
  arr.push({
    window: w,
    x,
    y,
  });
  y += 1;
  for (let k = 0; k < w.length; k++) {
    arr.push(...getAllIframeDoc(w[k], x, y));
    x += 1;
  }
  return arr;
}

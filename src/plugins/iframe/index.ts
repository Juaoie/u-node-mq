import UNodeMQ, { Exchange, Queue, createSingleUnmq } from "../../index";
import { isObject, isString } from "../../utils/tools";
import resizeObserver from "../../operators/resizeObserver/index";
type Option = {
  autoSize?: boolean; //是否自动大小
  arg?: string | HTMLElement; //当前iframe自动大小的节点元素id或者元素dom，默认为html元素
};
const IFRAEE_MASK = "u-node-mq-plugin";

/**
 * 使用postMessage进行iframe跨域通信
 */
export enum MessageType {
  /**
   * 普通消息
   */
  GeneralMessage,

  /**
   * 广播查找交换机消息
   */
  FindExchangeMessage,

  /**
   * 发送exchange坐标消息
   */
  SendCoordinateMessage,

  /**
   * 上线通知消息
   */
  OnlineNotificationMessage,

  /**
   * 同步容器大小消息
   */
  ResizeObserverMessage,
}
/**
 * 直发消息队列，即主动发送
 * @param queueName
 * @returns
 */
export const getInternalIframeMessageQueueName = (queueName: string) => queueName + "_Iframe_Message";
/**
 * 用来广播获取地址的消息
 * @param queueName
 * @returns
 */
export const getInternalIframeBroadcasMessageQueueName = (queueName: string) => queueName + "_Iframe_Wait_Message";

export default class IframePlugin {
  private unmq: UNodeMQ<any, Record<string, Exchange<any>>, Record<string, Queue<any>>> | null = null;
  constructor(private readonly name: string, option?: Option) {
    if (option?.autoSize) {
      const resizeObserverInstance = createSingleUnmq<ResizeObserverEntry>().add(resizeObserver(option.arg));
      resizeObserverInstance.on(res => {
        const selfFrame = getSelfIframeDoc();
        if (selfFrame === undefined) throw "selfFrame is undefined";
        //
        if (selfFrame.y === 0) return;
        if (selfFrame.window.parent === window) return;

        //隐藏iframe滚动条，或者在iframe元素上设置scrolling 为 no
        document.body.style.overflow = "hidden";

        //Failed to execute 'postMessage' on 'Window': ResizeObserverEntry object could not be cloned
        this.postMessage(selfFrame.window.parent, MessageType.ResizeObserverMessage, {
          width: res.contentRect.width,
          height: res.contentRect.height,
        });
      });
    }
  }
  install(unmq: UNodeMQ<any, Record<string, Exchange<any>>, Record<string, Queue<any>>>) {
    const selfExchange = unmq.getExchange(this.name);
    if (!selfExchange) {
      throw `${this.name}交换机不存在`;
    }
    this.unmq = unmq;
    const list = unmq.getExchangeList();
    const otherIframe = list.filter(item => item.name !== this.name);

    for (const iframe of otherIframe) {
      if (iframe.name === undefined) throw `系统错误`;

      const internalIframeMessageQueueName = getInternalIframeMessageQueueName(iframe.name);
      const internalIframeBroadcasMessageQueueName = getInternalIframeBroadcasMessageQueueName(iframe.name);

      iframe.setRepeater(() => [internalIframeMessageQueueName, internalIframeBroadcasMessageQueueName]);
      //用于存储消息的队列
      unmq.addQueue(internalIframeMessageQueueName, new Queue({ async: true }));
      //用来广播获取地址的消息
      unmq.addQueue(internalIframeBroadcasMessageQueueName, new Queue({ async: true }));

      //为广播消息挂载消费方法
      unmq.on(internalIframeBroadcasMessageQueueName, () => {
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
   * 接收消息
   * @param param0
   * @returns
   */
  private receiveMessage({ source, data, origin }: MessageEvent) {
    if (this.unmq === null) throw `${this.name} iframe 未安装`;
    if (!isObject(data)) return false;
    const { mask, type, message, fromName } = data;

    if (mask !== IFRAEE_MASK) return false;

    if (source === null || source === undefined) return false;

    /**
     * 发送者是否存在
     * 仅接收初始化创建Exchange的iframe的消息
     */
    const fromIframe = this.unmq.getExchange(fromName);
    if (fromIframe === null) return false;

    /**
     * 判断真实的origin 是否是我想要的 origin
     */
    if (isString(fromIframe.origin) && fromIframe.origin !== origin) return false;

    //接收到有人上线 或者 有人发送坐标过来
    if ([MessageType.OnlineNotificationMessage, MessageType.SendCoordinateMessage].indexOf(type) !== -1) {
      const off = this.unmq.on(getInternalIframeMessageQueueName(fromName), data => {
        this.postMessage(source as Window, MessageType.GeneralMessage, data, origin);
      });
      setTimeout(off);
    }

    //普通消息
    else if (type === MessageType.GeneralMessage) {
      this.unmq.emit(this.name, message);
    }

    //查找交换机消息
    else if (type === MessageType.FindExchangeMessage && message.exchangeName === this.name) {
      this.postMessage(source as Window, MessageType.SendCoordinateMessage, { msg: `my name is ${this.name}` }, origin);
    }

    //同步容器大小消息
    else if (type === MessageType.ResizeObserverMessage) {
      let index = 0;
      for (let i = 0; i < window.frames.length; i++) {
        if (source === window.frames) {
          index = i;
          break;
        }
      }
      const dos = document.getElementsByTagName("iframe");
      if (dos.length - 1 < index) throw "dom节点与iframe数量不匹配";
      dos[index].width = message.width;
      dos[index].height = message.height;
      // dos[index].scrolling = "no";
    }

    //
    else return false;

    return true;
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
        mask: IFRAEE_MASK,
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
function getOtherAllIframeDoc(): T[] {
  if (window.top === null) throw "window.top is null";
  const list = getAllIframeDoc();
  return list.filter(item => item.window !== window.self);
}
/**
 * 获取自己的iframe doc
 * @returns
 */
function getSelfIframeDoc(): T | undefined {
  if (window.top === null) throw "window.top is null";
  const list = getAllIframeDoc();
  return list.find(item => item.window === window.self);
}
type T = {
  window: Window;
  x: number;
  y: number;
};
/**
 * 获取所有node doc
 * @returns
 * https://www.typescriptlang.org/play?#code/C4TwDgpgBAKlC8UDeBYAUFTUDuAuKAdgK4C2ARhAE4Dc6WUAHvseVbRliM6RTegL7sAZkQIBjYAEsA9gSgBzCMACCAG1UBJIZQCGJCABFpYgBR4oOgiACUyOljGyAzsCirJL7q0oBtALoIUP72mKpKjIEADCFu4SBR6DEi4lKyCkoGEBBgAGK6+mb4liAANIxevGVchDxUtqgc9JgA9M1QjgRO0mEAdKrS8iYARAC0Y+MTE0PWMfSt7c7dEH0DJjazWPMdXb39g+4uPiB+M41NkkJQJgfARwHwD1CiACYQQpIEEM+2N3eBDBtMBBVE5oAxAgBqCG-Y6AhadJYrfYeYCnJoOZyuHSUSj4GD+QL+djozDYyg9MBEJwACxMDRJTWwJTh9AYzLODNKcP41mJJPiEMQAEY+eihNJKFcwq4ANZRahQOUAHhwfRRfQgBHkwGpCplUPqLKwZIpVNpPQtimAmWyeT0EDMasOMr8ZTZUBsvKNmHBgqgIu5cMoSiIlDkZNFUH4MWDwFDcitNty+QdTMYVTRmza20Re2uKNO0bQ6G2WJxgStak02ntRlMMXpJMkz3wkXZDJu+B83rsHIZWGb+CF7f76M7QR7DMbo5nUEHUAAzCPZ6Px8E+yuo2Vp5umy2oAAWZe7scort+Sckosn12JDdNfjHqeXzDzgBMT5na5fTR3J-o84AKyfv+bhnkEF73rO167pB0FwnBWA8neOa7KsZLWEAA
 */
function getAllIframeDoc(): T[] {
  const list: number[] = [];
  const x = 0;
  const y = 0;

  function getDeepFrame(w: Window, x: number, y: number) {
    if (list[y] === undefined) list[y] = x;
    else x = ++list[y];

    const arr: T[] = [];
    arr.push({
      window: w,
      x,
      y,
    });
    y += 1;
    //window === window.frames
    for (let k = 0; k < w.frames.length; k++) {
      arr.push(...getDeepFrame(w[k], x, y));
      x += 1;
    }
    return arr;
  }

  if (window.top === null) throw "window.top is null";
  return getDeepFrame(window.top, x, y);
}

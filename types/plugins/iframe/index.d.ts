import UNodeMQ, { Exchange, Queue } from "../../index";
/**
 * 使用postMessage进行iframe跨域通信
 */
export declare enum MessageType {
  GeneralMessage = 0,
  FindExchangeMessage = 1,
  SendCoordinateMessage = 2,
  OnlineNotificationMessage = 3,
}
export declare const getInternalIframeMessageQueueName: (queueName: string) => string;
export declare const getInternalIframeBroadcasMessageQueueName: (queueName: string) => string;
export default class IframePlugin {
  private readonly name;
  private unmq;
  constructor(name: string);
  install(unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>): void;
  /**
   *
   * @param param0
   * @returns
   */
  private receiveMessage;
  /**
   *发送消息
   * @param currentWindow
   * @param type
   * @param message
   * @param origin
   * @param transfer
   */
  private postMessage;
  /**
   *广播消息
   * @param type
   * @param message
   */
  private broadcastMessage;
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
export declare function getOtherAllIframeDoc(): T[];
/**
 * 获取自己的iframe doc
 * @returns
 */
export declare function getSelfIframeDoc(): T | undefined;
declare type T = {
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
export declare function getAllIframeDoc(w: Window, x: number, y: number): T[];
export {};

import Tools from "../../utils/tools";
import { Coordinate } from "./coordinate/index.js";
import IframeMessage, { getInternalIframeCoordinateQueueName, MessageType } from "./index.js";
import { getAllIframeDoc, getIframeNodeFromCoordinate, getOtherAllIframeDoc, getSelfIframeDoc } from "./loader.js";

/**
 * 发送消息方法
 * @param currentWindow
 * @param type
 * @param message
 * @param origin
 * @param transfer
 */
const postMessage = (
  currentWindow: Window,
  type: MessageType,
  message: any,
  origin?: string,
  transfer?: Transferable[]
) => {
  currentWindow.postMessage(
    {
      mask: "u-node-mq-plugin",
      type,
      message,
      fromName: IframeMessage.getName(),
    },
    origin,
    transfer
  );
};
/**
 * 发送消息
 * @param data
 * @param coordinate
 */
export function singleMessage(type: MessageType, currentWindow: Window, message: any, origin?: string) {
  postMessage(currentWindow, type, message, origin);
}

/**
 * 广播消息
 * @param data
 */
export function broadcastMessage(type: MessageType, message: any) {
  const list = getOtherAllIframeDoc();
  list.forEach((item) => {
    postMessage(item.window, type, message, "*");
  });
}
//查找交换机的地址
interface FindExchangeCoordinate {
  exchangeName: string;
  random: string | number;
  msg: any;
}
/**
 * 广播获取坐标信息
 * @param exchangeName
 */
export function broadcastGetCoordinateMessage(exchangeName: string) {
  const findExchangeCoordinate: FindExchangeCoordinate = {
    exchangeName,
    random: Tools.random(),
    msg: null,
  };
  broadcastMessage(MessageType.FindExchangeMessage, findExchangeCoordinate);

  return new Promise<Coordinate>((resolve, reject) => {
    const iframeMessage = IframeMessage.getInstance();
    const unmq = iframeMessage.getUnmq();

    //TODO:测试能使将1000 改 为 0
    const id = setTimeout(() => {
      unmq.off(getInternalIframeCoordinateQueueName(exchangeName), getExchangeCoordinae);
      reject();
    }, 1000);

    unmq.on(getInternalIframeCoordinateQueueName(exchangeName), getExchangeCoordinae);
    function getExchangeCoordinae(messageCoordinate: MessageCoordinate) {
      unmq.off(getInternalIframeCoordinateQueueName(exchangeName), getExchangeCoordinae);
      //判断随机数是否正常,然后加入路由表
      if (messageCoordinate.random == random) {
        clearTimeout(id);
        resolve(messageCoordinate);
      }
    }
  });
}

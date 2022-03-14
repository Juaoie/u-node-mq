import { Coordinate } from "./coordinate";
import IframeMessage from "./IframeMessage";
import { getAllIframeDoc, getIframeNodeFromCoordinate, getOtherAllIframeDoc, getSelfIframeDoc } from "./loader";
type Data = {
  message: any;
  transfer?: Transferable[];
};
export enum MessageType {
  GeneralMessage, //普通消息
  FindExchangeMessage, //广播查找交换机消息
}
/**
 * 发送消息方法
 * @param currentWindow
 * @param type
 * @param message
 * @param origin
 * @param transfer
 */
const postMessage = (currentWindow: Window, type: MessageType, message: any, origin: string = "*", transfer?: Transferable[]) => {
  const selfIframe = getSelfIframeDoc();
  currentWindow.postMessage(
    {
      type,
      message,
      fromName: IframeMessage.getInstance().getName(),
      fromOrigin: window.origin,
      x: selfIframe.x,
      y: selfIframe.y,
    },
    origin,
    transfer,
  );
};
/**
 * 发送消息
 * @param data
 * @param coordinate
 */
export function singleMessage(data: Data, coordinate: Coordinate) {
  const currentWindow = getIframeNodeFromCoordinate(coordinate);
  postMessage(currentWindow, MessageType.GeneralMessage, data.message);
  currentWindow.postMessage(
    {
      type: MessageType.GeneralMessage,
      message: data.message,
    },
    coordinate.origin,
    data.transfer,
  );
}

/**
 * 广播消息
 * @param data
 */
export function broadcastMessage(type: MessageType, data: Data) {
  const list = getOtherAllIframeDoc();
  list.forEach(item => {
    postMessage(item.window, type, data.message, "*", data.transfer);
  });
}

window.addEventListener("message", receiveMessage, false);
function receiveMessage() {}

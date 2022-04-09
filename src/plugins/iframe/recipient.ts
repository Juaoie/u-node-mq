import { isObject, isString } from "../../index";
import IframeMessage, { getInternalIframeMessageQueueName, MessageType } from ".";
import { singleMessage } from "./sender";

/**
 * 监听message事件触发
 */
window.addEventListener("message", receiveMessage, false);
function receiveMessage({ source, data, origin }) {
  if (isObject(data)) {
    const { mask, type, message, fromName } = data;
    if (mask === "u-node-mq-plugin") {
      if (type === MessageType.FindExchangeMessage) {
        //查找交换机消息
        findExchangeMessage(source, data, origin);
      } else if (type === MessageType.GeneralMessage) {
        //普通消息
        generalMessage(message);
      } else if (type === MessageType.SendCoordinateMessage) {
        // 接受的位置信息消息
        sendCoordinateMessage(source, data, origin);
      } else if (type === MessageType.OnlineNotificationMessage) {
        //发送者是否存在
        const fromIframe = IframeMessage.getUnmq().getExchange(fromName);
        if (!fromIframe) return;
        //判断真实的origin 是否是我想要的 origin
        if (isString(fromIframe.origin) && fromIframe.origin !== origin) return;
        //上线通知消息
        onlineNotificationMessage(source, fromName, origin);
      }
    }
  }
}

/**
 * 处理上线通知消息
 * @param source
 * @param data
 * @param origin
 * @returns
 */
function onlineNotificationMessage(source: Window, fromName: string, origin: string) {
  const queueName = getInternalIframeMessageQueueName(fromName);
  //队列是否存在
  if (!IframeMessage.getUnmq().getQueue(queueName)) return;
  IframeMessage.getUnmq().on(queueName, (content) => {
    singleMessage(MessageType.GeneralMessage, source, content, origin);
  })();
}

/**
 * 处理普通消息
 * @param message
 */
function generalMessage(message: any) {
  IframeMessage.getUnmq().emit(IframeMessage.getName(), message);
}

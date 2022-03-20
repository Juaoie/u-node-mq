import { Coordinate } from "./coordinate/index.js";
import IframeMessage, {
  getInternalIframeCoordinateQueueName,
  getInternalIframeMessageQueueName,
  MessageCoordinate,
} from "./Iframe.js";
import { getAllIframeDoc, getIframeNodeFromCoordinate, getOtherAllIframeDoc, getSelfIframeDoc } from "./loader.js";
export enum MessageType {
  GeneralMessage, //普通消息
  FindExchangeMessage, //广播查找交换机消息
  SendCoordinateMessage, //发送exchange消息
  OnlineNotificationMessage, //上线通知消息
}

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
      fromName: IframeMessage.getInstance().getName(),
      fromOrigin: window.origin,
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
 * 处理查找交换机消息
 * @param source
 * @param data
 * @param origin
 */
function findExchangeMessage(source: Window, data: any, origin: string) {
  const iframeMessage = IframeMessage.getInstance();
  const name = iframeMessage.getName();
  const message: FindExchangeCoordinate = data.message;
  if (name === message.exchangeName) {
    const findExchangeCoordinate: FindExchangeCoordinate = {
      exchangeName: name,
      random: data.message.random,
      msg: `我是${name}。`,
    };
    singleMessage(MessageType.SendCoordinateMessage, source, findExchangeCoordinate, "*");
  }
}
/**
 * 处理普通消息
 * @param source
 * @param data
 * @param origin
 */
function generalMessage(source: Window, data: any, origin: string) {
  const iframeMessage = IframeMessage.getInstance();
  iframeMessage.emit(iframeMessage.getName(), data.message);
}

/**
 * 处理发送坐标位置消息
 * @param source
 * @param data
 * @param origin
 * @returns
 */
function sendCoordinateMessage(source: Window, data: any, origin: string) {
  const iframeMessage = IframeMessage.getInstance();
  const fromExchange = iframeMessage.getUnmq().getExchange(data.fromName);
  if (fromExchange === undefined) return;
  //判断真实的origin 是否是我想要的 origin
  if (fromExchange.origin !== "*" && fromExchange.origin !== origin) return;
  const message: FindExchangeCoordinate = data.message;
  iframeMessage.getUnmq().emitToQueue(getInternalIframeCoordinateQueueName(message.exchangeName), {
    name: message.exchangeName,
    random: message.random,
    currentWindow: source,
    origin: origin,
  });
}
/**
 * 处理上线通知消息
 * @param source
 * @param data
 * @param origin
 * @returns
 */
function onlineNotificationMessage(source: Window, data: any, origin: string) {
  const iframeMessage = IframeMessage.getInstance();

  const fromExchange = iframeMessage.getUnmq().getExchange(data.fromName);
  if (fromExchange === undefined) return;
  //判断真实的origin 是否是我想要的 origin
  if (fromExchange.origin !== "*" && fromExchange.origin !== origin) return;
  const message: FindExchangeCoordinate = data.message;
  const queueName = getInternalIframeMessageQueueName(data.message.exchangeName);
  if (!iframeMessage.getUnmq().getQueue(queueName)) return; //throw `${data.message.exchangeName} 未注册`;
  iframeMessage.getUnmq().on(queueName, (content) => {
    singleMessage(MessageType.GeneralMessage, source, content, fromExchange.origin);
  })();
}

/**
 * 监听message事件触发
 */
window.addEventListener("message", receiveMessage, false);
function receiveMessage({ source, data, origin }) {
  const iframeMessage = IframeMessage.getInstance();
  if (typeof data === "object") {
    if (data.mask === "u-node-mq-plugin") {
      //应用发送的origin 和 真实的origin 不一致
      if (data.fromOrigin !== origin) return;
      if (data.type === MessageType.FindExchangeMessage) {
        //查找交换机消息
        findExchangeMessage(source, data, origin);
      } else if (data.type === MessageType.GeneralMessage) {
        //普通消息
        generalMessage(source, data, origin);
      } else if (data.type === MessageType.SendCoordinateMessage) {
        // 接受的位置信息消息
        sendCoordinateMessage(source, data, origin);
      } else if (data.type === MessageType.OnlineNotificationMessage) {
        //上线通知消息
        onlineNotificationMessage(source, data, origin);
      }
    }
  }
}
/**
 * 广播获取坐标信息
 * @param exchangeName
 */
export function broadcastGetCoordinateMessage(exchangeName: string) {
  const random = Math.round(Math.random() * 10000); //获取一个随机数用来标识是哪次请求
  const findExchangeCoordinate: FindExchangeCoordinate = {
    exchangeName,
    random,
    msg: `谁是${exchangeName}？`,
  };
  broadcastMessage(MessageType.FindExchangeMessage, findExchangeCoordinate);

  return new Promise<Coordinate>((resolve, reject) => {
    const iframeMessage = IframeMessage.getInstance();
    const unmq = iframeMessage.getUnmq();

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

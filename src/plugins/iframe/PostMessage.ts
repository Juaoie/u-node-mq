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

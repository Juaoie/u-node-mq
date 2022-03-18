import UNodeMQ, { Exchange, Queue, News } from "../../index.js";
import { ReturnPanShapeExchange, ReturnPanShapeQueue } from "../../core/UNodeMQ.js";
import { broadcastMessage, MessageType, singleMessage } from "./PostMessage.js";
import RouteTable, { Coordinate } from "./coordinate/index.js";
import Centralization from "./coordinate/mode/Centralization.js";
import Decentralization from "./coordinate/mode/Decentralization.js";
import { ConsumMode } from "../../internal/Queue.js";
import { Consume, Next } from "../../internal/Consumer.js";
import { ExchangeCollectionType, OtherIframe, QueueCollectionType, RouteMode, SelfIframe, SelfQueue } from "./index.js";

export interface MessageCoordinate extends Coordinate {
  random: string | number;
}
/**
 * 使用postMessage api 进行通信
 *
 */
export default class IframeMessageHandle {
  private static iframeMessage: IframeMessageHandle = null;
  private name: string;
  getName() {
    return this.name;
  }
  private unmq: UNodeMQ<any, any>;
  getUnmq() {
    return this.unmq;
  }
  //接受来着外界的坐标信息 坐标信息，所有人都消费
  private acceptCoordinate = new SelfQueue<MessageCoordinate>({ mode: ConsumMode.All });
  getAcceptCoordinate() {
    return this.acceptCoordinate;
  }
  //路由表
  private routeTable: RouteTable;
  getRouteTable() {
    return this.routeTable;
  }

  static createIframe<E extends ExchangeCollectionType, Q extends QueueCollectionType>(
    name: string,
    selfIframe: SelfIframe<unknown>,
    otherIframe: E,
    selfQueue: Q,
    routeMode: RouteMode = "Decentralization"
  ) {
    if (this.iframeMessage === null) {
      this.iframeMessage = new IframeMessageHandle(name, selfIframe, otherIframe, selfQueue, routeMode);
      //广播发送上线通知
      broadcastMessage(MessageType.OnlineNotificationMessage, { exchangeName: name, msg: `${this.name}上线了` });
    }
    return IframeMessageHandle.iframeMessage;
  }
  static getInstance() {
    return IframeMessageHandle.iframeMessage;
  }
  private constructor(
    name: string,
    selfIframe: SelfIframe<unknown>,
    otherIframe: any,
    selfQueue: any,
    routeMode: RouteMode = "Decentralization"
  ) {
    this.name = name;
    //为每个交换机添加默认队列
    const queueCollection: Record<string, Queue<unknown>> = {};
    for (const name in otherIframe) {
      const queueName = name + "_SendMessage";
      queueCollection[queueName] = new Queue();
      otherIframe[name].setRoutes([queueName]);
    }
    this.unmq = new UNodeMQ(
      Object.assign(otherIframe, {
        [name]: selfIframe,
      }),
      Object.assign(selfQueue, queueCollection)
    );
    //注册路由表
    if (routeMode === "Decentralization") {
      this.routeTable = new Decentralization();
    } else if (routeMode === "Centralization") {
      this.routeTable = new Centralization();
    }
  }
  /**
   * 发送消息给其他应用
   * @param exchangeName
   * @param contentList
   */
  emit(exchangeName: any, ...contentList: any[]) {
    if (exchangeName === this.name) {
      this.unmq.emit(exchangeName, ...contentList);
      return this;
    }
    //广播获取路由地址
    this.routeTable
      .getCoordinate(exchangeName as string)
      .then((coordinate: Coordinate) => {
        //获取到路由地址以后，
        for (const content of contentList) {
          singleMessage(MessageType.GeneralMessage, coordinate.currentWindow, content);
        }
      })
      .catch(() => {
        //接受者还没挂载到dom上，
        //先移除所有队列上的所有消费者
        this.unmq.getQueue(exchangeName + "_SendMessage").removeAllConsumer();
        //再将消息存到指定队列里面
        for (const content of contentList) {
          this.unmq.emit(exchangeName, content);
        }
      });
    return this;
  }

  /**
   *  订阅队列消息
   * 队列名称为null 则订阅所有队列
   * 消费方法
   * @param queueName 队列名称
   * @param consume 消费方法
   * @param payload 固定参数，有效载荷，在每次消费的时候都传给消费者
   * @returns
   */
  on(queueName: any, consume: any, payload?: any) {
    this.unmq.on(queueName, consume, payload);
    return () => this.off(queueName, consume);
  }

  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off(queueName: any, consume: any): this;
  off(queueName: any): this;
  off(x: any, y?: any): this {
    this.unmq.off(x, y);
    return this;
  }

  /**
   * 一次性订阅消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once(queueName: any, consume: any, payload?: any) {
    this.once(queueName, consume, payload);
    return this;
  }
}

import { Exchange, Queue } from "../../index.js";
import { Consume } from "../../internal/Consumer.js";
import { Option } from "../../internal/Exchange.js";
import IframeMessageHandle from "./Iframe.js";

abstract class Iframe<D> extends Exchange<D> {}

export class SelfIframe<D> extends Iframe<D> {
  constructor(option?: Option<D>) {
    super(option);
  }
}

type OtherIframeOption = {
  name?: string;
  origin?: string;
};
export class OtherIframe<D> extends Iframe<D> {
  origin: string = "*";
  constructor(option?: OtherIframeOption) {
    super({ name: option?.name });
    if (option?.origin) this.origin = option.origin;
  }
}
export class SelfQueue<D> extends Queue<D> {}
export type RouteMode = "Centralization" | "Decentralization";

export type ReturnPanShapeExchange<T> = T extends OtherIframe<infer U> ? U : never;
export type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;

export type ExchangeCollectionType = Record<string, OtherIframe<any>>;
export type QueueCollectionType = Record<string, SelfQueue<any>>;
export default class IframeMessage<
  ExchangeCollection extends ExchangeCollectionType,
  QueueCollection extends QueueCollectionType
> {
  iframeMessageHandle: IframeMessageHandle = null;
  constructor(
    name: string,
    selfIframe: SelfIframe<any>,
    otherIframe: ExchangeCollection,
    selfQueue: QueueCollection,
    routeMode: RouteMode = "Decentralization"
  ) {
    this.iframeMessageHandle = IframeMessageHandle.createIframe(name, selfIframe, otherIframe, selfQueue, routeMode);
  }
  /**
   * 发送消息给其他应用
   * @param exchangeName
   * @param contentList
   */
  emit<E extends keyof ExchangeCollection>(
    exchangeName: E,
    ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]
  ) {
    this.iframeMessageHandle.emit(exchangeName, ...contentList);
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
  on<Q extends keyof QueueCollection>(
    queueName: Q,
    consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>,
    payload?: any
  ) {
    this.iframeMessageHandle.on(queueName, consume, payload);
    return () => this.off(queueName, consume);
  }

  /**
   * 移除消费者
   * @param queueName
   * @param consume
   */
  off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
  off<Q extends keyof QueueCollection>(queueName: Q): this;
  off<Q extends keyof QueueCollection>(x: Q, y?: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this {
    this.iframeMessageHandle.off(x, y);
    return this;
  }

  /**
   * 一次性订阅消息
   * @param queueName
   * @param consume
   * @param payload
   * @returns
   */
  once<Q extends keyof QueueCollection>(
    queueName: Q,
    consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>,
    payload?: any
  ) {
    this.iframeMessageHandle.once(queueName, consume, payload);
    return this;
  }
}
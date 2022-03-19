import { ReturnPanShapeExchange, ReturnPanShapeQueue } from "@/core/UNodeMQ.js";
import { Exchange, Queue } from "../../index";
import { Consume } from "@/internal/Consumer.js";
import { Option } from "@/internal/Exchange.js";
import IframeMessageHandle from "./Iframe.js";
declare class Iframe<D> extends Exchange<D> {
}
export declare class SelfIframe<D> extends Iframe<D> {
    constructor(option?: Option<D>);
}
export declare class OtherIframe<D> extends Iframe<D> {
    constructor(name?: string);
}
export declare class SelfQueue<D> extends Queue<D> {
}
export declare type RouteMode = "Centralization" | "Decentralization";
export declare type ExchangeCollectionType = Record<string, OtherIframe<unknown>>;
export declare type QueueCollectionType = Record<string, SelfQueue<unknown>>;
export default class IframeMessage<ExchangeCollection extends ExchangeCollectionType, QueueCollection extends QueueCollectionType> {
    iframeMessageHandle: IframeMessageHandle;
    constructor(name: string, selfIframe: SelfIframe<unknown>, otherIframe: ExchangeCollection, selfQueue: QueueCollection, routeMode?: RouteMode);
    emit<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]): this;
    on<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): () => this;
    off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
    off<Q extends keyof QueueCollection>(queueName: Q): this;
    once<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): this;
}
export {};

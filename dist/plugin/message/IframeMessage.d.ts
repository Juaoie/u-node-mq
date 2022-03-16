import UNodeMQ, { Exchange, Queue, News } from "../../index.js";
import { ReturnPanShapeExchange, ReturnPanShapeQueue } from "../../core/UNodeMQ.js";
import RouteTable, { Coordinate } from "./coordinate/index.js";
import { Consume } from "../../internal/Consumer.js";
declare class Iframe<D> extends Exchange<D> {
}
export declare class SelfIframe<D> extends Iframe<D> {
}
export declare class OtherIframe<D> extends Iframe<D> {
    constructor(name?: string);
}
export declare class SelfQueue<D> extends Queue<D> {
}
export declare class NewsExpand<D, ExchangeName> extends News<D> {
    constructor(content: D);
}
declare type RouteMode = "Centralization" | "Decentralization";
declare type ExchangeCollectionType = Record<string, OtherIframe<unknown>>;
declare type QueueCollectionType = Record<string, SelfQueue<unknown>>;
export interface MessageCoordinate extends Coordinate {
    random: string | number;
}
export default class IframeMessage<ExchangeCollection extends ExchangeCollectionType, QueueCollection extends QueueCollectionType> {
    private static iframeMessage;
    private name;
    getName(): string;
    private unmq;
    getUnmq(): UNodeMQ<ExchangeCollection, QueueCollection>;
    private acceptMessage;
    private acceptCoordinate;
    getAcceptCoordinate(): SelfQueue<MessageCoordinate>;
    private routeTable;
    getRouteTable(): RouteTable;
    static createIframe<E extends ExchangeCollectionType, Q extends QueueCollectionType>(name: string, selfIframe: SelfIframe<unknown>, otherIframe: E, selfQueue: Q, routeMode?: RouteMode): IframeMessage<ExchangeCollectionType, QueueCollectionType>;
    static getInstance(): IframeMessage<ExchangeCollectionType, QueueCollectionType>;
    constructor(name: string, selfIframe: SelfIframe<unknown>, otherIframe: ExchangeCollection, selfQueue: QueueCollection, routeMode?: RouteMode);
    emit<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]): this;
    on<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): () => this;
    off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
    off<Q extends keyof QueueCollection>(queueName: Q): this;
    once<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): this;
}
export {};

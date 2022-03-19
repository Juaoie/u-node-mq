import UNodeMQ from "../../index.js";
import RouteTable, { Coordinate } from "./coordinate/index.js";
import { ExchangeCollectionType, QueueCollectionType, RouteMode, SelfIframe } from "./index.js";
export interface MessageCoordinate extends Coordinate {
    random: string | number;
}
export declare function getInternalIframeMessageQueueName(queueName: string): string;
export declare function getInternalIframeCoordinateQueueName(queueName: string): string;
export default class IframeMessageHandle {
    private static iframeMessage;
    private name;
    getName(): string;
    private unmq;
    getUnmq(): UNodeMQ<any, any>;
    private routeTable;
    getRouteTable(): RouteTable;
    static createIframe<E extends ExchangeCollectionType, Q extends QueueCollectionType>(name: string, selfIframe: SelfIframe<unknown>, otherIframe: E, selfQueue: Q, routeMode?: RouteMode): IframeMessageHandle;
    static getInstance(): IframeMessageHandle;
    private constructor();
    emit(exchangeName: any, ...contentList: any[]): this;
    on(queueName: any, consume: any, payload?: any): () => this;
    off(queueName: any, consume: any): this;
    off(queueName: any): this;
    once(queueName: any, consume: any, payload?: any): this;
}

import { Exchange, Queue } from "../index.js";
import { Consume } from "../internal/Consumer.js";
import Collection from "./Collection.js";
export declare type ReturnPanShapeExchange<T> = T extends Exchange<infer U> ? U : never;
export declare type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;
export declare type UnionAttribute<T> = keyof T;
export declare function createUnmq<ExchangeCollection extends Record<string, Exchange<any>>, QueueCollection extends Record<string, Queue<any>>>(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection): UNodeMQ<ExchangeCollection, QueueCollection>;
export default class UNodeMQ<ExchangeCollection extends Record<string, Exchange<any>>, QueueCollection extends Record<string, Queue<any>>> extends Collection<ExchangeCollection, QueueCollection> {
    constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection);
    emit<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]): this;
    emitToQueue<Q extends keyof QueueCollection>(queueName: Q, ...contentList: ReturnPanShapeQueue<QueueCollection[Q]>[]): this;
    on<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): () => this;
    off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
    off<Q extends keyof QueueCollection>(queueName: Q): this;
    once<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): this;
}

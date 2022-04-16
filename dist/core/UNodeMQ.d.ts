import { Exchange, Queue } from "../index";
import { Consume } from "../internal/Consumer";
import Collection from "./Collection";
export declare type ReturnPanShapeExchange<T> = T extends Exchange<infer U> ? U : never;
export declare type ReturnPanShapeQueue<T> = T extends Queue<infer U> ? U : never;
declare type PluginInstallFunction = (unmq: UNodeMQ<any, any>, ...options: any[]) => any;
export declare type Plugin = (PluginInstallFunction & {
    install?: PluginInstallFunction;
}) | {
    install: PluginInstallFunction;
};
export declare function createUnmq<ExchangeCollection extends Record<string, Exchange<any>>, QueueCollection extends Record<string, Queue<any>>>(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection): UNodeMQ<ExchangeCollection, QueueCollection>;
export default class UNodeMQ<ExchangeCollection extends Record<string, Exchange<any>>, QueueCollection extends Record<string, Queue<any>>> extends Collection<ExchangeCollection, QueueCollection> {
    constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection);
    private readonly installedPlugins;
    use(plugin: Plugin, ...options: any[]): this;
    emit<E extends keyof ExchangeCollection & string>(exchangeName: E, ...contentList: ReturnPanShapeExchange<ExchangeCollection[E]>[]): this;
    emitToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: ReturnPanShapeQueue<QueueCollection[Q]>[]): this;
    on<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): () => this;
    off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>): this;
    off<Q extends keyof QueueCollection>(queueName: Q): this;
    once<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<ReturnPanShapeQueue<QueueCollection[Q]>>, payload?: any): this;
}
export declare function createQuickUnmq<D, QueueCollection extends Record<string, Queue<D>>>(exchange: Exchange<D>, queueCollection: QueueCollection): QuickUNodeMQ<D, QueueCollection>;
export declare class QuickUNodeMQ<D, QueueCollection extends Record<string, Queue<D>>> {
    private readonly exchange;
    private readonly queueCollection;
    constructor(exchange: Exchange<D>, queueCollection: QueueCollection);
    emit(...contentList: D[]): this;
    emitToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: D[]): this;
    on<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<D>, payload?: any): () => this;
    off<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<D>): this;
    off<Q extends keyof QueueCollection>(queueName: Q): this;
    once<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<D>, payload?: any): this;
}
export {};

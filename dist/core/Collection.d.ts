import { Exchange, Queue, News } from "../index.js";
import { Consume } from "../internal/Consumer.js";
export default class Collection<ExchangeCollection extends Record<string, Exchange<unknown>>, QueueCollection extends Record<string, Queue<unknown>>> {
    private readonly exchangeCollectionHandle;
    private readonly queueCollectionHandle;
    constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection);
    getExchange<E extends keyof ExchangeCollection>(exchangeName: E): ExchangeCollection[E];
    getQueue<Q extends keyof QueueCollection>(queueName: Q): QueueCollection[Q];
    pushNewsListToExchange<E extends keyof ExchangeCollection>(exchangeName: E, ...news: News<unknown>[]): void;
    pushNewsListToQueue<Q extends keyof QueueCollection>(queueName: Q, ...news: News<unknown>[]): void;
    pushContentListToExchange<E extends keyof ExchangeCollection>(exchangeName: E, ...contentList: unknown[]): void;
    pushContentListToQueue<Q extends keyof QueueCollection>(queueName: Q, ...contentList: unknown[]): void;
    subscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<unknown>, payload?: any): void;
    unsubscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume?: Consume<unknown>): void;
}

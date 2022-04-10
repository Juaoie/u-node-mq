import { Exchange, Queue, News } from "../index.js";
import { Consume } from "../internal/Consumer.js";
export default class Collection<ExchangeCollection extends Record<string, Exchange<unknown>>, QueueCollection extends Record<string, Queue<unknown>>> {
    private readonly exchangeCollectionHandle;
    private readonly queueCollectionHandle;
    constructor(exchangeCollection: ExchangeCollection, queueCollection: QueueCollection);
    getExchange<E extends keyof ExchangeCollection & string>(exchangeName: E): Exchange<any>;
    getExchangeList(): Exchange<any>[];
    getQueue<Q extends keyof QueueCollection & string>(queueName: Q): Queue<any>;
    getQueueList(): Queue<any>[];
    addQueue(queue: Queue<unknown>): void;
    pushNewsListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...news: News<unknown>[]): void;
    pushNewsListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...news: News<unknown>[]): void;
    pushContentListToExchange<E extends keyof ExchangeCollection & string>(exchangeName: E, ...contentList: unknown[]): void;
    pushContentListToQueue<Q extends keyof QueueCollection & string>(queueName: Q, ...contentList: unknown[]): void;
    subscribeQueue<Q extends keyof QueueCollection & string>(queueName: Q, consume: Consume<unknown>, payload?: any): void;
    unsubscribeQueue<Q extends keyof QueueCollection & string>(queueName: Q, consume?: Consume<unknown>): void;
}

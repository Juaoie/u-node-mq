import { Queue, News } from "../index.js";
import { Consume } from "../internal/Consumer.js";
export default class QueueCollectionHandle<QueueCollection extends Record<string, Queue<unknown>>> {
    private queueCollection;
    setQueueCollection(queueCollection: QueueCollection): void;
    getQueue<Q extends keyof QueueCollection>(queueName: Q): QueueCollection[Q];
    pushNewsToQueue<Q extends keyof QueueCollection>(queueName: Q, news: News<unknown>): boolean;
    pushContentToQueue<Q extends keyof QueueCollection>(queueName: Q, content: unknown): boolean;
    subscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume: Consume<unknown>, payload?: any): boolean;
    unsubscribeQueue<Q extends keyof QueueCollection>(queueName: Q, consume?: Consume<unknown>): boolean;
}

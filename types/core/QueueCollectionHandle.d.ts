import { Queue, News } from "../index.js";
import { Consume } from "../internal/Consumer.js";
export default class QueueCollectionHandle {
    private queueCollection;
    has(queueName: string): boolean;
    setQueueCollection(queueCollection: Record<string, Queue<unknown>>): void;
    getQueue(queueName: string): Queue<any>;
    getQueueList(): Queue<any>[];
    addQueue(queue: Queue<unknown>): void;
    pushNewsToQueue(queueName: string, news: News<unknown>): void;
    pushContentToQueue(queueName: string, content: unknown): void;
    subscribeQueue(queueName: string, consume: Consume<unknown>, payload?: any): void;
    unsubscribeQueue(queueName: string, consume?: Consume<unknown>): boolean;
}

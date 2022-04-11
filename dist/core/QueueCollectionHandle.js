import { Logs } from "../index.js";
export default class QueueCollectionHandle {
    has(queueName) {
        if (this.queueCollection.has(queueName))
            return true;
        else {
            Logs.error(`${queueName} not find`);
            return false;
        }
    }
    setQueueCollection(queueCollection) {
        this.queueCollection = new Map(Object.entries(queueCollection));
    }
    getQueue(queueName) {
        if (!this.has(queueName))
            return;
        return this.queueCollection.get(queueName);
    }
    getQueueList() {
        return [...this.queueCollection.values()];
    }
    addQueue(queue) {
        this.queueCollection.set(queue.name, queue);
    }
    pushNewsToQueue(queueName, news) {
        if (!this.has(queueName))
            return;
        this.queueCollection.get(queueName).pushNews(news);
    }
    pushContentToQueue(queueName, content) {
        if (!this.has(queueName))
            return;
        this.queueCollection.get(queueName).pushContent(content);
    }
    subscribeQueue(queueName, consume, payload) {
        if (!this.has(queueName))
            return;
        this.queueCollection.get(queueName).pushConsume(consume, payload);
    }
    unsubscribeQueue(queueName, consume) {
        if (!this.has(queueName))
            return;
        if (consume === undefined) {
            return this.queueCollection.get(queueName).removeAllConsumer();
        }
        else {
            return this.queueCollection.get(queueName).removeConsumer(consume);
        }
    }
}

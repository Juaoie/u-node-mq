import { Logs, isFunction } from "../index";
export default class QueueCollectionHandle {
    constructor() {
        this.queueCollection = new Map();
    }
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
        const queue = this.queueCollection.get(queueName);
        if (queue === undefined) {
            Logs.error(`${queueName} not find`);
            return null;
        }
        return queue;
    }
    getQueueList() {
        return [...this.queueCollection.values()];
    }
    addQueue(queue) {
        if (queue.name === undefined)
            throw "queue.name is undefined";
        this.queueCollection.set(queue.name, queue);
    }
    pushNewsToQueue(queueName, news) {
        var _a;
        (_a = this.getQueue(queueName)) === null || _a === void 0 ? void 0 : _a.pushNews(news);
    }
    pushContentToQueue(queueName, content) {
        var _a;
        (_a = this.getQueue(queueName)) === null || _a === void 0 ? void 0 : _a.pushContent(content);
    }
    subscribeQueue(queueName, consume, payload) {
        var _a;
        (_a = this.getQueue(queueName)) === null || _a === void 0 ? void 0 : _a.pushConsume(consume, payload);
    }
    unsubscribeQueue(queueName, consume) {
        var _a, _b;
        if (!this.has(queueName))
            return false;
        if (isFunction(consume)) {
            return !!((_a = this.getQueue(queueName)) === null || _a === void 0 ? void 0 : _a.removeConsumer(consume));
        }
        else {
            return !!((_b = this.getQueue(queueName)) === null || _b === void 0 ? void 0 : _b.removeAllConsumer());
        }
    }
}

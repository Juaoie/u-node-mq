var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { Logs } from "../index.js";
var QueueCollectionHandle = (function () {
    function QueueCollectionHandle() {
    }
    QueueCollectionHandle.prototype.has = function (queueName) {
        if (this.queueCollection.has(queueName))
            return true;
        else {
            Logs.error(queueName + " not find");
            return false;
        }
    };
    QueueCollectionHandle.prototype.setQueueCollection = function (queueCollection) {
        this.queueCollection = new Map(Object.entries(queueCollection));
    };
    QueueCollectionHandle.prototype.getQueue = function (queueName) {
        if (!this.has(queueName))
            return;
        return this.queueCollection.get(queueName);
    };
    QueueCollectionHandle.prototype.getQueueList = function () {
        return __spreadArray([], __read(this.queueCollection.values()), false);
    };
    QueueCollectionHandle.prototype.addQueue = function (queue) {
        this.queueCollection.set(queue.name, queue);
    };
    QueueCollectionHandle.prototype.pushNewsToQueue = function (queueName, news) {
        if (!this.has(queueName))
            return;
        this.queueCollection.get(queueName).pushNews(news);
    };
    QueueCollectionHandle.prototype.pushContentToQueue = function (queueName, content) {
        if (!this.has(queueName))
            return;
        this.queueCollection.get(queueName).pushContent(content);
    };
    QueueCollectionHandle.prototype.subscribeQueue = function (queueName, consume, payload) {
        if (!this.has(queueName))
            return;
        this.queueCollection.get(queueName).pushConsume(consume, payload);
    };
    QueueCollectionHandle.prototype.unsubscribeQueue = function (queueName, consume) {
        if (!this.has(queueName))
            return;
        if (consume === undefined) {
            return this.queueCollection.get(queueName).removeAllConsumer();
        }
        else {
            return this.queueCollection.get(queueName).removeConsumer(consume);
        }
    };
    return QueueCollectionHandle;
}());
export default QueueCollectionHandle;

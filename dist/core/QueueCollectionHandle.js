import { Logs } from "../index.js";
var QueueCollectionHandle = (function () {
    function QueueCollectionHandle() {
    }
    QueueCollectionHandle.prototype.setQueueCollection = function (queueCollection) {
        this.queueCollection = queueCollection;
    };
    QueueCollectionHandle.prototype.getQueue = function (queueName) {
        return this.queueCollection[queueName];
    };
    QueueCollectionHandle.prototype.pushNewsToQueue = function (queueName, news) {
        if (this.queueCollection[queueName] === undefined) {
            Logs.error("".concat(queueName, " not find"));
            return false;
        }
        this.queueCollection[queueName].pushNews(news);
        return true;
    };
    QueueCollectionHandle.prototype.pushContentToQueue = function (queueName, content) {
        if (this.queueCollection[queueName] === undefined) {
            Logs.error("".concat(queueName, " not find"));
            return false;
        }
        this.queueCollection[queueName].pushContent(content);
        return true;
    };
    QueueCollectionHandle.prototype.subscribeQueue = function (queueName, consume, payload) {
        if (this.queueCollection[queueName] === undefined) {
            Logs.error("".concat(queueName, " not find"));
            return false;
        }
        this.queueCollection[queueName].pushConsume(consume, payload);
        return true;
    };
    QueueCollectionHandle.prototype.unsubscribeQueue = function (queueName, consume) {
        if (this.queueCollection[queueName] === undefined) {
            Logs.error("".concat(queueName, " not find"));
            return false;
        }
        if (consume === undefined) {
            return this.queueCollection[queueName].removeAllConsumer();
        }
        else {
            return this.queueCollection[queueName].removeConsumer(consume);
        }
    };
    return QueueCollectionHandle;
}());
export default QueueCollectionHandle;

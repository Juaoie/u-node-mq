import ExchangeCollectionHandle from "./ExchangeCollectionHandle.js";
import QueueCollectionHandle from "./QueueCollectionHandle.js";
var Collection = (function () {
    function Collection(exchangeCollection, queueCollection) {
        this.exchangeCollectionHandle = new ExchangeCollectionHandle();
        this.queueCollectionHandle = new QueueCollectionHandle();
        this.exchangeCollectionHandle.setExchangeCollection(exchangeCollection);
        this.queueCollectionHandle.setQueueCollection(queueCollection);
    }
    Collection.prototype.getExchange = function (exchangeName) {
        return this.exchangeCollectionHandle.getExchange(exchangeName);
    };
    Collection.prototype.getQueue = function (queueName) {
        return this.queueCollectionHandle.getQueue(queueName);
    };
    Collection.prototype.pushNewsListToExchange = function (exchangeName) {
        var _this = this;
        var news = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            news[_i - 1] = arguments[_i];
        }
        var _loop_1 = function (newsItem) {
            this_1.exchangeCollectionHandle.getQueueNameList(exchangeName, newsItem.content).then(function (queueNameList) {
                for (var queueName in queueNameList) {
                    _this.pushNewsListToQueue(queueName, newsItem);
                }
            });
        };
        var this_1 = this;
        for (var _a = 0, news_1 = news; _a < news_1.length; _a++) {
            var newsItem = news_1[_a];
            _loop_1(newsItem);
        }
    };
    Collection.prototype.pushNewsListToQueue = function (queueName) {
        var news = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            news[_i - 1] = arguments[_i];
        }
        for (var _a = 0, news_2 = news; _a < news_2.length; _a++) {
            var newsItem = news_2[_a];
            this.queueCollectionHandle.pushNewsToQueue(queueName, newsItem);
        }
    };
    Collection.prototype.pushContentListToExchange = function (exchangeName) {
        var _this = this;
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        var _loop_2 = function (content) {
            this_2.exchangeCollectionHandle.getQueueNameList(exchangeName, content).then(function (queueNameList) {
                for (var _i = 0, queueNameList_1 = queueNameList; _i < queueNameList_1.length; _i++) {
                    var queueName = queueNameList_1[_i];
                    _this.pushContentListToQueue(queueName, content);
                }
            });
        };
        var this_2 = this;
        for (var _a = 0, contentList_1 = contentList; _a < contentList_1.length; _a++) {
            var content = contentList_1[_a];
            _loop_2(content);
        }
    };
    Collection.prototype.pushContentListToQueue = function (queueName) {
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        for (var _a = 0, contentList_2 = contentList; _a < contentList_2.length; _a++) {
            var content = contentList_2[_a];
            this.queueCollectionHandle.pushContentToQueue(queueName, content);
        }
    };
    Collection.prototype.subscribeQueue = function (queueName, consume, payload) {
        this.queueCollectionHandle.subscribeQueue(queueName, consume, payload);
    };
    Collection.prototype.unsubscribeQueue = function (queueName, consume) {
        this.queueCollectionHandle.unsubscribeQueue(queueName, consume);
    };
    return Collection;
}());
export default Collection;

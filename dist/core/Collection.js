var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import ExchangeCollectionHandle from "./ExchangeCollectionHandle.js";
import QueueCollectionHandle from "./QueueCollectionHandle.js";
var Collection = (function () {
    function Collection(exchangeCollection, queueCollection) {
        this.exchangeCollectionHandle = new ExchangeCollectionHandle();
        this.queueCollectionHandle = new QueueCollectionHandle();
        for (var name_1 in exchangeCollection) {
            exchangeCollection[name_1].name = name_1;
        }
        for (var name_2 in queueCollection) {
            queueCollection[name_2].name = name_2;
        }
        this.exchangeCollectionHandle.setExchangeCollection(exchangeCollection);
        this.queueCollectionHandle.setQueueCollection(queueCollection);
    }
    Collection.prototype.getExchange = function (exchangeName) {
        return this.exchangeCollectionHandle.getExchange(exchangeName);
    };
    Collection.prototype.getExchangeList = function () {
        return this.exchangeCollectionHandle.getExchangeList();
    };
    Collection.prototype.getQueue = function (queueName) {
        return this.queueCollectionHandle.getQueue(queueName);
    };
    Collection.prototype.getQueueList = function () {
        return this.queueCollectionHandle.getQueueList();
    };
    Collection.prototype.addQueue = function (queue) {
        this.queueCollectionHandle.addQueue(queue);
    };
    Collection.prototype.pushNewsListToExchange = function (exchangeName) {
        var e_1, _a;
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
        try {
            for (var news_1 = __values(news), news_1_1 = news_1.next(); !news_1_1.done; news_1_1 = news_1.next()) {
                var newsItem = news_1_1.value;
                _loop_1(newsItem);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (news_1_1 && !news_1_1.done && (_a = news_1.return)) _a.call(news_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Collection.prototype.pushNewsListToQueue = function (queueName) {
        var e_2, _a;
        var news = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            news[_i - 1] = arguments[_i];
        }
        try {
            for (var news_2 = __values(news), news_2_1 = news_2.next(); !news_2_1.done; news_2_1 = news_2.next()) {
                var newsItem = news_2_1.value;
                this.queueCollectionHandle.pushNewsToQueue(queueName, newsItem);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (news_2_1 && !news_2_1.done && (_a = news_2.return)) _a.call(news_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Collection.prototype.pushContentListToExchange = function (exchangeName) {
        var e_3, _a;
        var _this = this;
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        var _loop_2 = function (content) {
            this_2.exchangeCollectionHandle.getQueueNameList(exchangeName, content).then(function (queueNameList) {
                var e_4, _a;
                try {
                    for (var queueNameList_1 = (e_4 = void 0, __values(queueNameList)), queueNameList_1_1 = queueNameList_1.next(); !queueNameList_1_1.done; queueNameList_1_1 = queueNameList_1.next()) {
                        var queueName = queueNameList_1_1.value;
                        _this.pushContentListToQueue(queueName, content);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (queueNameList_1_1 && !queueNameList_1_1.done && (_a = queueNameList_1.return)) _a.call(queueNameList_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            });
        };
        var this_2 = this;
        try {
            for (var contentList_1 = __values(contentList), contentList_1_1 = contentList_1.next(); !contentList_1_1.done; contentList_1_1 = contentList_1.next()) {
                var content = contentList_1_1.value;
                _loop_2(content);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (contentList_1_1 && !contentList_1_1.done && (_a = contentList_1.return)) _a.call(contentList_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    Collection.prototype.pushContentListToQueue = function (queueName) {
        var e_5, _a;
        var contentList = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            contentList[_i - 1] = arguments[_i];
        }
        try {
            for (var contentList_2 = __values(contentList), contentList_2_1 = contentList_2.next(); !contentList_2_1.done; contentList_2_1 = contentList_2.next()) {
                var content = contentList_2_1.value;
                this.queueCollectionHandle.pushContentToQueue(queueName, content);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (contentList_2_1 && !contentList_2_1.done && (_a = contentList_2.return)) _a.call(contentList_2);
            }
            finally { if (e_5) throw e_5.error; }
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

import News from "./News.js";
import Consumer from "./Consumer.js";
import Logs from "./Logs.js";
import Tools from "../utils/tools.js";
export var ConsumMode;
(function (ConsumMode) {
    ConsumMode["Random"] = "Random";
    ConsumMode["All"] = "All";
})(ConsumMode || (ConsumMode = {}));
var Queue = (function () {
    function Queue(option) {
        this.id = Tools.random();
        this.ask = false;
        this.rcn = 3;
        this.mode = ConsumMode.Random;
        this.news = [];
        this.consumerList = [];
        if ((option === null || option === void 0 ? void 0 : option.ask) !== undefined)
            this.ask = option.ask;
        if ((option === null || option === void 0 ? void 0 : option.news) !== undefined)
            this.news = option.news;
        if ((option === null || option === void 0 ? void 0 : option.consumerList) !== undefined)
            this.consumerList = option.consumerList;
        if ((option === null || option === void 0 ? void 0 : option.rcn) !== undefined)
            this.rcn = option.rcn;
        if ((option === null || option === void 0 ? void 0 : option.mode) !== undefined)
            this.mode = option.mode;
        if ((option === null || option === void 0 ? void 0 : option.name) !== undefined)
            this.name = option.name;
    }
    Queue.prototype.getId = function () {
        return this.id;
    };
    Queue.prototype.getNews = function () {
        return this.news;
    };
    Queue.prototype.getConsumerList = function () {
        return this.consumerList;
    };
    Queue.prototype.removeConsumer = function (consume) {
        var index = this.consumerList.findIndex(function (item) { return item.consume === consume; });
        if (index === -1)
            return false;
        this.consumerList.splice(index, 1);
        return true;
    };
    Queue.prototype.removeAllConsumer = function () {
        this.consumerList = [];
        return true;
    };
    Queue.prototype.removeAllNews = function () {
        this.news = [];
        return true;
    };
    Queue.prototype.removeConsumerById = function (consumerId) {
        var index = this.consumerList.findIndex(function (item) { return item.getId() === consumerId; });
        if (index === -1)
            return false;
        this.consumerList.splice(index, 1);
        return true;
    };
    Queue.prototype.pushConsumer = function (consumer) {
        if (this.consumerList.findIndex(function (item) { return item.getId() === consumer.getId(); }) === -1)
            this.consumerList.push(consumer);
        if (this.news.length > 0 && this.consumerList.length > 0)
            this.consumeNews();
    };
    Queue.prototype.pushConsume = function (consume, payload) {
        var consumer = new Consumer(consume, payload);
        this.pushConsumer(consumer);
    };
    Queue.prototype.pushNews = function (news) {
        if (news.consumedTimes === -1)
            news.consumedTimes = this.rcn;
        if (news.consumedTimes > 0) {
            if (this.news.findIndex(function (item) { return item.getId() === news.getId(); }) === -1)
                this.news.push(news);
        }
        if (this.news.length > 0 && this.consumerList.length > 0)
            this.consumeNews();
    };
    Queue.prototype.pushContent = function (content) {
        var news = new News(content);
        this.pushNews(news);
    };
    Queue.prototype.eject = function () {
        if (this.news.length > 0)
            return this.news.splice(0, 1)[0];
        else
            null;
    };
    Queue.prototype.consumeNews = function () {
        if (this.news.length === 0)
            return;
        if (this.consumerList.length === 0)
            return;
        var news = this.eject();
        if (news === null)
            return;
        if (this.mode === ConsumMode.Random) {
            var index = Math.round(Math.random() * (this.consumerList.length - 1));
            var consumer = this.consumerList[index];
            this.consumption(news, consumer);
        }
        else if (this.mode === ConsumMode.All) {
            for (var _i = 0, _a = this.consumerList; _i < _a.length; _i++) {
                var consumer = _a[_i];
                this.consumption(news, consumer);
            }
        }
    };
    Queue.prototype.consumption = function (news, consumer) {
        var _this = this;
        consumer.consumption(news, this.ask).then(function (isOk) {
            if (isOk) {
                Logs.log("\u961F\u5217 \u6D88\u8D39\u6210\u529F");
            }
            else {
                Logs.log("\u961F\u5217 \u6D88\u8D39\u5931\u8D25");
                news.consumedTimes--;
                _this.pushNews(news);
            }
            if (_this.news.length > 0)
                _this.consumeNews();
        });
    };
    return Queue;
}());
export default Queue;

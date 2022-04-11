import News from "./News.js";
import Consumer from "./Consumer.js";
import Logs from "./Logs.js";
import Tools from "../utils/tools.js";
export var ConsumMode;
(function (ConsumMode) {
    ConsumMode["Random"] = "Random";
    ConsumMode["All"] = "All";
})(ConsumMode || (ConsumMode = {}));
export default class Queue {
    constructor(option) {
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
    getId() {
        return this.id;
    }
    getNews() {
        return this.news;
    }
    getConsumerList() {
        return this.consumerList;
    }
    removeConsumer(consume) {
        const index = this.consumerList.findIndex((item) => item.consume === consume);
        if (index === -1)
            return false;
        this.consumerList.splice(index, 1);
        return true;
    }
    removeAllConsumer() {
        this.consumerList = [];
        return true;
    }
    removeAllNews() {
        this.news = [];
        return true;
    }
    removeConsumerById(consumerId) {
        const index = this.consumerList.findIndex((item) => item.getId() === consumerId);
        if (index === -1)
            return false;
        this.consumerList.splice(index, 1);
        return true;
    }
    pushConsumer(consumer) {
        if (this.consumerList.findIndex((item) => item.getId() === consumer.getId()) === -1)
            this.consumerList.push(consumer);
        if (this.news.length > 0 && this.consumerList.length > 0)
            this.consumeNews();
    }
    pushConsume(consume, payload) {
        const consumer = new Consumer(consume, payload);
        this.pushConsumer(consumer);
    }
    pushNews(news) {
        if (news.consumedTimes === -1)
            news.consumedTimes = this.rcn;
        if (news.consumedTimes > 0) {
            if (this.news.findIndex((item) => item.getId() === news.getId()) === -1)
                this.news.push(news);
        }
        if (this.news.length > 0 && this.consumerList.length > 0)
            this.consumeNews();
    }
    pushContent(content) {
        const news = new News(content);
        this.pushNews(news);
    }
    eject() {
        if (this.news.length > 0)
            return this.news.splice(0, 1)[0];
        else
            null;
    }
    consumeNews() {
        if (this.news.length === 0)
            return;
        if (this.consumerList.length === 0)
            return;
        const news = this.eject();
        if (news === null)
            return;
        if (this.mode === ConsumMode.Random) {
            const index = Math.round(Math.random() * (this.consumerList.length - 1));
            const consumer = this.consumerList[index];
            this.consumption(news, consumer);
        }
        else if (this.mode === ConsumMode.All) {
            for (const consumer of this.consumerList) {
                this.consumption(news, consumer);
            }
        }
    }
    consumption(news, consumer) {
        consumer.consumption(news, this.ask).then((isOk) => {
            if (isOk) {
                Logs.log(`队列 消费成功`);
            }
            else {
                Logs.log(`队列 消费失败`);
                news.consumedTimes--;
                this.pushNews(news);
            }
            if (this.news.length > 0)
                this.consumeNews();
        });
    }
}

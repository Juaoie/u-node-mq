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
        this.async = false;
        this.state = false;
        this.maxTime = 1000;
        this.news = [];
        this.consumerList = [];
        Object.assign(this, option);
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
            return null;
    }
    consumeNews() {
        if (this.news.length === 0)
            return;
        if (this.consumerList.length === 0)
            return;
        if (!this.async && this.state)
            return;
        const news = this.eject();
        if (news === null)
            return;
        this.state = true;
        const getConsumePromise = () => {
            if (this.mode === ConsumMode.Random) {
                const index = Math.round(Math.random() * (this.consumerList.length - 1));
                const consumer = this.consumerList[index];
                return Promise.all([this.consumption(news, consumer)]);
            }
            return Promise.all(this.consumerList.map((consumer) => this.consumption(news, consumer)));
        };
        getConsumePromise()
            .then(() => {
        })
            .catch(() => {
            news.consumedTimes--;
            this.pushNews(news);
        })
            .finally(() => {
            this.state = false;
            if (this.news.length > 0)
                this.consumeNews();
        });
        if (this.async && this.news.length > 0)
            this.consumeNews();
    }
    consumption(news, consumer) {
        return new Promise((resolve, reject) => {
            const maxTime = this.maxTime;
            const id = maxTime > 0
                ? setTimeout(() => {
                    Logs.log(`队列 消费超时`);
                    reject(false);
                }, maxTime)
                : null;
            consumer.consumption(news, this.ask).then((isOk) => {
                if (isOk) {
                    Logs.log(`队列 消费成功`);
                    resolve(isOk);
                }
                else {
                    Logs.log(`队列 消费失败`);
                    reject(isOk);
                }
                if (maxTime > 0)
                    clearTimeout(id);
            });
        });
    }
}

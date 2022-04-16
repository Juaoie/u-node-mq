import ExchangeCollectionHandle from "./ExchangeCollectionHandle";
import QueueCollectionHandle from "./QueueCollectionHandle";
export default class Collection {
    constructor(exchangeCollection, queueCollection) {
        this.exchangeCollectionHandle = new ExchangeCollectionHandle();
        this.queueCollectionHandle = new QueueCollectionHandle();
        for (const name in exchangeCollection) {
            exchangeCollection[name].name = name;
        }
        for (const name in queueCollection) {
            queueCollection[name].name = name;
        }
        this.exchangeCollectionHandle.setExchangeCollection(exchangeCollection);
        this.queueCollectionHandle.setQueueCollection(queueCollection);
    }
    getExchange(exchangeName) {
        return this.exchangeCollectionHandle.getExchange(exchangeName);
    }
    getExchangeList() {
        return this.exchangeCollectionHandle.getExchangeList();
    }
    getQueue(queueName) {
        return this.queueCollectionHandle.getQueue(queueName);
    }
    getQueueList() {
        return this.queueCollectionHandle.getQueueList();
    }
    addQueue(queue) {
        this.queueCollectionHandle.addQueue(queue);
    }
    pushNewsListToExchange(exchangeName, ...news) {
        for (const newsItem of news) {
            this.exchangeCollectionHandle.getQueueNameList(exchangeName, newsItem.content).then((queueNameList) => {
                for (const queueName in queueNameList) {
                    this.pushNewsListToQueue(queueName, newsItem);
                }
            });
        }
    }
    pushNewsListToQueue(queueName, ...news) {
        for (const newsItem of news) {
            this.queueCollectionHandle.pushNewsToQueue(queueName, newsItem);
        }
    }
    pushContentListToExchange(exchangeName, ...contentList) {
        for (const content of contentList) {
            this.exchangeCollectionHandle.getQueueNameList(exchangeName, content).then((queueNameList) => {
                for (const queueName of queueNameList) {
                    this.pushContentListToQueue(queueName, content);
                }
            });
        }
    }
    pushContentListToQueue(queueName, ...contentList) {
        for (const content of contentList) {
            this.queueCollectionHandle.pushContentToQueue(queueName, content);
        }
    }
    subscribeQueue(queueName, consume, payload) {
        this.queueCollectionHandle.subscribeQueue(queueName, consume, payload);
    }
    unsubscribeQueue(queueName, consume) {
        this.queueCollectionHandle.unsubscribeQueue(queueName, consume);
    }
}

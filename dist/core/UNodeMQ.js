import { isFunction } from "../index.js";
import Collection from "./Collection.js";
export function createUnmq(exchangeCollection, queueCollection) {
    return new UNodeMQ(exchangeCollection, queueCollection);
}
export default class UNodeMQ extends Collection {
    constructor(exchangeCollection, queueCollection) {
        super(exchangeCollection, queueCollection);
        this.installedPlugins = new Set();
    }
    use(plugin, ...options) {
        if (this.installedPlugins.has(plugin)) {
            console.log(`Plugin has already been applied to target unmq.`);
        }
        else if (plugin && isFunction(plugin.install)) {
            this.installedPlugins.add(plugin);
            plugin.install(this, ...options);
        }
        else if (isFunction(plugin)) {
            this.installedPlugins.add(plugin);
            plugin(this, ...options);
        }
        return this;
    }
    emit(exchangeName, ...contentList) {
        super.pushContentListToExchange(exchangeName, ...contentList);
        return this;
    }
    emitToQueue(queueName, ...contentList) {
        super.pushContentListToQueue(queueName, ...contentList);
        return this;
    }
    on(queueName, consume, payload) {
        super.subscribeQueue(queueName, consume, payload);
        return () => this.off(queueName, consume);
    }
    off(x, y) {
        super.unsubscribeQueue(x, y);
        return this;
    }
    once(queueName, consume, payload) {
        if (consume === undefined) {
            return new Promise((reslove) => {
                const consumeProxy = (content) => {
                    this.off(queueName, consumeProxy);
                    reslove(content);
                    return true;
                };
                this.on(queueName, consumeProxy, payload);
            });
        }
        else {
            const consumeProxy = (content, next, payload) => {
                this.off(queueName, consumeProxy);
                return consume(content, next, payload);
            };
            this.on(queueName, consumeProxy, payload);
            return this;
        }
    }
}
export function createQuickUnmq(exchange, queueCollection) {
    return new QuickUNodeMQ(exchange, queueCollection);
}
export class QuickUNodeMQ {
    constructor(exchange, queueCollection) {
        this.exchange = exchange;
        this.queueCollection = queueCollection;
        for (const name in queueCollection) {
            queueCollection[name].name = name;
        }
    }
    emit(...contentList) {
        for (const content of contentList) {
            this.exchange.getQueueNameList(content).then((queueNameList) => {
                for (const queueName of queueNameList) {
                    if (this.queueCollection[queueName] === undefined)
                        continue;
                    this.queueCollection[queueName].pushContent(content);
                }
            });
        }
        return this;
    }
    emitToQueue(queueName, ...contentList) {
        for (const content of contentList) {
            this.queueCollection[queueName].pushContent(content);
        }
        return this;
    }
    on(queueName, consume, payload) {
        this.queueCollection[queueName].pushConsume(consume, payload);
        return () => this.off(queueName, consume);
    }
    off(x, y) {
        if (isFunction(y)) {
            this.queueCollection[x].removeConsumer(y);
        }
        else
            this.queueCollection[x].removeAllConsumer();
        return this;
    }
    once(queueName, consume, payload) {
        if (consume === undefined) {
            return new Promise((reslove) => {
                const consumeProxy = (content) => {
                    this.off(queueName, consumeProxy);
                    reslove(content);
                    return true;
                };
                this.on(queueName, consumeProxy, payload);
            });
        }
        else {
            const consumeProxy = (content, next, payload) => {
                this.off(queueName, consumeProxy);
                return consume(content, next, payload);
            };
            this.on(queueName, consumeProxy, payload);
            return this;
        }
    }
}

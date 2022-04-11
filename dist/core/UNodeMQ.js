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
        let consumeNum = 0;
        const consumeProxy = (content, next, payload) => {
            if (consumeNum === 1)
                return;
            consumeNum++;
            this.off(queueName, consumeProxy);
            return consume(content, next, payload);
        };
        this.on(queueName, consumeProxy, payload);
        return this;
    }
}

import Logs from "../internal/Logs.js";
export default class ExchangeCollectionHandle {
    has(exchangeName) {
        if (this.exchangeCollection.has(exchangeName))
            return true;
        else {
            Logs.error(`${exchangeName} not find`);
            return false;
        }
    }
    setExchangeCollection(exchangeCollection) {
        this.exchangeCollection = new Map(Object.entries(exchangeCollection));
    }
    getExchange(exchangeName) {
        if (!this.has(exchangeName))
            return;
        return this.exchangeCollection.get(exchangeName);
    }
    getExchangeList() {
        return [...this.exchangeCollection.values()];
    }
    getQueueNameList(exchangeName, content) {
        if (!this.has(exchangeName))
            return;
        return this.getExchange(exchangeName).getQueueNameList(content);
    }
}

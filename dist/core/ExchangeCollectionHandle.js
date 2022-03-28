import Logs from "../internal/Logs.js";
var ExchangeCollectionHandle = (function () {
    function ExchangeCollectionHandle() {
    }
    ExchangeCollectionHandle.prototype.setExchangeCollection = function (exchangeCollection) {
        this.exchangeCollection = exchangeCollection;
    };
    ExchangeCollectionHandle.prototype.getExchange = function (exchangeName) {
        return this.exchangeCollection[exchangeName];
    };
    ExchangeCollectionHandle.prototype.getQueueNameList = function (exchangeName, content) {
        if (this.exchangeCollection[exchangeName] === undefined) {
            Logs.error(exchangeName + " not find");
            throw exchangeName + " not find";
        }
        return this.exchangeCollection[exchangeName].getQueueNameList(content);
    };
    return ExchangeCollectionHandle;
}());
export default ExchangeCollectionHandle;

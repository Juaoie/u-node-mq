var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import Logs from "../internal/Logs.js";
var ExchangeCollectionHandle = (function () {
    function ExchangeCollectionHandle() {
    }
    ExchangeCollectionHandle.prototype.has = function (exchangeName) {
        if (this.exchangeCollection.has(exchangeName))
            return true;
        else {
            Logs.error("".concat(exchangeName, " not find"));
            return false;
        }
    };
    ExchangeCollectionHandle.prototype.setExchangeCollection = function (exchangeCollection) {
        this.exchangeCollection = new Map(Object.entries(exchangeCollection));
    };
    ExchangeCollectionHandle.prototype.getExchange = function (exchangeName) {
        if (!this.has(exchangeName))
            return;
        return this.exchangeCollection.get(exchangeName);
    };
    ExchangeCollectionHandle.prototype.getExchangeList = function () {
        return __spreadArray([], __read(this.exchangeCollection.values()), false);
    };
    ExchangeCollectionHandle.prototype.getQueueNameList = function (exchangeName, content) {
        if (!this.has(exchangeName))
            return;
        return this.getExchange(exchangeName).getQueueNameList(content);
    };
    return ExchangeCollectionHandle;
}());
export default ExchangeCollectionHandle;

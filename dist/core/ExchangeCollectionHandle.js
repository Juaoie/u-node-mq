var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Logs from "../internal/Logs.js";
export default class ExchangeCollectionHandle {
    constructor() {
        this.exchangeCollection = new Map();
    }
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
        const exchange = this.exchangeCollection.get(exchangeName);
        if (exchange === undefined) {
            Logs.error(`${exchangeName} not find`);
            return null;
        }
        return exchange;
    }
    getExchangeList() {
        return [...this.exchangeCollection.values()];
    }
    getQueueNameList(exchangeName, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const exchagne = this.getExchange(exchangeName);
            if (exchagne === null)
                return [];
            return exchagne.getQueueNameList(content);
        });
    }
}

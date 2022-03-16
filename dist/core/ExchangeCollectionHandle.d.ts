import { Exchange } from "../index.js";
export default class ExchangeCollectionHandle<ExchangeCollection extends Record<string, Exchange<unknown>>> {
    private exchangeCollection;
    setExchangeCollection(exchangeCollection: ExchangeCollection): void;
    getExchange<E extends keyof ExchangeCollection>(exchangeName: E): ExchangeCollection[E];
    getQueueNameList<E extends keyof ExchangeCollection>(exchangeName: E, content: unknown): Promise<string[]>;
}

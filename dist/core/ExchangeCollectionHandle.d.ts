import { Exchange } from "../index";
export default class ExchangeCollectionHandle {
    private exchangeCollection;
    has(exchangeName: string): boolean;
    setExchangeCollection(exchangeCollection: Record<string, Exchange<unknown>>): void;
    getExchange(exchangeName: string): Exchange<unknown> | null;
    getExchangeList(): Exchange<any>[];
    getQueueNameList(exchangeName: string, content: unknown): Promise<string[]>;
}

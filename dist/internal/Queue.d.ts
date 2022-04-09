import News from "./News.js";
import Consumer, { Consume } from "./Consumer.js";
interface Option<D> {
    ask?: boolean;
    rcn?: number;
    news?: News<D>[];
    consumerList?: Consumer<D>[];
    mode?: ConsumMode;
    name?: string;
}
export declare enum ConsumMode {
    "Random" = "Random",
    "All" = "All"
}
export default class Queue<D> {
    [k: string]: any;
    name?: string;
    private readonly id;
    getId(): string;
    ask: boolean;
    rcn: number;
    mode: ConsumMode;
    private news;
    getNews(): News<D>[];
    private consumerList;
    getConsumerList(): Consumer<D>[];
    constructor(option?: Option<D>);
    removeConsumer(consume: Consume<D>): boolean;
    removeAllConsumer(): boolean;
    removeAllNews(): boolean;
    removeConsumerById(consumerId: string): boolean;
    pushConsumer(consumer: Consumer<D>): void;
    pushConsume(consume: Consume<D>, payload?: any): void;
    pushNews(news: News<D>): void;
    pushContent(content: D): void;
    eject(): News<D> | null;
    consumeNews(): void;
    consumption(news: News<D>, consumer: Consumer<D>): void;
}
export {};

import { Exchange, Queue, News } from "@/index";
declare abstract class Iframe<D> extends Exchange<D> {
}
export declare class SelfIframe<D> extends Iframe<D> {
}
export declare class OtherIframe<D> extends Iframe<D> {
    constructor(name?: string);
}
export declare class SelfQueue<D> extends Queue<D> {
}
export declare class NewsExpand<D, ExchangeName> extends News<D> {
    constructor(content: D);
}
export {};

import News from "./News";
export declare type Next = (value?: boolean) => void;
export interface Consume<D> {
    (content?: D, next?: Next, payload?: any): Promise<any> | any;
    (content?: D, payload?: any): any;
}
declare type ThenParameter<D> = (isOk: boolean) => void;
interface Payload<D> {
    then: (res: ThenParameter<D>) => void;
}
export default class Consumer<D> {
    private readonly id;
    getId(): string;
    createTime: number;
    consume: Consume<D>;
    payload?: any;
    constructor(consume: Consume<D>, payload?: any);
    consumption(news: News<D>, ask: boolean): Payload<D>;
}
export {};

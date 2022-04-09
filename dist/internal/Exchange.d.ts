declare type Repeater<D> = (content: D) => Promise<string[]> | string[];
export declare type Option<D> = {
    routes?: string[];
    repeater?: Repeater<D>;
    name?: string;
};
export default class Exchange<D> {
    [k: string]: any;
    name?: string;
    private readonly id;
    getId(): string;
    private routes;
    getRoutes(): string[];
    pushRoutes(routes: string[]): void;
    setRoutes(routes: string[]): void;
    private repeater;
    getRepeater(): Repeater<D>;
    setRepeater(repeater: Repeater<D>): void;
    constructor(option?: Option<D>);
    removeRoutes(routes?: string[]): void;
    getQueueNameList(content: D): Promise<string[]>;
}
export {};

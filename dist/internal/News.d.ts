export default class News<D> {
    [k: string]: any;
    private readonly id;
    getId(): string;
    readonly createTime: number;
    readonly content: D;
    consumedTimes: number;
    constructor(content: D);
}

export default class Tools {
    static random(): string;
    static promiseSetTimeout: (time?: number) => Promise<unknown>;
    static getTimeFormat(time?: string | number): string;
    static memorySize: (str: string) => string;
}

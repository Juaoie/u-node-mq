export default abstract class StorageAdapterAbstract {
    abstract init(o: Record<string, any>): void;
    abstract getData(key: string): string;
    abstract setData(key: string, value: string): void;
}

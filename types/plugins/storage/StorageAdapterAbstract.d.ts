export default abstract class StorageAdapterAbstract {
    abstract init(o: Record<string, null>): void;
    abstract getData(key: string): string;
    abstract setData(key: string, value: string): void;
}

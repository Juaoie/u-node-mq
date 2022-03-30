export default abstract class StorageAdapterAbstract {
    abstract getData(key: string): any;
    abstract setData(key: string, value: any): void;
}

/**
 * 需要适配器实现的方法
 */

export default abstract class StorageAdapterAbstract {
  abstract getData(key: string): string;
  abstract setData(key: string, value: string): void;
}

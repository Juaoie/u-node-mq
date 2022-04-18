/**
 * 内存存储的中间适配器
 */
export default abstract class StorageAdapterAbstract {
  /**
   * 初始化数据
   * @param o
   */
  abstract init(o: Record<string, any>): void;
  /**
   * 获取数据
   * @param key
   */
  abstract getData(key: string): string;
  /**
   * 设置数据
   * @param key
   * @param value
   */
  abstract setData(key: string, value: string): void;
}

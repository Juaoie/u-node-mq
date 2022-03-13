export type Coordinate = {
  name: string; //exchange name
  x: number;
  y: number;
  origin: string;
};

/**
 * 抽象路由表
 * 分布式路由表不需要维护，每次都查询
 * 中心式路由表待续
 */
export default abstract class CoordinateList {
  constructor(private name: string) {}
  /**
   * 通过交换机名称获取路由地址
   * @param exchangeName
   */
  abstract getCoordinate<T>(exchangeName: T): Promise<Coordinate>;
}

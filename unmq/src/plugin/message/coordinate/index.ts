export type Coordinate = {
  name: string; //exchange name
  x?: number;
  y?: number;
  origin?: string;
  currentWindow: Window;
};

/**
 * 抽象路由表
 * 分布式路由表不需要维护，每次都查询
 * 中心式路由表待续
 */
export default abstract class CoordinateList {
  abstract coordinateList: Coordinate[];
  /**
   * 通过交换机名称获取路由地址
   * @param exchangeName
   */
  abstract getCoordinate(exchangeName: string): Promise<Coordinate>;
  /**
   * 驱虫加入坐标信息
   * @param coordinate
   */
  abstract pushCoordinate(coordinate: Coordinate);
}

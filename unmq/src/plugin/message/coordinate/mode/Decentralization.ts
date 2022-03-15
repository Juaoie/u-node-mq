import CoordinateList, { Coordinate } from "..";
import IframeMessage from "../../IframeMessage";
import { broadcastGetCoordinateMessage, broadcastMessage, MessageType } from "../../messageProcess";
/**
 * 分布式路由
 */
export default class Decentralization extends CoordinateList {
  /**
   * 驱虫加入坐标信息
   * @param coordinate
   */
  pushCoordinate(coordinate: Coordinate) {
    const index = this.coordinateList.findIndex(item => item.name === coordinate.name);
    if (index === -1) this.coordinateList.push(coordinate);
    else this.coordinateList.splice(index, 1, coordinate);
  }
  coordinateList: Coordinate[] = [];
  constructor() {
    super();
  }
  /**
   * 根据名称获取地址
   * @param exchangeName
   * @returns
   */
  async getCoordinate(exchangeName: string) {
    const coordinate = this.coordinateList.find(item => item.name === exchangeName);
    if (coordinate) {
      return coordinate;
    } else {
      //先广播查找exchange坐标
      try {
        const coordinate = await broadcastGetCoordinateMessage(exchangeName);
        return coordinate;
      } catch (error) {
        throw new Error(`${exchangeName} iframe 还没挂载`);
      }
    }
  }
}

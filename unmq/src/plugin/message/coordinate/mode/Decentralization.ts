import CoordinateList, { Coordinate } from "..";
import IframeMessage from "../../IframeMessage";
import { broadcastGetCoordinateMessage, broadcastMessage, MessageType } from "../../messageProcess";
/**
 * 分布式路由
 */
export default class Decentralization extends CoordinateList {
  constructor() {
    super();
  }
  /**
   * 根据名称获取地址
   * @param exchangeName
   * @returns
   */
  async getCoordinate(exchangeName: string) {
    //先广播查找exchange坐标 
    try {
      const coordinate = await broadcastGetCoordinateMessage(exchangeName);
      return coordinate;
    } catch (error) {
      throw new Error(`${exchangeName} iframe 还没挂载`);
    }
  }
}

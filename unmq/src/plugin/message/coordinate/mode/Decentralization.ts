import CoordinateList, { Coordinate } from "..";
import { broadcastMessage, MessageType } from "../../messageProcess";
/**
 * 分布式路由
 */
export default class Decentralization extends CoordinateList {
  /**
   * 根据名称获取地址
   * @param exchangeName
   * @returns
   */
  getCoordinate<T>(exchangeName: T) {
    return new Promise<Coordinate>((resolve, reject) => {
      //先广播查找exchange坐标
      broadcastMessage(MessageType.FindExchangeMessage, { message: exchangeName });
      resolve({
        name: "模拟", //exchange name
        x: 1,
        y: 1,
        origin: "",
      });
      setTimeout(() => {
        reject();
      }, 3000);
    });
  }
}

import CoordinateList from "..";
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
    return new Promise((resolve, reject) => {
      //先广播查找exchange坐标
      broadcastMessage(MessageType.FindExchangeMessage, { message: exchangeName });
      resolve({});
      setTimeout(()=>{
        reject()
      },3000)
    });
  }
}

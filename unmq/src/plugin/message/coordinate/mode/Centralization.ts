import CoordinateList, { Coordinate } from "..";

/**
 * 中心化路由
 */
export default class Centralization extends CoordinateList {
  getCoordinate<T>(exchangeName: T): Promise<Coordinate> {
    throw new Error("Method not implemented.");
  }
}

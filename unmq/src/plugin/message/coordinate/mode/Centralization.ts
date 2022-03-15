import CoordinateList, { Coordinate } from "..";

/**
 * 中心化路由
 */
export default class Centralization extends CoordinateList {
  pushCoordinate(coordinate: Coordinate) {
    throw new Error("Method not implemented.");
  }
  coordinateList: Coordinate[];
  getCoordinate<T>(exchangeName: T): Promise<Coordinate> {
    throw new Error("Method not implemented.");
  }
}

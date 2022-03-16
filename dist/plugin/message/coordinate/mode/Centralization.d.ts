import CoordinateList, { Coordinate } from "../index.js";
export default class Centralization extends CoordinateList {
    pushCoordinate(coordinate: Coordinate): void;
    coordinateList: Coordinate[];
    getCoordinate<T>(exchangeName: T): Promise<Coordinate>;
}

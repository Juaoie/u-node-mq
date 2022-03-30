import CoordinateList, { Coordinate } from "../index.js";
export default class Centralization implements CoordinateList {
    pushCoordinate(coordinate: Coordinate): void;
    coordinateList: Coordinate[];
    getCoordinate<T>(exchangeName: T): Promise<Coordinate>;
}

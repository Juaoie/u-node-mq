import CoordinateList, { Coordinate } from "../index.js";
export default class Decentralization implements CoordinateList {
    getCoordinate(exchangeName: string): Promise<Coordinate>;
}

import CoordinateList, { Coordinate } from "../index.js";
export default class Decentralization extends CoordinateList {
    constructor();
    getCoordinate(exchangeName: string): Promise<Coordinate>;
}

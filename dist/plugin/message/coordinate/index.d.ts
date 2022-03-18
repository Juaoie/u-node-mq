export declare type Coordinate = {
    name: string;
    x?: number;
    y?: number;
    origin?: string;
    currentWindow: Window;
};
export default abstract class CoordinateList {
    abstract getCoordinate(exchangeName: string): Promise<Coordinate>;
}

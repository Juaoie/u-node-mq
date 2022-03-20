import { Coordinate } from "./coordinate/index.js";
export declare enum MessageType {
    GeneralMessage = 0,
    FindExchangeMessage = 1,
    SendCoordinateMessage = 2,
    OnlineNotificationMessage = 3
}
export declare function singleMessage(type: MessageType, currentWindow: Window, message: any, origin?: string): void;
export declare function broadcastMessage(type: MessageType, message: any): void;
export declare function broadcastGetCoordinateMessage(exchangeName: string): Promise<Coordinate>;

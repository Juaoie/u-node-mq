import { Coordinate } from "./coordinate/index.js";
export declare function getIframeNodeFromCoordinate(coordinate: Pick<Coordinate, "x" | "y">): Window;
export declare function getOtherAllIframeDoc(): T[];
export declare function getSelfIframeDoc(): T;
declare type T = {
    window: Window;
    x: number;
    y: number;
};
export declare function getAllIframeDoc(w: Window, x: any, y: any): T[];
export {};

export declare function getOtherAllIframeDoc(): T[];
export declare function getSelfIframeDoc(): T | undefined;
declare type T = {
    window: Window;
    x: number;
    y: number;
};
export declare function getAllIframeDoc(w: Window, x: number, y: number): T[];
export {};

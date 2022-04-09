import UNodeMQ, { Exchange, Queue } from "../../index";
export declare function getInternalIframeMessageQueueName(queueName: string): string;
export declare function getInternalIframeCoordinateQueueName(queueName: string): string;
export default class IframeMessage {
    private name;
    constructor(name: string);
    install(unmq: UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>, ...options: any[]): void;
}

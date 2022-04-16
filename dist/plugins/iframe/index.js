import { isObject, isString, Queue } from "../../index";
import { getOtherAllIframeDoc } from "./loader";
export var MessageType;
(function (MessageType) {
    MessageType[MessageType["GeneralMessage"] = 0] = "GeneralMessage";
    MessageType[MessageType["FindExchangeMessage"] = 1] = "FindExchangeMessage";
    MessageType[MessageType["SendCoordinateMessage"] = 2] = "SendCoordinateMessage";
    MessageType[MessageType["OnlineNotificationMessage"] = 3] = "OnlineNotificationMessage";
})(MessageType || (MessageType = {}));
export const getInternalIframeMessageQueueName = (queueName) => queueName + "_Iframe_Message";
export const getInternalIframeBroadcasMessageQueueName = (queueName) => queueName + "_Iframe_Wait_Message";
export default class IframePlugin {
    constructor(name) {
        this.name = name;
        this.unmq = null;
        this.name = name;
    }
    install(unmq, ...options) {
        const selfExchange = unmq.getExchange(this.name);
        if (!selfExchange) {
            throw `${this.name}交换机不存在`;
        }
        this.unmq = unmq;
        const list = unmq.getExchangeList();
        const otherIframe = list.filter((item) => item.name !== this.name);
        for (const iframe of otherIframe) {
            if (iframe.name === undefined)
                throw `系统错误`;
            iframe.setRepeater(() => [
                getInternalIframeMessageQueueName(iframe.name),
                getInternalIframeBroadcasMessageQueueName(iframe.name),
            ]);
            unmq.addQueue(new Queue({ name: getInternalIframeMessageQueueName(iframe.name) }));
            unmq.addQueue(new Queue({ name: getInternalIframeBroadcasMessageQueueName(iframe.name) }));
            unmq.on(getInternalIframeBroadcasMessageQueueName(iframe.name), () => {
                this.broadcastMessage(MessageType.FindExchangeMessage, {
                    exchangeName: iframe.name,
                    msg: `who is ${this.name}`,
                });
            });
        }
        this.broadcastMessage(MessageType.OnlineNotificationMessage, null);
        window.addEventListener("message", this.receiveMessage.bind(this), false);
    }
    receiveMessage({ source, data, origin }) {
        if (this.unmq === null)
            throw `${this.name} iframe 未安装`;
        if (!isObject(data))
            return;
        const { mask, type, message, fromName } = data;
        if (mask !== "u-node-mq-plugin")
            return;
        if (source === null || source === undefined)
            return;
        if (!(source instanceof Window))
            return;
        if ([MessageType.OnlineNotificationMessage, MessageType.SendCoordinateMessage].indexOf(type) !== -1) {
            const fromIframe = this.unmq.getExchange(fromName);
            if (!fromIframe)
                return;
            if (isString(fromIframe.origin) && fromIframe.origin !== origin)
                return;
            this.unmq.on(getInternalIframeMessageQueueName(fromName), (data) => {
                this.postMessage(source, MessageType.GeneralMessage, data, origin);
            })();
            return true;
        }
        if (type === MessageType.GeneralMessage)
            return this.unmq.emit(this.name, message);
        if (type === MessageType.FindExchangeMessage && message.exchangeName === this.name) {
            this.postMessage(source, MessageType.SendCoordinateMessage, { msg: `my name is ${this.name}` }, origin);
        }
    }
    postMessage(currentWindow, type, message, origin = "*", transfer) {
        currentWindow.postMessage({
            mask: "u-node-mq-plugin",
            type,
            message,
            fromName: this.name,
        }, origin, transfer);
    }
    broadcastMessage(type, message) {
        const list = getOtherAllIframeDoc();
        list.forEach((item) => {
            this.postMessage(item.window, type, message, "*");
        });
    }
}

import Exchange from "./internal/Exchange";
import Queue from "./internal/Queue";
import Consumer from "./internal/Consumer";
import News from "./internal/News";
import Logs from "./internal/Logs";

import UNodeMQ, { createUnmq } from "./core/UNodeMQ";
export default UNodeMQ;

export { createUnmq };

export { Exchange, Queue, Consumer, News, Logs };

import IframeMessage, { SelfIframe, OtherIframe, SelfQueue } from "./plugin/message/IframeMessage";
export { IframeMessage, SelfIframe, OtherIframe, SelfQueue };

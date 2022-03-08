import Exchange from "./internal/Exchange";
import Queue from "./internal/Queue";
import Consumer, { Consume, Next } from "./internal/Consumer";
import News from "./internal/News";
import Logs from "./internal/Logs";

import UNodeMQ from "./core/UNodeMQ";
export default UNodeMQ;

export { Exchange, Queue, Consumer, News, Logs };

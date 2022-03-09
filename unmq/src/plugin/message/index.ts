/**
 * 使用postMessage api 进行通信
 *
 */

import { PluginComponent } from "../../core/UNodeMQ";

export default class IframeMessage<QueueNameList> implements PluginComponent<QueueNameList> {
  readonly name = "postMessage";
  constructor() {
    // iframeWindow.postMessage();
  }
  install: <Q>() => {};
}

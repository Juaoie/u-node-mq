import UNodeMQ, { Exchange, Queue } from "../../index";

export default class StorePlugin<D extends UNodeMQ<Record<string, Exchange<any>>, Record<string, Queue<any>>>> {
  private unmq: D | null = null;
  private data: Record<string, any> = {};
  defineStore<T>(name: string, defaultValue: T) {
    if (this.unmq === null) throw "StorePlugin 未安装";
    if (this.data[name]) {
    }
  }
  install(unmq: D) {
    this.unmq = unmq;
  }
}

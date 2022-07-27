import { ConstructorParameter, isFunction } from "../utils/tools";
import {  Operator, Queue } from "../index";
import { Consume, Next } from "../internal/Consumer";

export class SingleUNodeMQ<D> {
  private queue :Queue<D>
  constructor( );
  constructor( queue: Queue<D>);
  constructor(queueOption: ConstructorParameter<typeof Queue>);
  constructor(x?: Queue<D> | ConstructorParameter<typeof Queue>) {
           if(x instanceof Queue<D>){
      this.queue=x
    }else {
      this.queue=new Queue(x)
    }
  }
  emit(...contentList: D[]) {
    for (const content of contentList) {
      this.queue.pushContent(content);
    }
    return this;
  }
  emitToQueue(...contentList: D[]) {
    return this.emit(...contentList);
  }
  on(consume: Consume<D>, payload?: any) {
    this.queue.pushConsume(consume, payload);
    return this;
  }
  off(consume: Consume<D>): this;
  off(): this;
  off(x?: Consume<D>): this {
    if (isFunction(x)) this.queue.removeConsumer(x);
    else this.queue.removeAllConsumer();
    return this;
  }
  once(consume: Consume<D>, payload?: any): this;
  once(): Promise<D>;
  once(consume?: Consume<D>, payload?: any) {
    if (isFunction(consume)) {
      const consumeProxy = (content: any, next?: Next, payload?: any) => {
        this.off(consumeProxy);
        return consume(content, next, payload);
      };
      this.on(consumeProxy, payload);
      return this;
    } else {
      return new Promise(resolve => {
        const consumeProxy = (content: any) => {
          this.off(consumeProxy);
          resolve(content);
          return true;
        };
        this.on(consumeProxy, payload);
      });
    }
  }
  add(...operators: Operator<D>[]) {
    this.queue.add(...operators);
    return this;
  }
}

const qu1 = new SingleUNodeMQ(new Queue());

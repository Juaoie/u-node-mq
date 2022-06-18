import { Operator } from "../../index";
import instant from "../instant";
import { isObject } from "../../utils/tools";
/**
 * state 将队列state化
 * @param repeatObject 基本数据类型的重复赋值将被过滤，引用数据类型的重复赋值默认也将被过滤，设置为true，将允许object类型的重复赋值
 * @returns
 *
 */

export default function state<D = unknown | null>(repeatObject?: boolean): Operator<D> {
  let d: D | null = null;
  return {
    ...instant(),
    beforeAddNews(news) {
      let boolean = d !== news.content;

      if (isObject(news.content) && repeatObject) boolean = true;

      d = news.content;
      return boolean;
    },
    addedConsumer(consumer) {
      //如果数据为空，则返回null
      if (d !== null) consumer.consume(d);
    },
  };
}

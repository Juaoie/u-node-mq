import { Operator } from "../..";

/**
 * task 控制队列能存入几条消息
 * @param count
 * @returns
 */
export default function task<D>(count: number): Operator<D> {
  let seen = 0;
  return {
    beforeAddNews() {
      return ++seen <= count;
    },
  };
}

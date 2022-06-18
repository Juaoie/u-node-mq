import { Operator } from "../..";
/**
 * map 方法返回的数据类型和队列一致
 * @param project
 * @returns
 */

export default function map<D = unknown>(project: (value: D, index: number) => D): Operator<D> {
  let index = 0;
  return {
    beforeAddNews(num) {
      num.content = project(num.content, index);
      index++;
      return true;
    },
  };
}

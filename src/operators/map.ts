import { Operator } from "..";
/**
 * map 方法返回的数据类型和队列一致
 * @param project
 * @returns
 */

export function map<D>(project: (value: D, index: number) => D): Operator<D> {
  return {
    index: 0,
    beforeAddNews(num) {
      num.content = project(num.content, this.index);
      this.index++;
      return true;
    },
  };
}

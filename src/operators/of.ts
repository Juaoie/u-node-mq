import { Operator, Queue } from "..";

/**
 * 提前发射数据，可用来设置默认值或者用来快速测试
 * @param count
 * @returns
 */
export function of<D>(...args: D[]): Operator<D> {
  return {
    mounted(queue: Queue<D>) {
      args.forEach((item) => {
        queue.pushContent(item);
      });
    },
  };
}

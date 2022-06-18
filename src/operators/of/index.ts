import { Operator, Queue } from "../..";

/**
 * 提前发射数据，可用来设置默认值或者用来快速测试
 * @param args
 * @returns
 */
export default function of<D = unknown>(...args: D[]): Operator<D> {
  return {
    mounted(queue: Queue<D>) {
      args.forEach((item) => {
        queue.pushContent(item);
      });
    },
  };
}

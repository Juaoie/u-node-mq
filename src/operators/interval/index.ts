import { Operator, Queue } from "../..";

/**
 * 管道操作方法是可以随意组合的，即使在interval之前还有其它操作方法也不影响setInterval的继续运行
 *
 * 在ts文件中使用interval队列内容必须为number
 *
 * 加入的消息内容从1开始
 *
 * setinterval发射数据，发射内容为从0开始的数字
 * @param period 1000 间隔时长
 * @param optimal true 是否在没有消费者的时候暂停发射数据，有消费者则会自动开启发射
 * @returns
 */

export default function interval(period = 1000, optimal = true): Operator<number> {
  if (period < 0) period = 0;
  let num = 0;
  let id: number | null = null;
  let interval = {
    go: () => {
      //
    },
    stop: () => {
      //
    },
  };
  let queue: Queue<number>;

  return {
    mounted(that: Queue<number>) {
      // (function () { })();
      queue = that;
      interval = {
        go() {
          id = setInterval(() => {
            num++;
            queue.pushContent(num);
          }, period);
        },
        stop() {
          if (id === null) return;
          clearInterval(id);
          id = null;
        },
      };

      if (queue.getConsumerList.length > 0) {
        //有默认消费者
        interval.go();
      } else if (!optimal) {
        interval.go();
      }
    },
    addedConsumer() {
      //如果不启用该属性则直接退出
      if (!optimal) return;
      //判断是否以及在循环执行了
      if (id !== null) return;

      interval.go();
    },
    removedConsumer() {
      if (!optimal) return;
      //判断是否以及在循环执行了
      if (id === null) return;

      if (queue.getConsumerList.length === 0) interval.stop();
      return "";
    },
  };
}

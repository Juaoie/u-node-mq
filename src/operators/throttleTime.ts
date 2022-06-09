import { Operator } from "..";

/**
 * throttleTime 节流函数
 * @param duration 节流间隔时间，单位毫秒
 * @param immediate 是否立即执行，一般不用立即执行，如果设置为true，则会拿第一次触发的参数到结束时间执行，而不是拿结束时间之前的最后一次触发的参数去执行
 * 例如在，1秒内触发了5次，传递的参数依次为1、2、3、4、5，则会在第1秒处执行参数为1的方法
 * @returns
 */
export function throttleTime<D>(duration: number, immediate?: boolean): Operator<D> {
  let now = 0;
  let timeId: number | null = null;
  return {
    beforeAddNews() {
      const t = new Date().getTime();
      if (immediate) {
        //立即执行
        if (t <= now + duration) return false;
        now = t;
        return true;
      } else {
        //
        if (timeId !== null) return false;

        return new Promise((resolve) => {
          timeId = setTimeout(() => {
            timeId = null;
            resolve(true);
          }, duration);
        });
      }
    },
  };
}

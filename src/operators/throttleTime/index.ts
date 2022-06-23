import { Operator } from "../..";

/**
 * throttleTime 节流函数
 * @param duration 节流间隔时间，单位毫秒
 * @param immediate 是否立即执行，默认为false：
 * 如果为false，则会拿第一次触发的参数到结束时间执行，而不是拿结束时间之前的最后一次触发的参数去执行；
 * 如果为true，则会拿第一次触发的参数立即执行
 * @returns
 */
export default function throttleTime<D = unknown>(duration: number, immediate?: boolean): Operator<D> {
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

        return new Promise(resolve => {
          timeId = window.setTimeout(() => {
            timeId = null;
            resolve(true);
          }, duration);
        });
      }
    },
  };
}

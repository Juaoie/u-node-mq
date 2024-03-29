import { isString } from "../../utils/tools";
import { Operator, Queue } from "../..";

/**
 * 使用ResizeObserver订阅内容区域大小变化
 * https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver
 * @param arg 需要订阅目标元素的id或者dom节点，默认为html元素
 * @returns
 */
export default function resizeObserver(arg?: string | HTMLElement): Operator<ResizeObserverEntry> {
  let dom: HTMLElement | null = null;
  if (arg === undefined) {
    dom = document.documentElement;
  } else if (isString(arg)) {
    dom = document.getElementById(arg);
    if (dom === null) throw `id：${arg}不存在`;
  } else {
    dom = arg;
  }
  return {
    mounted(queue: Queue<ResizeObserverEntry>) {
      if (dom === null) return;
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          queue.pushContent(entry);
        }
      });
      resizeObserver.observe(dom);
    },
  };
}

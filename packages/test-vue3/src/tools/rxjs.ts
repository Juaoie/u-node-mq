import * as rxjs from "rxjs";
import { map, filter } from "rxjs/operators";

/**
 * 使用摄像头观察苹果
 */
//Observable 可观察的物件 苹果
//Observer 观察者物件  摄像头
//Subscribable  订阅物件 订阅或者取消订阅  指使用摄像头观察苹果 或者取消使用摄像头观察苹果
//Operators 运算子 处理图像的工具
//Subject 主体物件 广播作用
//Schedulers 排程控制器
// rxjs
//   .interval(1000)
//   .pipe(map((x) => x * x))
//   .subscribe(console.log);

/**
 * 移动
 */
export const mousemoves$ = rxjs.fromEvent<MouseEvent>(document, "mousemove");
/**
 * 按下鼠标左键
events.button==1  鼠标中键

events.button==0  鼠标左键

events.button==2  鼠标右键
 */
export const mousedown$ = rxjs.fromEvent<MouseEvent>(document, "mousedown").pipe(filter((x) => x.button === 0));
/**
 * 释放鼠标左键
 */
export const mouseup$ = rxjs.fromEvent<MouseEvent>(document, "mouseup").pipe(filter((x) => x.button === 0));
/**
 * 切换浏览器标签
 */
export const visibilitychange$ = rxjs.fromEvent(document, "visibilitychange");

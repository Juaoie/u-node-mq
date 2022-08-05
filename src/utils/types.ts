/**
 * 定时器id类型
 * 需要兼容dom，node，小程序环境
 */
export type IntTime = number;

/**
 * 五个组件名称的枚举
 */
export enum ComponentEnum {
  "EXCHANGE" = "exchange",
  "QUEUE" = "queue",
  "NEWS" = "news",
  "CONSUMER" = "consumer",
  "LOGS" = "logs",
}

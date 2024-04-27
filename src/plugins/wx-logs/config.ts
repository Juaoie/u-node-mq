/**
 * 日志级别，日志类型，暂就这些类型，不可动态添加
 */
export enum LOG_LEVEL {
  Info = "info",
  Warn = "warn",
  Error = "error",
}

/**
 * 输出类型
 *
 */
export enum OUTPUT_TYPE {
  //控制台
  Console = "console",
  //实时日志
  Realtime = "realtime",
  //xhr请求
  Request = "request",
}

export type Option = {
  [P in `${LOG_LEVEL}`]: Array<`${OUTPUT_TYPE}`>;
};

export const defaultOption: Option = {
  [LOG_LEVEL.Info]: [OUTPUT_TYPE.Console],
  [LOG_LEVEL.Warn]: [OUTPUT_TYPE.Console, OUTPUT_TYPE.Realtime],
  [LOG_LEVEL.Error]: [OUTPUT_TYPE.Console, OUTPUT_TYPE.Request, OUTPUT_TYPE.Realtime],
};

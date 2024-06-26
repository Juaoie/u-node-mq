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

/**
 * 不同日志级别对应日志输出类型的配置
 */
export type LevelOutputOption = {
  [P in `${LOG_LEVEL}`]: Array<`${OUTPUT_TYPE}`>;
};

export const defaultOption: LevelOutputOption = {
  [LOG_LEVEL.Info]: [OUTPUT_TYPE.Console],
  [LOG_LEVEL.Warn]: [OUTPUT_TYPE.Console, OUTPUT_TYPE.Realtime],
  [LOG_LEVEL.Error]: [OUTPUT_TYPE.Console, OUTPUT_TYPE.Request, OUTPUT_TYPE.Realtime],
};

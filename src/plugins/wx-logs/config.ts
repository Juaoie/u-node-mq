/**
 * 日志级别，日志类型，暂就这些类型，不可动态添加
 */
export enum LogLevel {
  Info = "info",
  Warn = "warn",
  Error = "error",
}

/**
 * 输出类型
 *
 */
export enum OutputType {
  //控制台
  Console = "console",
  //实时日志
  Realtime = "realtime",
  //xhr请求
  Request = "request",
}

export type Option = {
  [P in `${LogLevel}`]: Array<`${OutputType}`>;
};

export const defaultOption: Option = {
  [LogLevel.Info]: [OutputType.Console],
  [LogLevel.Warn]: [OutputType.Console, OutputType.Realtime],
  [LogLevel.Error]: [OutputType.Console, OutputType.Request, OutputType.Realtime],
};

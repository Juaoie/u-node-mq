// export default function listener() {}
import { Logs } from "./index";
import { LogLevel } from "./config";
type I =
  | "onThemeChange"
  | "onNetworkWeakChange"
  | "onNetworkStatusChange"
  | "onAudioInterruptionEnd"
  | "onAudioInterruptionBegin"
  | "onMemoryWarning"
  | "onUnhandledRejection"
  | "onPageNotFound"
  | "onLazyLoadError"
  | "onError";
type OptionWx = Pick<WechatMiniprogram.Wx, I>;
type T = {
  [key in LogLevel]: OptionWx[I][];
};
const t: T = {
  [LogLevel.Info]: [wx["onThemeChange"], wx["onNetworkWeakChange"], wx["onNetworkStatusChange"]],
  [LogLevel.Warn]: [wx["onAudioInterruptionEnd"], wx["onAudioInterruptionBegin"], wx["onMemoryWarning"]],
  [LogLevel.Error]: [wx["onUnhandledRejection"], wx["onPageNotFound"], wx["onLazyLoadError"], wx["onError"]],
};
export function onListener(this: Logs) {
  t[LogLevel.Info].forEach(fun => {
    fun(this.info);
  });

  t[LogLevel.Warn].forEach(fun => {
    fun(this.warn);
  });

  t[LogLevel.Error].forEach(fun => {
    fun(this.error);
  });
}

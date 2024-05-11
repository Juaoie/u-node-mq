// export default function listener() {}
import WxLogsPlugin from "./index";
import { LOG_LEVEL } from "./config";
import { wxApi } from "./proxyApi";

const t = {
  [LOG_LEVEL.Info]: [wxApi("onThemeChange"), wxApi("onNetworkWeakChange"), wxApi("onNetworkStatusChange")],
  [LOG_LEVEL.Warn]: [wxApi("onAudioInterruptionEnd"), wxApi("onAudioInterruptionBegin"), wxApi("onMemoryWarning")],
  [LOG_LEVEL.Error]: [wxApi("onUnhandledRejection"), wxApi("onPageNotFound"), wxApi("onLazyLoadError"), wxApi("onError")],
};
/**
 * 监听系统变化事件
 * @param this
 */
export function onListener(this: WxLogsPlugin) {
  t[LOG_LEVEL.Info].forEach(fun => {
    if (fun !== null) fun(this[LOG_LEVEL.Info].bind(this));
  });

  t[LOG_LEVEL.Warn].forEach(fun => {
    if (fun !== null) fun(this[LOG_LEVEL.Warn].bind(this));
  });

  t[LOG_LEVEL.Error].forEach(fun => {
    if (fun !== null) fun(this[LOG_LEVEL.Error].bind(this));
  });
}

import { isFunction } from "@/utils/tools";

type I =
  | "canIUse"
  | "onThemeChange"
  | "onNetworkWeakChange"
  | "onNetworkStatusChange"
  | "onAudioInterruptionEnd"
  | "onAudioInterruptionBegin"
  | "onMemoryWarning"
  | "onUnhandledRejection"
  | "onPageNotFound"
  | "onLazyLoadError"
  | "onError"
  | "getWindowInfo"
  | "getSystemSetting"
  | "getSkylineInfoSync"
  | "getDeviceInfo"
  | "getAppBaseInfo"
  | "getAppAuthorizeSetting"
  | "getLaunchOptionsSync"
  | "getApiCategory"
  | "getRealtimeLogManager"
  | "getAccountInfoSync";

type OptionWx = Pick<WechatMiniprogram.Wx, I>;

/**
 * 代理请求wx api ，需要基础库最低为1.1.1
 * @returns
 */
function proxyWxApi() {
  if (!isFunction(wx["canIUse"])) throw new Error("基础库低于 1.1.1");
  //
  return function <J extends I>(w: J): OptionWx[J] | null {
    if (!isFunction(wx[w])) return null;

    return wx[w];
  };
}

export const wxApi = proxyWxApi();

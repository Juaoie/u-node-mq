import IframePlugin from "./iframe/index";
import WxLogsPlugin from "./wx-logs/index";
export { IframePlugin, WxLogsPlugin };

/**
 * 安装插件的方法
 */
export type PluginInstallFunction = (unmq: any, ...options: any[]) => void;
export type Plugin =
  | (PluginInstallFunction & { install?: PluginInstallFunction })
  | {
      install: PluginInstallFunction;
    };

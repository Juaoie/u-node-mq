import AllExchangeLogs from "./allExchangeLogs";

export default class Logs {
  constructor() {}
  /**
   * 清空所有日志

   */
  clear(): Boolean {
    return true;
  }
  /**
   * 参数为过滤的字段名称， 获取所有 exchange 日志
   */
  getAllExchangeLogs(nameList: String[]): AllExchangeLogs[] {
    return new Array<AllExchangeLogs>();
  }
}

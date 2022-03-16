/**
 * 工具类
 */
export default class Tools {
  /**
   * 获取随机数
   * @returns
   */
  static random(): string {
    return String(Math.round(Math.random() * 10000000000))
  }
  static promiseSetTimeout = (time = 0) =>
    new Promise((resolve) => setTimeout(resolve, time))

  /**
   * 获取格式化时间
   * @returns
   */
  static getTimeFormat(time?: string | number): string {
    let now = null
    if (time) now = new Date(time)
    else now = new Date()

    const year = now.getFullYear() //年
    const month = now.getMonth() + 1 //月
    const day = now.getDate() //日

    const hh = now.getHours() //时
    const mm = now.getMinutes() //分

    let clock = year + '-'

    if (month < 10) clock += '0'
    clock += month + '-'

    if (day < 10) clock += '0'
    clock += day + ' '

    if (hh < 10) clock += '0'
    clock += hh + ':'
    if (mm < 10) clock += '0'
    clock += mm
    return clock
  }

  /**
   *   //字符编码数值对应的存储长度：
  //UCS-2编码(16进制) UTF-8 字节流(二进制)
  //0000 - 007F       0xxxxxxx （1字节）
  //0080 - 07FF       110xxxxx 10xxxxxx （2字节）
  //0800 - FFFF       1110xxxx 10xxxxxx 10xxxxxx （3字节）
   * @param str 
   * @returns 
   */
  static memorySize = (str: string): string => {
    let totalLength = 0
    let charCode
    for (let i = 0; i < str.length; i++) {
      charCode = str.charCodeAt(i)
      if (charCode < 0x007f) {
        totalLength++
      } else if (0x0080 <= charCode && charCode <= 0x07ff) {
        totalLength += 2
      } else if (0x0800 <= charCode && charCode <= 0xffff) {
        totalLength += 3
      } else {
        totalLength += 4
      }
    }
    if (totalLength >= 1024 * 1024)
      return (totalLength / (1024 * 1024)).toFixed(2) + 'MB'
    if (totalLength >= 1024 && totalLength < 1024 * 1024)
      return (totalLength / 1024).toFixed(2) + 'KB'
    else return totalLength + 'B'
  }
}

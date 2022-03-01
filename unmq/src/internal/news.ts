import Tools from '../utils/tools'

export default class News<D> {
  /**
   * id
   */
  readonly id: string = Tools.random()
  /**
   * 消费者创建时间戳
   */
  readonly createTime: number
  /**
   * 消息内容
   */
  readonly content: D
  /**
   * 已消费次数
   */
  consumedTimes: number = -1

  constructor(content: D) {
    this.createTime = new Date().getTime()
    this.content = content
  }
}

interface ConsumerOptions {
  //是否需要确认
  ask?: boolean;
}
/**
 *  消费者
 */
class Consumer {
  constructor(
    private fun: (data: any) => Promise<boolean> | void,
    private consumerOptions?: ConsumerOptions
  ) {}
  /**
   * 消费消息
   * @param data
   * @returns
   */
  async consume(data: any): Promise<boolean> {
    if (!this?.consumerOptions?.ask) {
      this.fun(data);
      return true;
    }
    const ask = await this.fun(data);
    return Boolean(ask);
  }
  /**
   * 获取fun
   * @returns
   */
  getFun(): (data: any) => Promise<boolean> | void {
    return this.fun;
  }
}

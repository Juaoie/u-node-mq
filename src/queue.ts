const promiseFun = (t?: number) => new Promise((res) => setTimeout(res, t));

/**
 * 队列
 */
export class Queue {
  constructor(private queueName: string) {}
  //消息列表
  private newsList: any[];
  //消费者列表
  private consumerList: Consumer[];
  /**
   * 添加队列消息
   * @param news
   */
  pushQueueNews(news: any) {
    this.newsList.push(news);
    this.sendMessageToAllConsumer();
  }
  /**
   * 获取队列名称
   * @returns
   */
  getQueueName() {
    return this.queueName;
  }
  /**
   *
   */
  getConsumer() {}
  /**
   * 添加消费者
   * @param consumer
   */
  pushConsumer(consumer: Consumer) {
    this.consumerList.push(consumer);
  }

  /**
   * 发送消息给指定消费者
   * @param consumer
   */
  async sendMessageToConsumer(consumer: Consumer) {
    //判空
    if (this.consumerList.indexOf(consumer) === -1)
      throw `消费者${consumer}不存在`;
    //列表循环消费
    const listPromiseFun = this.newsList.map((item: any) =>
      consumer.consume(item)
    );
    //消息确认列表
    const confirmNewsList: any[] = this.newsList;
    this.newsList = [];
    /**
     * TODO:
     * 如果消息一直未被确认,
     * 则该消息会一直存在于消息确认列表中,
     * 此处也会被阻塞确认方法执行
     * 后面再给消息增加消息确认延迟时长功能和异常处理功能
     * 所以这里先假设消息确认都能正常返回，并且不报错
     */
    const askList: boolean[] = await Promise.all(listPromiseFun);
    confirmNewsList.forEach(async (item, index) => {
      //如果消息返回未被消费，则重新添加到消息列表中等待下一消息事件触发
      /**
       * TODO:
       * 如果消息未被消费
       * 这里将延迟一秒后再次发送给消费者
       * 所以这里只等待下一次发送消息事件触发
       */
      if (Boolean(askList[index]) === false) {
        await promiseFun(1000);
        this.pushQueueNews(item);
      }
    });
  }
  /**
   * 发送消息给所有消费者
   */
  async sendMessageToAllConsumer() {
    if (this.consumerList.length === 0) return;
    //列表随机消费
    const listPromiseFun = this.newsList.map((item: any) => {
      const round = Math.round(Math.random() * (this.consumerList.length - 1));
      return this.consumerList[round].consume(item);
    });
    //消息确认列表
    const confirmNewsList: any[] = this.newsList;
    this.newsList = [];
    const askList: boolean[] = await Promise.all(listPromiseFun);
    confirmNewsList.forEach(async (item, index) => {
      if (Boolean(askList[index]) === false) {
        await promiseFun(1000);
        this.pushQueueNews(item);
      }
    });
  }
  /**
   * 删除指定消费者
   * @param fun
   */
  deleteConsumer(fun: (data: any) => Promise<boolean> | void) {
    const index: number = this.consumerList.findIndex(
      (item: Consumer) => item.getFun() === fun
    );
    if (index === -1) throw `消费者${fun}不存在`;
    this.consumerList.splice(index, 1);
  }
}

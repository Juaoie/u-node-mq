export enum Event {
  AddErrLogs = "ADD_ERR_LOGS", //添加错误日志
  AddExchange = "ADD_EXCHANGE", //添加交换机
  AddQueue = "ADD_QUEUE", //添加队列
  AddNews = "ADD_NEWS", //添加消息
  AddConsumer = "ADD_CONSUMER", //添加消费者
  EditExchangeEmitNum = "EDIT_EXCHANGE_EMIT_NUM", //编辑交换机emit成功的数量
  EditExchangeDispenseNum = "EDIT_EXCHANGE_DISPENSE_NUM", //编辑交换机成功分配数据的数量
  EditNewsNed = "EDIT_NEWS_NED", //消息被消费
  EditConsumerNum = "EDIT_CONSUMER_NUM", //消费者消费次数
}

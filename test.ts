/**
 *  消费者
 */
class Consumer1 {
  $emit(queueName: string, news: any): void;
  $emit(news: any): void;
  $emit(queueName: string, news?: any): void {
    console.log("queueName=",queueName)
    console.log("news=",news)
  }
}

const a = new Consumer1();
a.$emit("1",32);

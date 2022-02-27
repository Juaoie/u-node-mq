import UNodeMQ from '.'
export default class Logs {
  static unmq = null //new UNodeMQ({ exchangeName: "logs", queueName: ["error"] });
  static error(message: any) {
    // this.unmq.emit()
    console.error(message)
  }
  static log(message: any) {
    console.log(message)
  }
}

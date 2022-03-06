import { Exchange } from "..";
import ExchangeCollection from "./ExchangeCollection";
import QueueCollection from "./QueueCollection";
import { Option } from "./UNodeMQ";

export default class Collection {
  private readonly exchangeCollection: ExchangeCollection<unknown>;
  private readonly queueCollection: QueueCollection<unknown>;
  constructor(option: Option) {
    this.exchangeCollection.setExchangeCollection(option.exchange);
  }
  getExchageByName() {
    // const obj =this.exchangeCollection.getExchangeCollection()
    // const obj= this.exchangeCollection.setExchangeCollection({
    //   ex:new Exchange({ name: "ex1" })
    // });
    const obj = {
      ex:new Exchange({ name: "ex1" })
    }
    // const obj = this.exchangeCollection.getExchangeCollection();

    // const obj= Object.assign(obj1, { a: 1 });
    type Obj = typeof obj;
    let key: keyof Obj;
    key = "a";

    this.exchangeCollection.getExchangeCollection();
    // return this.exchangeCollection.getExchangeByName(exchangeName);
  }
}

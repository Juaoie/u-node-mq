import { Exchange } from "..";
import Logs from "../internal/Logs";
import { Option } from "./UNodeMQ";

export default class ExchangeCollection<D> {
  private exchangeCollection: {};
  setExchangeCollection(exchangeCollection) {
    this.exchangeCollection = exchangeCollection;
    return exchangeCollection
  }
  getExchangeCollection() {
    return this.exchangeCollection;
  }
  getExchangeByName(exchangeName: string) {
    return this.exchangeCollection[exchangeName];
  }
  getExchangeNameList() {
    return Object.keys(this.exchangeCollection);
  }
  addExchange(option: Option) {
  }
}

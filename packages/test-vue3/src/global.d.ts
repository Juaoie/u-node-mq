import UNodeMQ, {
  createUnmq,
  createQuickUnmq,
  QuickUNodeMQ,
  Exchange,
  Queue,
  Consumer,
  News,
  Logs,
  ConsumMode
} from 'u-node-mq'
import debounceTime from 'u-node-mq/operators/debounceTime'
import filter from 'u-node-mq/operators/filter'
import instant from 'u-node-mq/operators/instant'
import interval from 'u-node-mq/operators/interval'
import map from 'u-node-mq/operators/map'
import newsTime from 'u-node-mq/operators/newsTime'
import of from 'u-node-mq/operators/of'
import removeDuplicates from 'u-node-mq/operators/removeDuplicates'
import session from 'u-node-mq/operators/session'
import state from 'u-node-mq/operators/state'
import task from 'u-node-mq/operators/task'
import throttleTime from 'u-node-mq/operators/throttleTime'

declare global {
  //设置全局属性
  interface Window {
    //window对象属性
    UNodeMQ: typeof UNodeMQ //加入对象
    createUnmq: typeof createUnmq //加入对象
    createQuickUnmq: typeof createQuickUnmq //加入对象
    QuickUNodeMQ: typeof QuickUNodeMQ //加入对象
    Exchange: typeof Exchange //加入对象
    Queue: typeof Queue //加入对象
    Consumer: typeof Consumer //加入对象
    News: typeof News //加入对象
    Logs: typeof Logs //加入对象
    ConsumMode: typeof ConsumMode //加入对象debounceTime from
    debounceTime: typeof debounceTime
    filter: typeof filter
    instant: typeof instant
    interval: typeof interval
    map: typeof map
    newsTime: typeof newsTime
    of: typeof of
    removeDuplicates: typeof removeDuplicates
    session: typeof session
    state: typeof state
    task: typeof task
    throttleTime: typeof throttleTime
  }
}

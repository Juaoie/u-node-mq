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
} from '@u/index'
import debounceTime from '@u/operators/debounceTime'
import filter from '@u/operators/filter'
import instant from '@u/operators/instant'
import interval from '@u/operators/interval'
import map from '@u/operators/map'
import newsTime from '@u/operators/newsTime'
import of from '@u/operators/of'
import removeDuplicates from '@u/operators/removeDuplicates'
import session from '@u/operators/session'
import state from '@u/operators/state'
import task from '@u/operators/task'
import throttleTime from '@u/operators/throttleTime'

import IframePlugin from '@u/plugins/iframe'

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
    IframePlugin: typeof IframePlugin
  }
}

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

Object.assign(window, {
  UNodeMQ,
  createUnmq,
  createQuickUnmq,
  QuickUNodeMQ,
  Exchange,
  Queue,
  Consumer,
  News,
  Logs,
  ConsumMode,
  debounceTime,
  filter,
  instant,
  interval,
  map,
  newsTime,
  of,
  removeDuplicates,
  session,
  state,
  task,
  throttleTime,
  IframePlugin
})

const unmq = createQuickUnmq(new Exchange({ routes: ['qu1'] }), {
  qu1: new Queue<unknown>().add(state(false, true))
})
console.log('--------')
async function test() {
  const a = await unmq.once('qu1')
  unmq.emit(11111)
  console.log('🚀 ~ file: queue.ts ~ line 60 ~ test ~ a', a)
  const b = await unmq.once('qu1')
  console.log('🚀 ~ file: queue.ts ~ line 61 ~ test ~ b', b)
}
test()

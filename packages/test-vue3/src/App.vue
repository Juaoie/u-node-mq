<template>
  <div @contextmenu.prevent class="page pr">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
  // import { useStore } from "@/store/index";
  // import { fromEvent } from "rxjs";
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
  Object.assign(window, {
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
    throttleTime
  })

  const qu1 = new Queue()
  /**
   * 组件
   */

  // const store = useStore();
  // fromEvent<MouseEvent>(document, "mousemove").subscribe((mouseEvent: MouseEvent) => {
  //   store.commit("setBodyMouseEvent", mouseEvent);
  // });
</script>
<style lang="scss" scoped>
  .page {
    height: 100vh;
    width: 100vw;
    user-select: none;
  }
</style>

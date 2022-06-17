<template>
  <Vue3DraggableResizable
    :resizable="true"
    :initW="style.width"
    :initH="style.height"
    v-model:x="style.left"
    v-model:y="style.top"
    v-model:w="style.width"
    v-model:h="style.height"
    v-model:fullScreen="runApp.fullScreen"
    :z-index="style.zIndex"
    :min-w="300"
    :min-h="200"
    :parent="false"
    @activated="activatedHandle"
    @resize-start="activatedHandle"
    @dragging="dragging"
    @drag-end="dragEnd"
  >
    <div class="window-app">
      <div class="window-bar df aic jcc pr">
        <div class="traffic-lights pa df aic">
          <div class="rounded-full close df aic jcc" @click="closeAppWindow">
            <img src="@a/img/icon/close.png" />
          </div>
          <div class="rounded-full minus df aic jcc" @click="hiddenAppWindow">
            <img src="@a/img/icon/minus.png" />
          </div>
          <div class="rounded-full full-screen df aic jcc" @click="screenSize">
            <img src="@a/img/icon/full-screen.png" />
          </div>
        </div>
        <span>{{ runApp.title }}</span>
      </div>
      <div class="window-body">
        <iframe
          v-if="nav?.link"
          class="w24 heightfull"
          :src="nav?.link"
          frameborder="0"
          title="VSCode"
          @load="load"
        ></iframe>
      </div>
    </div>
  </Vue3DraggableResizable>
</template>
<script lang="ts" setup>
  import Vue3DraggableResizable from './components/Vue3DraggableResizable.vue'
  import { ref, watch, CSSProperties, onUnmounted, provide, Ref, computed, resolveComponent, onMounted } from 'vue'
  import { useStore } from '@/store'
  import { RunAppReq } from '@/socket/interface/request/RunAppReq'
  import { NavigationRes } from '@/socket/interface/response/NavigationRes'
  import { getNavList } from '@/socket/api'
  import { RunAppRes } from '@/socket/interface/response/RunAppRes'

  const store = useStore()

  const { runAppId } = defineProps<{ runAppId: number }>()
  const runApp = store.state.runAppList.find((item) => item.id === runAppId)
  if (runApp === undefined) throw 'runApp不存在'
  const style = ref(runApp.style)

  onMounted(() => {
    store.commit('setRunAppStyle', { id: runAppId, style: lintStyle(runApp).style })
  })

  const nav = computed(() => store.state.navList.find((item) => item.appId === runApp.appId))
  function lintStyle(runApp: RunAppRes) {
    if (runApp.style.top < 0) runApp.style.top = 20
    else if (runApp.style.top > document.body.clientHeight - 100) runApp.style.top = document.body.clientHeight - 100
    if (runApp.style.left + runApp.style.width < 100) runApp.style.left = 100 - runApp.style.width
    else if (runApp.style.left > document.body.clientWidth - 100) runApp.style.left = document.body.clientWidth - 100
    return runApp
  }
  /**
   * 开始拖动
   */
  function dragging(res: { x: number; y: number }) {
    //TODO:全屏拖动位置还是有问题
    if (runApp === undefined) return
    if (runApp.fullScreen) {
      store.commit('setRunAppFullScreen', { id: runApp.id, fullScreen: false })
      console.log(
        '🚀 ~ file: index.vue ~ line 85 ~ dragging ~ store.state.bodyMouseEvent.clientY',
        store.state.bodyMouseEvent.clientY
      )
      console.log('🚀 ~ file: index.vue ~ line 85 ~ dragging ~ runApp.style.top', runApp.style.top)
      runApp.style.top = store.state.bodyMouseEvent.clientY
      runApp.style.left = store.state.bodyMouseEvent.clientX
      store.commit('setRunAppStyle', { id: runAppId, style: runApp.style })
    }
  }
  /**
   * 结束拖动
   */
  function dragEnd() {
    if (runApp === undefined) return
    store.commit('setRunAppStyle', { id: runAppId, style: lintStyle(runApp).style })
  }
  /**
   * 选中状态
   */
  function activatedHandle() {
    if (store.getters.zIndexMax === style.value.zIndex) return
    style.value.zIndex = store.getters.zIndexMax + 1
    store.commit('setRunAppStyle', { id: runAppId, style: style.value })
  }

  /**
   * 点击关闭窗口
   */
  function closeAppWindow() {
    store.dispatch('deleteRunApp', runAppId)
  }
  /**
   * 点击隐藏窗口
   */
  function hiddenAppWindow() {
    if (runApp === undefined) return
    store.commit('setRunAppHidden', { id: runApp.id, hidden: true })
  }
  /**
   * 控制全屏还是小屏
   */
  function screenSize() {
    if (runApp === undefined) return
    store.commit('setRunAppFullScreen', { id: runApp.id, fullScreen: !runApp.fullScreen })
  }

  function load() {}
</script>
<style lang="scss" scoped>
  .window-app {
    width: 100%;
    height: 100%;
    border-radius: v-bind("runApp.fullScreen ? '0px': '6px'");
    background: #fff;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    .window-bar {
      background-color: rgb(229, 231, 235);
      width: 100%;
      height: 25px;
      font-weight: 600;
      font-size: 16px;
      .traffic-lights {
        left: 0;
        &:hover .rounded-full img {
          display: inline-block;
        }
        .rounded-full {
          margin-left: 10px;
          border-radius: 50%;
          width: 13px;
          height: 13px;
          cursor: pointer;
          & > img {
            display: none;
            color: #000;
            width: 8px;
            height: 8px;
          }
        }
        .close {
          background: #fd4848;
        }
        .minus {
          background: #ffa70c;
        }
        .full-screen {
          background: #11c489;
        }
      }
    }
    .window-body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
</style>

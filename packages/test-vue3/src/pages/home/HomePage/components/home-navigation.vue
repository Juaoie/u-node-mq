<template>
  <div class="dock pf df aic jcc" ref="dock" @mousemove="mousemove" @mouseleave="mouseout">
    <ul class="navigation df aife pr">
      <li
        class="df jcc"
        v-for="item in navList"
        @mousemove="hoverIndex = item.appId"
        @mouseout="hoverIndex = 0"
        @click="runApp(item)"
      >
        <img :src="item.icon" />
        <span class="tooltip pa" v-show="hoverIndex === item.appId">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { ref, Ref } from 'vue'
  import github from '@a/img/app/github.png'
  import launchpad from '@a/img/app/launchpad.png'
  import safari from '@a/img/app/safari.png'
  import weixin from '@a/img/app/weixin.png'

  const dock = ref<HTMLElement | null>()

  const navList = ref([
    {
      appId: 1,
      icon: github,
      name: 'github'
    },
    {
      appId: 2,
      icon: launchpad,
      name: 'launchpad'
    },
    {
      appId: 3,
      icon: safari,
      name: 'safari'
    },
    {
      appId: 4,
      icon: weixin,
      name: 'weixin'
    }
  ])

  function mousemove(mouseEvent: MouseEvent) {
    if (!dock.value) return
    const imgs = dock.value.getElementsByTagName('img')

    for (let index = 0; index < imgs.length; index++) {
      //li 标签到ul 标签的位置
      // @ts-ignore
      const offsetLeft = imgs[index].offsetLeft

      //li 标签的宽高
      // @ts-ignore
      const offsetWidth = imgs[index].offsetWidth

      const x = mouseEvent.clientX - offsetLeft - offsetWidth / 2 - dock.value.offsetLeft

      //根据勾股定理计算
      let iScale = 1 - Math.sqrt(x * x + 1) / 300

      if (iScale < 0.5) iScale = 0.5

      //x 变量的范围为 0 - 正无穷
      //img 宽度大小范围 50 - 100
      imgs[index].style.width = iScale * 100 + 'px'
    }
  }

  function mouseout() {
    if (!dock.value) return
    const imgs = dock.value.getElementsByTagName('img')
    for (let index = 0; index < imgs.length; index++) {
      imgs[index].style.width = '50px'
    }
  }

  const hoverIndex = ref(0)

  /**
   * 添加一个runapp
   */
  async function runApp(nav: NavigationRes) {
    if (nav.desktop) {
      if (nav.single) {
        const runApp = store.state.runAppList.find((item) => item.appId === nav.appId)
        if (runApp === undefined) {
          const clientWidth = document.body.clientWidth
          const style: StyleReq = {
            left: clientWidth / 2 - 150 - Math.random() * 100,
            top: 300,
            zIndex: store.getters.zIndexMax + 1
          }
          const runAppTemp: RunAppReq = {
            appId: nav.appId,
            title: nav.name,
            state: true,
            hidden: false,
            style
          }
          store.dispatch('addRunApp', runAppTemp)
        } else {
          store.commit('setRunAppHidden', { id: runApp.id, hidden: false })
        }
      } else {
        //赞不考虑一个应用多个实例的方法
      }
    } else {
      const link = document.createElement('a') // 创建元素
      link.href = nav.link
      document.body.appendChild(link)
      link.style.display = 'none'
      link.target = '_blank'
      link.click()
      document.body.removeChild(link)
    }
  }
</script>
<style lang="scss" scoped>
  .dock {
    width: fit-content;
    z-index: 99999;
    bottom: 0;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    user-select: none;
    .navigation {
      height: 64px;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.17);
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      border-width: 1px 1px 0 1px;
      background: rgba(255, 255, 255, 0.2);
      padding: 7px 6px;
      margin: 0;
      li {
        margin: 0 6px;
        list-style: none;
        display: flex;
        transition-duration: 0.15s;
        transition-property: width;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: bottom;
        img {
          position: relative;
          top: 0;
          will-change: width;
          width: 50px;
          max-width: 100px;
          min-width: 50px;
          height: auto;
          cursor: pointer;
        }
        .tooltip {
          top: -70px;
          color: #000;
          background: rgba($color: #fff, $alpha: 0.6);
          padding: 4px 10px;
          border-radius: 4px;
        }
      }
    }
  }
</style>

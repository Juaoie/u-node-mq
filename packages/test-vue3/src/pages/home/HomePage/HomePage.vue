<template>
  <img v-if="mode === 'dark'" class="wallpaper" src="@a/img/wallpaper-night.jpg" @contextmenu.prevent />
  <img v-else class="wallpaper" src="@a/img/wallpaper-day.jpg" @contextmenu.prevent />
  <div class="mask pa"></div>
  <home-navigation></home-navigation>
  <!-- <DraggableContainer :referenceLineVisible="false">
    <template v-for="item in store.state.runAppList" :key="item.id">
      <app-window :runAppId="item.id" v-show="!item.hidden"></app-window>
    </template>
  </DraggableContainer> -->
</template>

<script lang="ts" setup>
  // import DraggableContainer from '@/pages/AppWindow/components/DraggableContainer'
  import HomeNavigation from './components/home-navigation.vue'
  // import AppWindow from '@p/AppWindow/index.vue'
  const mode = 'dark'

  // async function created() {
  //   const [runAppList, navList] = await Promise.all([getRunAppList(), getNavList()]);
  //   store.commit("setRunAppList", runAppList);
  //   store.commit("setNavList", navList);
  //   const observable = new Observable<RunAppRes>((observer) => {
  //     store.state.runAppList.forEach((item) => {
  //       watch(
  //         () => item,
  //         (res) => observer.next(res),
  //         {
  //           deep: true,
  //         }
  //       );
  //     });
  //   });
  //   observable.pipe(debounceTime(500)).subscribe((res) => {
  //     store.dispatch("updateRunApp", res.id);
  //   });
  // }
  // created();
</script>

<style lang="scss" scoped>
  .wallpaper {
    width: 100%;
    height: 100%;
    transition: transform 0.25s, filter 0.25s;
    position: absolute;
    z-index: -3;
    top: 0;
    left: 0;
    object-fit: cover;
  }
  .mask {
    width: 100%;
    height: 100%;
    z-index: 0;
    top: 0;
    left: 0;
  }
</style>

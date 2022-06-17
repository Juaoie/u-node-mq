<template>
  <div @contextmenu.prevent class="page pr">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// import { useStore } from "@/store/index";
// import { fromEvent } from "rxjs";
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

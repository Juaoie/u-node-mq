<template>
  <div class="body df">
    <create-exchange></create-exchange>

    <div class="queue"></div>
  </div>
</template>

<script lang="ts" setup>
  import CreateExchange from "./exchange/CreateExchange.vue";
</script>
<style lang="scss" scoped>
  .body {
    width: 100%;
    .queue {
      height: 100%;
      min-width: 400px;
      background: #67c23a;
    }
  }
</style>

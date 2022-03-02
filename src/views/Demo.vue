<template>
  <div class="body df jcsb">
    <create-exchange></create-exchange>

    <create-queue></create-queue>
  </div>
</template>

<script lang="ts" setup>
  import CreateExchange from "./exchange/CreateExchange.vue";
  import CreateQueue from "./queue/CreateQueue.vue";
</script>
<style lang="scss" scoped>
  .body {
    width: 100%;
  }
</style>

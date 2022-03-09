<template>
  <div class="body df jcsb">
    <iframe id="iframe" src="http://192.168.0.156:8081/"></iframe>
  </div>
</template>

<script lang="ts" setup>
  // const iframe = docum;
  import UNodeMQ, { Exchange, Queue } from "&/index";
  const unmq = new UNodeMQ({}, {});
</script>
<style lang="scss" scoped>
  .body {
    width: 100%;
  }
</style>

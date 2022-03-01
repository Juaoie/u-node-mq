<template>
  <div class="exchange">
    <span>名称：{{value}}</span>
  </div>
</template>

<script setup lang="ts">
  import UNodeMQ from "&/UNodeMQ";
  const props = defineProps({
    value: UNodeMQ,
  });
</script>
<style lang="scss" scoped>
  .exchange {
    border-radius: 8px;
    border: 1px solid #ccc;
  }
</style>

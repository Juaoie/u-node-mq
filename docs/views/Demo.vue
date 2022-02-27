<template>
  <div class="body df">
    <div class="exchange">
      <el-button type="primary">创建交换机</el-button>
    </div>

    <div class="queue"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    setup() {},
  });
</script>
<style lang="scss" scoped>
  .body {
    width: 100%;
    .exchange {
      padding: 20px;
      height: 100px;
      min-width: 400px;
      background: #e6a23c;
    }
    .queue {
      height: 100%;
      min-width: 400px;
      background: #67c23a;
    }
  }
</style>

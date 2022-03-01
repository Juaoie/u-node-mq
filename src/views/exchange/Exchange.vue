<template>
  <el-card class="exchange" :header="value.getExchangeName()">
    <div v-if="value.getExchangeRepeater()">
      <span>动态路由：{{ value.getExchangeRepeater() }}</span>
    </div>
    <div v-else class="mt20">
      <el-select
        :modelValue="value.getExchangeRoutes()"
        @change="res => value.pushExchangeRoutes(res)"
        multiple
        placeholder="请选择队列（填写动态路由后，静态路由将失效）"
      >
        <el-option v-for="item in queueNameList" :value="item"></el-option>
      </el-select>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { queueNameList } from "../queue/QueueData";

  import UNodeMQ from "../../../unmq/index";
  const props = defineProps({
    value: UNodeMQ,
  });
  console.log(props.value.getAllQueueNameList());
</script>
<style lang="scss" scoped>
  .exchange {
  }
</style>

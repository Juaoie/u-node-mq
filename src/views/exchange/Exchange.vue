<template>
  <el-card class="exchange">
    <template #header>
      <div class="df aic jcsb">
        <span>{{ value.getExchangeName() }}</span>
        <el-button type="text" @click="removeExchange">删除</el-button>
      </div>
    </template>
    <div v-if="value.getExchangeRepeater()" class="mb20">
      <span>动态路由：{{ value.getExchangeRepeater() }}</span>
    </div>
    <div v-else class="mb20">
      <el-select
        class="w24"
        :modelValue="value.getExchangeRoutes()"
        @change="res => value.setExchangeRoutes(res)"
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
  const emit = defineEmits(["removeExchange"]);
  async function removeExchange() {
    await ElMessageBox.confirm("确定删除？");
    emit("removeExchange", props.value.getExchangeId());
  }
</script>
<style lang="scss" scoped></style>

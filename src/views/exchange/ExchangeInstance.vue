<template>
  <el-card class="exchange">
    <template #header>
      <div class="df aic jcsb">
        <span>ID:{{ exchange.getId() }}</span>
        <el-button type="text" @click="removeExchange">删除</el-button>
      </div>
    </template>
    <div v-if="exchange.getRepeater()" class="mb20">
      <span>动态路由：{{ exchange.getRepeater() }}</span>
    </div>
    <div v-else class="mb20 df aic">
      <span style="width: 100px">静态路由：</span>
      <el-select
        class="w24"
        :modelValue="exchange.getRoutes()"
        @change="res => exchange.setRoutes(res)"
        allow-create
        filterable
        default-first-option
        multiple
        placeholder="请输入队列名称"
      ></el-select>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { Exchange } from "&/src";
  interface Props {
    exchange: Exchange<string>;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(["removeExchange"]);
  async function removeExchange() {
    await ElMessageBox.confirm("确定删除？");
    emit("removeExchange", props.exchange.getId());
  }
</script>
<style lang="scss" scoped></style>

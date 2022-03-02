<template>
  <el-card class="exchange">
    <template #header>
      <div class="df aic jcsb">
        <span>{{ value.getName() }}</span>
        <el-button type="text" @click="removeExchange">删除</el-button>
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
  import { Queue } from "../../../unmq";
  const props = defineProps({
    value: Queue,
  });
  const emit = defineEmits(["removeQueue"]);
  async function removeExchange() {
    await ElMessageBox.confirm("确定删除？");
    emit("removeQueue", props.value.getId());
  }
</script>
<style lang="scss" scoped></style>

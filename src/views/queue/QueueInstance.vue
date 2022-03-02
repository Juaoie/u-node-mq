<template>
  <el-card class="exchange">
    <template #header>
      <div class="df aic jcsb">
        <span>{{ queue.getName() }}</span>
        <el-button type="text" @click="removeExchange">删除</el-button>
      </div>
    </template>
    <el-button @click="sendNews">发送固定消息</el-button>
  </el-card>
</template>

<script setup lang="ts">
  import { News, Queue } from "../../../unmq/src";
  import { queueCollection } from "&/src/core";

  interface Props {
    queue: Queue<string>;
  }
  const props = defineProps<Props>();
  async function removeExchange() {
    await ElMessageBox.confirm("确定删除？");
    queueCollection.removeQueueById(props.queue.getId());
  }

  function sendNews() {
    const news = new News<string>("来自直接发送给队列的消息");
    props.queue.pushNews(news);
  }
</script>
<style lang="scss" scoped></style>

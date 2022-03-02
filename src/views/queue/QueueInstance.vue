<template>
  <el-card class="exchange">
    <template #header>
      <div class="df aic jcsb">
        <span>{{ queue.getName() }}</span>
        <el-button type="text" @click="removeExchange">删除</el-button>
      </div>
    </template>

    <div class="mb20">
      <el-button @click="sendNews">发送固定消息</el-button>
    </div>

    <div class="mb20">
      <span>是否需要消息确定</span>
      <el-switch v-model="queue.ask" />
    </div>
    <div class="mb20">
      <span>是否需要消息确定</span>
      <el-input-number v-model="queue.rcn" :min="0" />
    </div>

    <div class="mb20">
      <span>消息列表</span>
      <div class="content-list">
        <div v-for="item in queue.getNews()" class="content fp">
          <span>{{ item.content }}</span>
          <i class="el-icon-close"></i>
        </div>
      </div>
    </div>
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
<style lang="scss" scoped>
  .content-list {
    border: #ccc solid 1px;
    padding: 10px 0;
    border-radius: 4px;
    overflow-x: auto;
    width: 100%;
    text-align: right;
    white-space: nowrap;
    .content {
      display: inline-block;
      width: 50px;
      padding: 4px 6px;
      background-color: #409eff;
      color: #fff;
      font-size: 12px;
      margin-right: 10px;
      border-radius: 4px;
    }
  }
</style>

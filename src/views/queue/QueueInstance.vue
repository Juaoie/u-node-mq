<template>
  <el-card class="queue">
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

    <div class="mb20 df ffcn box" v-for="item in queue.getConsumerList()" :key="item.getId()">
      <el-button type="warning" @click="removeConsumer(item.getId())">删除</el-button>
      <span>消费方法：{{ item.consume }}</span>
      <span v-if="item.payload">固定载体：{{ item.payload }}</span>
      <span v-else>无固定载体</span>
    </div>

    <div class="mb20">
      <el-input type="textarea" v-model="code" placeholder="填入消费者方法，接受消息和固定载体值"></el-input>
      <el-input v-model="payload" placeholder="填入固定载体，每次会以第三个参数传递给消费方法"></el-input>
      <el-button @click="addConsumer">添加消费者</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { Consumer, News, Queue } from "&/src";
  import { queueCollection } from "&/src/core";
  import { ref } from "vue";

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

  const code = ref("()=>{}");
  const payload = ref("");
  function addConsumer() {
    try {
      const consume = eval(code.value);
      if (typeof consume !== "function") return ElNotification.error({ title: "错误", message: "请填入消费者方法，接受消息和固定载体值" });
      const consuemr = new Consumer<string>(consume, payload.value);
      props.queue.pushConsumer(consuemr);
      code.value = "()=>{}";
      payload.value = "";
    } catch (error) {
      return ElMessage({ message: error, type: "error" });
    }
  }
  function removeConsumer(consumerId) {
    props.queue.removeConsumerById(consumerId);
  }
</script>
<style lang="scss" scoped>
  .queue {
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
    .box {
      border-radius: 4px;
      border: #aaa solid 1px;
      padding: 20px;
    }
  }
</style>

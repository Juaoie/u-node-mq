<template>
  <div class="df ffcn create-queue">
    <el-button type="primary" @click="showCreateQueue = true">创建队列</el-button>
    <queue-instance v-for="item in queueCollectionRef.getQueueList()" :key="item.getId()" :queue="item" class="mt10"></queue-instance>
  </div>
  <el-dialog v-model="showCreateQueue" title="创建交换机">
    <el-form :model="form">
      <el-form-item label="交换机名称（Exchange）">
        <el-input v-model="form.queueName" placeholder="请输入交换机名称"></el-input>
      </el-form-item>
      <el-form-item label="是否需要消息确定">
        <el-switch v-model="form.ask" />
      </el-form-item>
      <el-form-item label="可重复消费次数">
        <el-input-number v-model="form.rcn" :min="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateQueue = false">取消</el-button>
        <el-button type="primary" @click="createQueue">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { Consumer, Queue } from "&/src";
  import { ref } from "vue";
  import QueueInstance from "./QueueInstance.vue";
  import { queueCollection } from "&/src/core";
  const queueCollectionRef = ref(queueCollection);

  const showCreateQueue = ref(false);
  const form = ref({
    queueName: "",
    ask: false,
    rcn: 3,
  });

  function createQueue() {
    if (form.value.queueName === "") return ElNotification.error({ title: "错误", message: "请输入队列名称" });
    const queue = new Queue({ name: form.value.queueName, ask: form.value.ask, rcn: form.value.rcn });
    queueCollectionRef.value.pushQueue(queue);
    const consumer = new Consumer(data => {
      console.log(data);
    });
    queue.pushConsumer(consumer);
    showCreateQueue.value = false;
  }
</script>
<style lang="scss" scoped>
  .create-queue {
    padding: 20px;
    min-height: 100px;
    min-width: 40%;
    background: #67c23a;
    border-radius: 8px;
  }
</style>

<template>
  <div class="df ffcn create-queue">
    <el-button type="primary" @click="showCreateQueue = true">创建队列</el-button>
    <queue-instance v-for="item in queueList" :key="item.getId()" :queue="item" class="mt10" @removeQueue="removeQueue"></queue-instance>
  </div>
  <el-dialog v-model="showCreateQueue" title="创建交换机">
    <el-form :model="form">
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
  import { Queue } from "&/index";
  import { ref } from "vue";
  import QueueInstance from "./QueueInstance.vue";
  const queueList = ref<Queue<string>[]>([]);

  const showCreateQueue = ref(false);
  const form = ref({
    queueName: "",
    ask: false,
    rcn: 3,
  });

  function createQueue() {
    const queue = new Queue<string>({ ask: form.value.ask, rcn: form.value.rcn });
    queueList.value.push(queue);
    showCreateQueue.value = false;
  }

  function removeQueue(queueId) {
    queueList.value.splice(
      queueList.value.findIndex(queue => queue.getId() === queueId),
      1,
    );
  }
</script>
<style lang="scss" scoped>
  .create-queue {
    padding: 20px;
    min-height: 100px;
    width: 40%;
    background: #67c23a;
    border-radius: 8px;
  }
</style>

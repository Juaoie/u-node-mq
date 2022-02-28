<template>
  <div class="create-exchange">
    <el-button type="primary" @click="showCreateExchange = true">创建交换机</el-button>
  </div>
  <el-dialog v-model="showCreateExchange" title="创建交换机">
    <el-form :model="form">
      <el-form-item label="交换机名称（Exchange）">
        <el-input v-model="form.exchangeName" placeholder="请输入交换机名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateExchange = false">取消</el-button>
        <el-button type="primary" @click="showCreateExchange = false">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  const showCreateExchange = ref(false);
  const form = ref({
    exchangeName: "exchange",
  });
</script>
<style lang="scss" scoped>
  .create-exchange {
    padding: 20px;
    height: 100px;
    min-width: 400px;
    background: #e6a23c;
  }
</style>

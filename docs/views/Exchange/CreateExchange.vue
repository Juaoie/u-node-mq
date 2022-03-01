<template>
  <div class="create-exchange">
    <el-button type="primary" @click="showCreateExchange = true">创建交换机</el-button>
  </div>
  <exchange v-for="item in exchangeList"></exchange>
  <el-dialog v-model="showCreateExchange" title="创建交换机">
    <el-form :model="form">
      <el-form-item label="交换机名称（Exchange）">
        <el-input v-model="form.exchangeName" placeholder="请输入交换机名称"></el-input>
      </el-form-item>
      <el-form-item label="静态路由（routes）">
        <el-select v-model="form.routes" multiple placeholder="请选择交换机（填写动态路由后，静态路由将失效）">
          <el-option v-for="item in queueNameList" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="动态路由（repeater）">
        <el-input type="textarea" v-model="form.repeater" placeholder="请填写动态路由代码（填写动态路由后，静态路由将失效）"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showCreateExchange = false">取消</el-button>
        <el-button type="primary" @click="createExchange">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import Exchange from "./Exchange.vue";
  import { queueNameList } from "../queue/QueueData";
  import { ref } from "vue";
  import UNodeMQ from "../../../src/UNodeMQ";
  const showCreateExchange = ref(false);
  const form = ref({
    exchangeName: "exchange",
    routes: [],
    repeater: `
    (queueName)=>queueName;
    `,
  });

  const exchangeList = [];

  function createExchange() {
    const unmq = new UNodeMQ({ exchangeName: form.value.exchangeName });
    try {
      unmq.setRepeater(eval(form.value.repeater));
    } catch (error) {
      return ElMessage({ message: error, type: "error" });
    }
    unmq.pushRoutes(form.value.routes);

    showCreateExchange.value = false;

    exchangeList.push(unmq);
    console.log("🚀 ~ file: CreateExchange.vue ~ line 44 ~ createExchange ~ unmq", unmq);
  }
</script>
<style lang="scss" scoped>
  .create-exchange {
    padding: 20px;
    height: 100px;
    min-width: 400px;
    background: #e6a23c;
  }
</style>

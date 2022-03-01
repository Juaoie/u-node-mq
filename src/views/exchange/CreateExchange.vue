<template>
  <div class="df ffcn create-exchange">
    <el-button type="primary" @click="showCreateExchange = true">创建交换机</el-button>
    <exchange v-for="item in exchangeList" :value="item" class="mt10"></exchange>
  </div>
  <el-dialog v-model="showCreateExchange" title="创建交换机">
    <el-form :model="form">
      <el-form-item label="交换机名称（Exchange）">
        <el-input v-model="form.exchangeName" placeholder="请输入交换机名称"></el-input>
      </el-form-item>
      <el-form-item label="静态路由（routes）">
        <el-select v-model="form.routes" multiple placeholder="请选择队列（填写动态路由后，静态路由将失效）">
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
  import UNodeMQ from "../../../unmq/index";
  const showCreateExchange = ref(false);
  const form = ref({
    exchangeName: "",
    routes: [],
    repeater: `
    (queueName)=>queueName;
    `,
  });

  const exchangeList = ref([]);

  function createExchange() {
    const unmq = new UNodeMQ({ exchangeName: form.value.exchangeName });
    try {
      unmq.setRepeater(eval(form.value.repeater));
    } catch (error) {
      return ElMessage({ message: error, type: "error" });
    }
    unmq.pushExchangeRoutes(form.value.routes);
    console.log("🚀 ~ file: CreateExchange.vue ~ line 53 ~ createExchange ~ form.value.routes", form.value.routes)
    console.log("🚀 ~ file: CreateExchange.vue ~ line 53 ~ createExchange ~ unmq", unmq)

    showCreateExchange.value = false;

    exchangeList.value.push(unmq);
    form.value.exchangeName = "";
    form.value.routes = [];
    form.value.repeater = `
    (queueName)=>queueName;
    `;
  }
</script>
<style lang="scss" scoped>
  .create-exchange {
    padding: 20px;
    min-height: 100px;
    min-width: 400px;
    background: #e6a23c;
  }
</style>

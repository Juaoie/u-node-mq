<template>
  <div class="df ffcn create-exchange">
    <el-button type="primary" @click="showCreateExchange = true">创建交换机</el-button>
    <exchange-instance v-for="item in exchangeList" :modelValue="item" class="mt10" @removeExchange="removeExchange"></exchange-instance>
  </div>
  <el-dialog v-model="showCreateExchange" title="创建交换机">
    <el-form :model="form">
      <el-form-item label="交换机名称（Exchange）">
        <el-input v-model="form.exchangeName" placeholder="请输入交换机名称"></el-input>
      </el-form-item>
      <el-form-item label="静态路由（routes）">
        <el-select
          v-model="form.routes"
          allow-create
          filterable
          default-first-option
          multiple
          placeholder="请输入队列名称（填写动态路由后，静态路由将失效）"
        ></el-select>
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
  import ExchangeInstance from "./ExchangeInstance.vue";
  import { ref } from "vue";
  import { Exchange } from "../../../unmq/dist";
  const showCreateExchange = ref(false);
  const form = ref({
    exchangeName: "",
    routes: [],
    repeater: `
    (queueName)=>queueName;
    `,
  });

  const exchangeList = ref<Exchange<string>[]>([]);

  function createExchange() {
    if (form.value.exchangeName === "") return ElNotification.error({ title: "错误", message: "请输入交换机名称" });

    const exchange = new Exchange({ name: form.value.exchangeName });
    try {
      exchange.setRepeater(eval(form.value.repeater));
    } catch (error) {
      return ElMessage({ message: error, type: "error" });
    }
    exchange.pushRoutes(form.value.routes);

    showCreateExchange.value = false;

    exchangeList.value.push(exchange);
  }

  function removeExchange(exchangeId) {
    exchangeList.value.splice(
      exchangeList.value.findIndex(exchange => exchange.getId() === exchangeId),
      1,
    );
  }
</script>
<style lang="scss" scoped>
  .create-exchange {
    padding: 20px;
    min-height: 100px;
    min-width: 40%;
    background: #e6a23c;
    border-radius: 8px;
  }
</style>

<template>
  <el-container>
    <el-header class="df aic jcsb">
      <!-- <img src="@a/unmq.png" class="logo" />
      <div>
        <span>这里放点什么好呢</span>
      </div> -->
    </el-header>
    <el-container>
      <el-aside class="df ffcn">
        <!-- <div class="sidebar-link">
          <span>演示</span>
        </div> -->
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
  import UNodeMQ from "../../src/UNodeMQ";
  const unmq = new UNodeMQ();
  console.log("🚀 ~ file: Home.vue ~ line 6 ~ unmq", unmq);
</script>
<style lang="scss" scoped>
  .el-header {
    border-bottom: 1px solid #ccc;
    .logo {
      width: 100px;
    }
  }
  .el-aside {
    width: 200px;
    padding: 10px 20px;
    border-right: 1px solid #ccc;
    .sidebar-link {
      padding: 20px 0;
      font-size: 22px;
      font-weight: 600;
    }
  }
</style>

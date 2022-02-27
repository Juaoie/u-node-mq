<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <div class="body df">
          <div class="exchange"></div>

          <div class="queue"></div>
        </div>
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
  .body {
    width: 100%;
    min-height: 100vh;
    .exchange {
      height: 100px;
      min-width: 400px;
      background: #e6a23c;
    }
    .queue {
      height: 100%;
      min-width: 400px;
      background: #67c23a;
    }
  }
</style>

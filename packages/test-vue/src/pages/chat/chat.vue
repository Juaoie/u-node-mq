<template>
  <div class="chat">
    <router-view ref="tabChat" />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {
    this.connect();
    Notification.requestPermission();
  },
  methods: {
    async connect() {
      let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      if (!userInfo) return;
      const loading = this.$loading({
        lock: true,
        text: "连接中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      const client = await this.$client(this.errorCallBack);
      this.$refs.tabChat.client = client;
      this.$subscribe(client, this);
      loading.close();
    },
    /**
     * 连接成功的回调函数
     *  */
    subscribeCallBack() {},
    /**
     * 连接失败的回调函数
     */
    errorCallBack() {
      setTimeout(() => this.connect(), 4000);
    },
  },
};
</script>

<style scoped>
.chat {
  width: 100vw;
  height: 100vh;
}
</style>

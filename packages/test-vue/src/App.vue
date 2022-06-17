<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {};
  },
  components: {},
  async created() {
    let userInfo = sessionStorage.getItem("userInfo");
    if (userInfo) {
      this.$router.replace("/chat/tabChat/mailListChat");
    } else {
      this.$router.replace("/login");
    }
  },
  methods: {},
  mounted() {
    document.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
  },
};
</script>

<style>
body {
  margin: 0;
}
.tooltip {
  padding: 3px !important;
  border-radius: 0 !important;
  box-shadow: 5px 5px 5px #888888;
}
</style>

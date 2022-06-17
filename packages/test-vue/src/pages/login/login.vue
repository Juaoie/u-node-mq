<template>
  <div class="df">
    <el-image fit="cover" class="login-image" :src="imageUrl" :class="inputFocus ? 'input-focus' : ''">
      <el-image slot="error" fit="cover" class="login-image" :src="imageErrorUrl"></el-image>
      <!-- <el-image slot="placeholder" fit="cover" class="login-image" :src="imageErrorUrl" /> -->
    </el-image>
    <div class="login-view" @contextmenu.prevent="setting">
      <div class="left-view df aic jcc animated bounceInDown" v-if="animation">
        <router-view @inputFocus="res => (inputFocus = res)" />
      </div>
    </div>
    <el-dialog title="设置" :visible.sync="showSetting" :before-close="() => ((inputFocus = false), (showSetting = false))" class="dialog-setting">
      <div class="dialog-body">
        <img src="@/assets/image/en-cn.png" alt="" />
      </div>
    </el-dialog>
    <div class="drop-down-login df ffcn aic animated bounceInDown" :class="$route.path == '/login/loginUser' ? '' : 'rope-shrink'">
      <img class="rope" src="@/assets/image/rope.png" alt="" />
      <router-link to="/login/loginUser" replace>
        <img title="Sign in" class="head" src="@/assets/image/a.png" />
      </router-link>
    </div>
    <div class="drop-down-register df ffcn aic animated bounceInDown" :class="$route.path == '/login/registerUser' ? '' : 'rope-shrink'">
      <img class="rope" src="@/assets/image/rope.png" alt="" />
      <router-link to="/login/registerUser" replace>
        <img title="Sign up" class="head" src="@/assets/image/b.png" />
      </router-link>
    </div>
    <div class="drop-down-forget df ffcn aic animated bounceInDown" :class="$route.path == '/login/forgetUser' ? '' : 'rope-shrink'">
      <img class="rope" src="@/assets/image/rope.png" alt="" />
      <router-link to="/login/forgetUser" replace>
        <img title="Forgot password" class="head" src="@/assets/image/c.png" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { request } from "http";
import { PROJECT_URL } from "@/utils/path";
export default {
  data() {
    return {
      imageUrl: PROJECT_URL + "/user/file/getBingRandomImageBuffer",
      imageErrorUrl: require("@/assets/image/login-bg.jpg"),
      inputFocus: false, //输入框是否获取到了焦点
      animation: true, //是否触发动画效果
      showSetting: false, //是否显设置弹窗
    };
  },
  created() {
    this.$router.replace("/login/loginUser");
  },
  mounted() {},
  watch: {
    async "$route.path"() {
      this.animation = false;
      await this.$nextTick();
      this.animation = true;
    },
  },
  methods: {
    setting() {
      this.showSetting = true;
      this.inputFocus = true;
    },
  },
};
</script>

<style scoped>
.dialog-body > img {
  width: 50px;
  height: 50px;
}
.dialog-setting >>> .el-dialog {
  width: 400px;
  border-radius: 20px;
  height: 500px;
}
.dialog-setting >>> .el-icon-close {
  font-size: 25px;
}
.dialog-setting >>> .el-icon-close:hover {
  color: #b45df2;
}
.drop-down-forget {
  transition: all 0.8s;
  position: fixed;
  z-index: 900;
  right: 100px;
  top: 0;
}
.drop-down-register {
  transition: all 0.8s;
  position: fixed;
  z-index: 900;
  right: 200px;
  top: 0;
}

.drop-down-login {
  transition: all 0.8s;
  position: fixed;
  z-index: 900;
  right: 300px;
  top: 0;
}
.head {
  width: 70px;
  height: 70px;
  position: relative;
  top: -20px;
  cursor: pointer;
}

.head:hover {
  animation: move 2.5s ease 0s infinite;
  transform-origin: top;
}

@keyframes move {
  5% {
    transform: rotate(6deg);
  }
  10% {
    transform: rotate(-6deg);
  }
  15% {
    transform: rotate(6deg);
  }
  20% {
    transform: rotate(-6deg);
  }
  25% {
    transform: rotate(6deg);
  }
  30% {
    transform: rotate(-6deg);
  }
  35% {
    transform: rotate(0deg);
  }
}

.rope-shrink {
  top: -60px;
}
.rope {
  width: 20px;
  height: 100px;
}
.input-focus {
  filter: blur(10px);
  transform: scale(1.1);
}
.login-image {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  transition: opacity 1s, transform 0.25s, filter 0.25s;
  backface-visibility: hidden;
  z-index: -3;
  position: fixed;
  left: 0;
  top: 0;
}
.login-view {
  background-image: radial-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
  position: fixed;
  z-index: 888;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.left-view {
  background-color: rgba(0, 106, 180, 0.4);
  position: fixed;
  z-index: 999;
  top: -20vh;
  padding: 35vh 0 15vh 0;
  left: 10vw;
  width: 35vw;
  border-end-end-radius: 80px;
  border-end-start-radius: 10px;
}
</style>

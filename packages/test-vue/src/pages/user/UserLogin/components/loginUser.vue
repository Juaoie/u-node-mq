<template>
  <div class="login-user-view df ffcn aic">
    <input
      autocomplete="off"
      class="input"
      :class="mailboxFocus ? 'input-focus' : 'input-no-focus'"
      placeholder="E-mail"
      type="text"
      v-model="userMailboxId"
      :autofocus="true"
      @focus="mailboxFocus = true"
      @blur="mailboxFocus = false"
      @keydown.enter="userLogin"
    />

    <input
      autocomplete="off"
      class="input"
      :class="passwordFocus ? 'input-focus' : 'input-no-focus'"
      placeholder="Password"
      type="password"
      v-model="userPassword"
      :autofocus="false"
      @focus="passwordFocus = true"
      @blur="passwordFocus = false"
      @keydown.enter="userLogin"
    />

    <input @click="userLogin" class="button-input" type="button" value="Sign in" />
    <!-- <el-card>
            <el-row type="flex" justify="space-between" slot="header">
                <h4 class="m0">用户登录</h4>
                <router-link to="/login/registerUser" replace>注册</router-link>
            </el-row>

            <el-row>
                <el-input
                    class="input"
                    size="large"
                    v-model="userMailboxId"
                    autofocus
                    placeholder="请输入邮箱地址"
                >
                    <template slot="prepend">
                        <span>登录邮箱</span>
                    </template>
                </el-input>
            </el-row>

            <el-row>
                <el-input
                    class="input mt20"
                    size="large"
                    v-model="userPassword"
                    type="password"
                    placeholder="请输入登录密码"
                >
                    <template slot="prepend">
                        <span>登录密码</span>
                    </template>
                </el-input>
            </el-row>

            <el-row class="mt20 df aic jcfe">
                <router-link to="/login/forgetUser" replace>忘记密码？</router-link>
            </el-row>

            <el-row class="df aic jcc mt20">
                <el-button @click="userLogin" class="button" type="primary" size="large">登录</el-button>
            </el-row>
        </el-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      userMailboxId: "", //输入的电子邮箱
      userPassword: "", //用户密码
      mailboxFocus: false, //user输入框是否聚焦
      passwordFocus: false, //密码输入框是否聚焦
    };
  },
  async created() {},
  async mounted() {},
  computed: {
    inputFocusChange() {
      const { mailboxFocus, passwordFocus } = this;
      return mailboxFocus || passwordFocus;
    },
  },
  watch: {
    inputFocusChange(inputFocus) {
      this.$emit("inputFocus", inputFocus);
    },
  },
  methods: {
    async userLogin() {
      const regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (!regEmail.test(this.userMailboxId)) return this.$message.warning("邮箱格式不正确");
      const regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
      if (!regPassword.test(this.userPassword)) return this.$message.warning("密码需为字母和数字的组合的8-18位字符！");
      const loading = this.$loading({
        lock: true,
        text: "连接中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        const userInfo = await this.http.postUserLogin({
          userMailboxId: this.userMailboxId,
          userPassword: this.userPassword,
        });
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        this.$router.replace("/chat/tabChat/mailListChat");
      } catch (error) {
      } finally {
        loading.close();
      }
    },
  },
};
</script>

<style scoped>
.login-user-view {
  width: 80%;
}
@keyframes button-input-move {
  25% {
    box-shadow: 10px -4px #bd2df5, 10px -4px 4px rgba(0, 0, 0, 0.3), 20px 4px #1d89ff, 20px 4px 2px rgba(0, 0, 0, 0.3), 30px -8px #feab3a,
      30px -8px 2px rgba(0, 0, 0, 0.3), -10px 8px #ff5964, -10px 8px 2px rgba(0, 0, 0, 0.3), -20px -8px #28b78d, -20px -8px 2px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: -10px -4px #28b78d, -10px -4px 2px rgba(0, 0, 0, 0.3), -20px 4px #bd2df5, -20px 4px 2px rgba(0, 0, 0, 0.3), -30px -8px #1d89ff,
      -30px -8px 2px rgba(0, 0, 0, 0.3), 10px 8px #feab3a, 10px 8px 2px rgba(0, 0, 0, 0.3), 20px -8px #ff5964, 20px -8px 2px rgba(0, 0, 0, 0.3);
  }
  75% {
    box-shadow: -10px 4px #ff5964, -10px 4px 2px rgba(0, 0, 0, 0.3), -20px -4px #28b78d, -20px -4px 2px rgba(0, 0, 0, 0.3), -30px 8px #bd2df5,
      -30px 8px 2px rgba(0, 0, 0, 0.3), 10px -8px #1d89ff, 10px -8px 2px rgba(0, 0, 0, 0.3), 20px 8px #feab3a, 20px 8px 2px rgba(0, 0, 0, 0.3);
  }
}
.button-input {
  margin-top: 30px;
  cursor: pointer;
  text-decoration: none;
  padding: 4px 30px;
  border-radius: 30px;
  color: #f35626;
  font-weight: 700;
  font-size: 30px;
  box-shadow: 10px 4px #1d89ff, 10px 4px 2px rgba(0, 0, 0, 0.3), 20px -4px #feab3a, 20px -4px 2px rgba(0, 0, 0, 0.3), 30px 8px #ff5964,
    30px 8px 2px rgba(0, 0, 0, 0.3), -10px -8px #28b78d, -10px -8px 2px rgba(0, 0, 0, 0.3), -20px 8px #bd2df5, -20px 8px 2px rgba(0, 0, 0, 0.3);

  animation: button-input-move 4s linear infinite;
}
.input {
  width: 45%;
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  outline: none;
  border: none;
  padding: 10px 15px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  background-color: rgba(255, 255, 255, 0.25);
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;
  transition: color 0.25s, background-color 0.25s, box-shadow 0.25s, left 0.25s, opacity 0.25s, top 0.25s, width 0.25s;
  font-size: small;
  font-weight: 400;
  font-family: microsoft yahei, sans-serif;
  text-align: center;
}
.input::placeholder {
  text-align: center;
}
.input-no-focus:hover::placeholder {
  color: #646464;
  text-shadow: 0 0 10px transparent;
}
.input-no-focus:hover {
  color: black;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: rgba(0, 0, 0, 0.3) 0 0 10px;
  width: 80%;
}
.input-focus {
  width: 95%;
  color: #000;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px;
}
.input-focus::placeholder {
  color: transparent;
  text-shadow: none;
}
</style>

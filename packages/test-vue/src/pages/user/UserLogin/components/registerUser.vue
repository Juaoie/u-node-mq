<template>
  <div class="register-user-view df ffcn aic">
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
    <span class="send-code" id="baiduSearchOpt">发送验证码</span>
    <!--         
        <el-card>
            <el-row type="flex" justify="space-between" slot="header">
                <h4 class="m0">用户注册</h4>
                <router-link to="/login/loginUser" replace>登录</router-link>
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
                        <span>注册邮箱</span>
                    </template>
                </el-input>
            </el-row>

            <el-row>
                <el-input
                    class="input mt20"
                    size="large"
                    v-model="emailCode"
                    placeholder="请输入邮箱验证码"
                    :maxlength="6"
                    prepend-button
                >
                    <template slot="append">
                        <span
                            @click="sendUserEmailCode"
                        >{{typeof emailCodeText==="string"?emailCodeText:emailCodeText+"s后可以重发"}}</span>
                    </template>
                </el-input>
            </el-row>

            <el-row>
                <el-input
                    class="input mt20"
                    :maxlength="18"
                    size="large"
                    v-model="userPassword"
                    placeholder="请输入登录密码"
                >
                    <template slot="prepend">
                        <span>用户密码</span>
                    </template>
                </el-input>
            </el-row>

            <el-row>
                <el-input
                    class="input mt20"
                    :maxlength="10"
                    size="large"
                    v-model="userName"
                    placeholder="请输入用户名称"
                >
                    <template slot="prepend">
                        <span>用户名称</span>
                    </template>
                </el-input>
            </el-row>

            <el-row class="df aic jcc mt20">
                <el-button @click="registerUser" class="button" type="primary" size="large">注册</el-button>
            </el-row>
        </el-card> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailCodeText: "发送邮箱验证码", //发送邮件倒计时
      userMailboxId: "", //输入的电子邮箱
      emailCode: "", //电子邮箱验证码
      userPassword: "", //用户密码
      userName: "", //用户名称
      mailboxFocus: false, //user输入框是否聚焦
    };
  },
  methods: {
    //点击注册用户触发
    async registerUser() {
      let regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (!regEmail.test(this.userMailboxId)) {
        this.$message.warning("邮箱格式不正确");
        return;
      }
      if (this.emailCode.length !== 6) {
        this.$message.warning("验证码长度需为6位数字！");
        return;
      }
      let regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
      if (!regPassword.test(this.userPassword)) {
        this.$message.warning("密码需为字母和数字的组合的8-18位字符！");
        return;
      }
      if (this.userName.length < 2) {
        this.$message.warning("名称最短需要两个字符");
        return;
      }
      await this.$post("/user/user/registerUser", {
        userMailboxId: this.userMailboxId,
        emailCode: this.emailCode,
        userPassword: this.userPassword,
        userName: this.userName,
      });
      this.$alert("点击确定返回登录！", "注册成功", {
        confirmButtonText: "确定",
        callback: action => {
          this.$router.replace("/login/loginUser");
        },
      });
    },
    //点击发送邮箱验证码触发
    async sendUserEmailCode() {
      if (typeof this.emailCodeText !== "string") return;
      let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
      if (!reg.test(this.userMailboxId)) {
        this.$Message.warning("邮箱格式不正确");
        return;
      }
      this.emailCodeText = 60;
      try {
        await this.$post("/user/user/sendUserEmailCode", {
          userMailboxId: this.userMailboxId,
        });
      } catch (e) {
        this.emailCodeText = "发送邮箱验证码";
      }

      let timeId = setInterval(() => {
        if (this.emailCodeText === 0) {
          this.emailCodeText = "发送邮箱验证码";
          clearInterval(timeId);
        } else {
          this.emailCodeText--;
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
.send-code {
  position: relative;
  padding: 5px 30px;
  margin-left: 5px;
  margin-right: 5px;
  background-color: #fff;
  border-radius: 20px;
  transition: all 0.25s;
  cursor: pointer;
}
.register-user-view {
  width: 80%;
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

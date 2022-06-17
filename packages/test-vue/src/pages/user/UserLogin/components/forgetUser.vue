<template>
  <div>
    <el-card>
      <el-row type="flex" justify="space-between" slot="header">
        <h4 class="m0">忘记密码</h4>
        <router-link to="/login/loginUser" replace>登录</router-link>
      </el-row>

      <el-row>
        <el-input class="input" size="large" v-model="userMailboxId" autofocus placeholder="请输入邮箱地址">
          <template slot="prepend">
            <span>注册邮箱</span>
          </template>
        </el-input>
      </el-row>

      <el-row>
        <el-input class="input mt20" size="large" v-model="emailCode" placeholder="请输入邮箱验证码" :maxlength="6" prepend-button>
          <template slot="append">
            <span @click="sendUserEmailCode">{{ typeof emailCodeText === "string" ? emailCodeText : emailCodeText + "s后可以重发" }}</span>
          </template>
        </el-input>
      </el-row>

      <el-row>
        <el-input class="input mt20" :maxlength="18" size="large" v-model="userPassword" placeholder="请输入新的登录密码">
          <template slot="prepend">
            <span>新的密码</span>
          </template>
        </el-input>
      </el-row>

      <el-row class="df aic jcc mt20">
        <el-button @click="registerUser" class="button" type="primary" size="large">确定</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailCodeText: "发送邮箱验证码", //发送邮件倒计时
      userMailboxId: "", //输入的电子邮箱
      emailCode: "", //电子邮箱验证码
      userPassword: "", //用户新的密码
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
        this.$message.warning("新密码需为字母和数字的组合的8-18位字符！");
        return;
      }
      await this.$put("/user/user/updateUserPassword", {
        userMailboxId: this.userMailboxId,
        emailCode: this.emailCode,
        userPassword: this.userPassword,
      });
      this.$alert("点击确定返回登录！", "修改密码成功", {
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
.input {
  width: 350px;
}
.button {
  width: 250px;
}
</style>

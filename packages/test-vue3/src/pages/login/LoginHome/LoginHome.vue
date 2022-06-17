<template>
  <img v-if="mode === 'dark'" class="wallpaper" src="@a/img/wallpaper-night.jpg" :class="{ 'input-focus': focus }" />
  <img v-else class="wallpaper" src="@a/img/wallpaper-day.jpg" :class="{ 'input-focus': focus }" />
  <div class="page df aic jcc ffcn">
    <img class="avatar" src="@a/img/avatar.jpg" title="密码：123456" />
    <span class="user-name fp">{{ userName }}</span>
    <input
      class="password"
      v-model="password"
      type="password"
      :maxlength="16"
      placeholder="Enter Password"
      autofocus
      @focus="focus = true"
      @blur="focus = false"
      @input="submit"
      @keyup.enter="submit"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  const mode = 'dark'
  const userName = 'Gaojie Hu'

  const router = useRouter()

  const password = ref('')
  const focus = ref(false)

  async function submit() {
    //模拟登录
    if (password.value === '123456') router.push('/HomePage')
  }
</script>

<style lang="scss" scoped>
  .input-focus {
    filter: blur(10px);
    transform: scale(1.1);
  }
  .wallpaper {
    width: 100vw;
    height: 100vh;
    transition: transform 0.25s, filter 0.25s;
    position: fixed;
    z-index: -3;
    top: 0;
    left: 0;
    object-fit: cover;
  }
  .page {
    background-color: rgba(0, 0, 0, 0.1);
    position: absolute;
    z-index: 99;
    width: 100vw;
    height: 100vh;
    .avatar {
      margin-top: -15%;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      cursor: pointer;
      transition: 1s transform ease-in-out;
    }
    .avatar:hover {
      transform: scale(1.1) rotate(360deg);
    }
    .user-name {
      max-width: 300px;
      font-size: 20px;
      color: #fff;
      font-weight: 600;
      margin-top: 15px;
      line-height: 1.75rem;
      letter-spacing: 0.1rem;
      user-select: none;
    }
    .password {
      width: 250px;
      border: none;
      padding: 6px 12px;
      margin-top: 15px;
      outline: none;
      border-radius: 4px;
      background: rgba($color: #fff, $alpha: 0.4);
      &::placeholder {
        color: #fff;
      }
    }
  }
</style>

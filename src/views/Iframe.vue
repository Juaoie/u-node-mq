<template>
  <div class="body">
    <div>
      <h1>000000000000</h1>
      <button @click="sendMessage">点击发送消息给test2</button>
    </div>
    <iframe id="iframe" class="iframe" src="http://localhost:3000"></iframe>
  </div>
</template>

<script lang="ts" setup>
  // const iframe = docum;
  import UNodeMq, { IframeMessage, OtherIframe, SelfIframe, Exchange, Queue } from "&/index";
  const unmq = new UNodeMq({ test1: new Exchange({ routes: ["que1"] }) }, { que1: new Queue() });

  const iframeMessage = IframeMessage.createIframe("test0", new SelfIframe(), { test2: new OtherIframe() }, {});

  function sendMessage() {
    iframeMessage.emit("test2", "发送给test2的消息");
  }
  window.iframeMessage = iframeMessage;
</script>
<style lang="scss" scoped>
  .body {
    width: 100%;
    .iframe {
      width: 500px;
      height: 500px;
    }
  }
</style>

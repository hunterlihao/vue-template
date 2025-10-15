<script setup lang="ts">
import { tryOnUnmounted } from '@vueuse/core';
import { ref } from 'vue';

let sid = 'test';
let ws = new WebSocket(`ws://localhost:8100/ws/${sid}`);
let timer: any = null;
const isHandelClose = ref(1);
// 发送消息
const sendMsgBtn = () => {
  console.log('发送消息');
  ws.send('hello');
};

const closeWsBtn = () => {
  isHandelClose.value = 0;
  ws.close();
};

const openHandle = () => {
  console.log('连接成功');
};
const closeHandle = () => {
  console.log('连接关闭');
  if (isHandelClose.value === 1) {
    restartWs();
  }
};
const messageHandle = ({ data }) => {
  console.log(data);
};

ws.addEventListener('open', openHandle);
ws.addEventListener('close', closeHandle);
ws.addEventListener('message', messageHandle);

//重新建立连接
const restartWs = () => {
  console.log('重新建立连接');

  timer = setInterval(() => {
    console.log('重新建立连接中.........');
    ws = new WebSocket(`ws://localhost:8100/ws/${sid}`);
    if (ws.readyState === 0) {
      ws.addEventListener('open', openHandle);
      ws.addEventListener('close', closeHandle);
      ws.addEventListener('message', messageHandle);
      clearInterval(timer);
      timer = null;
    }
  }, 1000);
};
tryOnUnmounted(() => {
  ws.close();
  closeWsBtn();
});
</script>

<template>
  <el-card>
    <el-button @click="sendMsgBtn">发送消息</el-button>
    <el-button @click="closeWsBtn">关闭连接</el-button>
  </el-card>
</template>

<style scoped lang="scss"></style>

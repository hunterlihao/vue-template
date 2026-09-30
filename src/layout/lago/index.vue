<script lang="ts" setup>
// 引入标题与logo的配置文件
import setting from '@/setting.ts';
import { useRouter } from 'vue-router';

const router = useRouter();
const goToHome = () => {
  router.push('/home');
};
</script>

<script lang="ts">
export default {
  name: 'Logo',
};
</script>

<template>
  <div v-if="setting.showLogo" class="logo" @click="goToHome">
    <img :src="setting.logo" alt="logo" />
    <p class="logo-title">{{ setting.title }}</p>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  height: $base-menu-logo-height;
  padding: 0 16px;
  overflow: hidden; // 折叠时裁掉标题,而不是溢出到内容区
  cursor: pointer;

  img {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
  }

  .logo-title {
    margin-left: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: $base-logo-title-font-size;
    white-space: nowrap;
  }
}
</style>

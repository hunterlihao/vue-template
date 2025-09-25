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
  <div
    v-if="setting.logoHidden"
    class="logo"
    @click="goToHome"
    style="cursor: pointer"
  >
    <img :src="setting.logo" />
    <p style="white-space: nowrap; text-overflow: ellipsis">
      {{ setting.title }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  width: 50px;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 20px;

  img {
    width: 30px;
    height: 30px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>

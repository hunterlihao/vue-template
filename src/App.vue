<!--suppress SassScssResolvedByNameOnly -->
<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';

import { onMounted } from 'vue';
import { reqLogin } from '@/api/user';

onMounted(() => {
  reqLogin({
    username: 'admin',
    password: '111111',
  });
});
</script>

<template>
  <div class="box">
    <h1>我是app根组件</h1>
    <el-button type="primary" :icon="Plus">按钮</el-button>
    <!--suppress HtmlUnknownTag -->
    <svg-icon name="test"></svg-icon>
  </div>
</template>

<style scoped lang="scss">
.box {
  color: red;
  width: 600px;
  height: 600px;
  background-color: #fff;

  h1 {
    color: $base-menu-background;
  }
}
</style>

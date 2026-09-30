<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/home');
};
</script>

<template>
  <div class="error-container">
    <div class="content-wrapper">
      <!-- SVG 图片 -->
      <img alt="404" src="../../assets/status/404.svg" />

      <!-- 提示文字与按钮 -->
      <div class="text-section">
        <h2>抱歉，你访问的页面不存在</h2>
        <el-button type="primary" @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #f9f9f9;

  .content-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    align-items: center;
    justify-content: center;
    text-align: center;

    img {
      width: 400px;
      height: auto;
    }

    .text-section {
      h2 {
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
      }
    }
  }
}
</style>

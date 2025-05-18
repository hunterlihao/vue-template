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
  width: 100vw;
  height: 100vh;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;

  .content-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    flex-wrap: wrap;
    text-align: center;

    img {
      width: 400px;
      height: auto;
    }

    .text-section {
      h2 {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
    }
  }
}
</style>

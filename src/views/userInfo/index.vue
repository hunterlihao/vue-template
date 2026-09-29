<script setup lang="ts">
import BaseInfo from './components/BaseInfo.vue';
import PasswordForm from './components/PasswordForm.vue';
</script>

<template>
  <el-card>
    <el-tabs type="border-card">
      <!-- 用户信息标签页 -->
      <el-tab-pane label="基本信息">
        <BaseInfo />
      </el-tab-pane>

      <!-- 修改密码标签页 -->
      <el-tab-pane label="修改密码">
        <PasswordForm />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<style scoped lang="scss">
.el-tabs {
  box-shadow: none;
}
</style>

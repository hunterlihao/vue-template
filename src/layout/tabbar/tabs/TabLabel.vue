<script setup lang="ts">
/**
 * 标签页的标签内容(图标 + 标题)。
 * 原来这段结构在 tabs/index.vue 里写了两遍(固定首页 + 动态标签)。
 */
withDefaults(
  defineProps<{
    icon?: string;
    title?: string;
  }>(),
  {
    icon: 'Setting',
    title: '',
  },
);
</script>

<template>
  <div class="custom-tab-label">
    <el-icon class="custom-tab-icon">
      <component :is="icon" />
    </el-icon>
    <span>{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
.custom-tab-label {
  display: flex;
  align-items: center;

  .custom-tab-icon {
    margin-right: 4px;
    font-size: 16px;
  }
}
</style>

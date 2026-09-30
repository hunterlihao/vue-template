<template>
  <el-form :model="props.model" :inline="true" size="default" @submit.prevent>
    <!-- 各页面自己的查询条件 -->
    <slot></slot>
    <el-form-item>
      <el-button icon="Search" type="primary" plain @click="emit('search')">
        搜索
      </el-button>
      <el-button icon="Refresh" type="danger" plain @click="emit('reset')">
        重置
      </el-button>
      <!-- 页面自己的操作按钮(新增/导入/导出等) -->
      <slot name="actions"></slot>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
/**
 * 列表页查询条:统一 搜索/重置 按钮与间距。
 * 之前这段结构在 4 个列表页各写一遍。
 */
const props = defineProps<{
  /** 与 el-form 的 :model 对应 */
  model?: Record<string, unknown>;
}>();

const emit = defineEmits<{
  (e: 'search'): void;
  (e: 'reset'): void;
}>();
</script>

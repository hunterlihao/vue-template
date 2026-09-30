<template>
  <div class="table-empty">
    <img :src="notData" alt="暂无数据" />
    <p>{{ props.text }}</p>
  </div>
</template>

<script setup lang="ts">
import notData from '@/assets/images/notData.png';

/**
 * 表格空状态。
 * 用法:<template #empty><TableEmpty /></template>
 */
const props = withDefaults(defineProps<{ text?: string }>(), {
  text: '暂无数据',
});
</script>

<style lang="scss" scoped>
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;

  img {
    width: 120px;
    opacity: 0.6;
  }

  p {
    margin-top: 8px;
    font-size: 13px;
    color: $color-text-secondary;
  }
}
</style>

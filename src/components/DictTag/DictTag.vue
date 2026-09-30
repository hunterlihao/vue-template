<template>
  <el-tag v-if="item" :type="item.type" size="default" effect="dark">
    {{ item.label }}
  </el-tag>
  <span v-else>-</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DictItem } from '@/const/dict.ts';

/**
 * 按字典渲染状态标签。
 * 用法:<DictTag :value="row.sex" :dict="sexDict" />
 */
const props = defineProps<{
  value?: string | number | null;
  dict: Record<string, DictItem>;
}>();

const item = computed<DictItem | undefined>(() =>
  props.value === undefined || props.value === null
    ? undefined
    : props.dict[String(props.value)],
);
</script>

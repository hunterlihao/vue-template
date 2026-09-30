<template>
  <el-pagination
    class="table-pager"
    :current-page="props.current"
    :page-size="props.size"
    :page-sizes="props.pageSizes"
    :total="props.total"
    layout="total, sizes, prev, pager, next, jumper"
    background
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts">
/**
 * 列表分页:统一 page-sizes、layout 与上边距。
 * 原先这套属性在 4 个列表页里逐字重复。
 */
const props = withDefaults(
  defineProps<{
    current: number;
    size: number;
    total: number;
    pageSizes?: number[];
  }>(),
  {
    pageSizes: () => [5, 10, 15, 20, 25],
  },
);

const emit = defineEmits<{
  (e: 'update:size', value: number): void;
  (e: 'update:current', value: number): void;
}>();

function onSizeChange(value: number) {
  emit('update:size', value);
}

function onCurrentChange(value: number) {
  emit('update:current', value);
}
</script>

<style lang="scss" scoped>
.table-pager {
  margin-top: 10px;
}
</style>

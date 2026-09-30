<template>
  <el-select
    :model-value="props.modelValue"
    multiple
    placeholder="请选择"
    :style="selectStyle"
    @update:model-value="onChange"
    @remove-tag="onRemoveTag"
  >
    <el-option
      v-for="item in props.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
    <div class="is-all">
      <div @click="selectAll">全选</div>
      <div @click="invert">反选</div>
    </div>
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/**
 * 多选下拉(带全选/反选)。
 *
 * 与旧实现的区别:
 *  - 改成标准 v-model(modelValue / update:modelValue),不再用 bindValue + selected
 *  - 不再修改 props.options 里的 check 字段(改 props 会导致父子状态互相污染)
 *  - 反选是真正的取差集,勾选状态与选中值不会再分叉
 *  - width 是响应式的;样式改为 scoped,不再全局泄漏 .is-all
 */
export interface SelectOption {
  value: string | number;
  label: string;
}

const props = withDefaults(
  defineProps<{
    /** 已选值 */
    modelValue?: Array<string | number>;
    /** 下拉数据 */
    options?: SelectOption[];
    /** 选择器宽度(px) */
    width?: number;
  }>(),
  {
    modelValue: () => [],
    options: () => [],
    width: 220,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: Array<string | number>): void;
}>();

/** 宽度:原来是初始化时算一次,width 变化不会生效 */
const selectStyle = computed(() => ({ width: `${props.width}px` }));

/** 全部可选值 */
const allValues = computed(() => props.options.map((item) => item.value));

function onChange(value: Array<string | number>) {
  emit('update:modelValue', value);
}

function onRemoveTag(value: string | number) {
  emit(
    'update:modelValue',
    props.modelValue.filter((item) => item !== value),
  );
}

/** 全选 */
function selectAll() {
  emit('update:modelValue', [...allValues.value]);
}

/** 反选:在当前选中集合与全集之间取差集 */
function invert() {
  const selected = new Set(props.modelValue);
  emit(
    'update:modelValue',
    allValues.value.filter((item) => !selected.has(item)),
  );
}

/** 清空 */
function clear() {
  emit('update:modelValue', []);
}

// 暴露出去，给外部组件使用
defineExpose({
  clear,
  selectAll,
  invert,
});
</script>

<style lang="scss" scoped>
.is-all {
  display: flex;
  padding-left: 10px;

  div {
    margin: 6px 10px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>

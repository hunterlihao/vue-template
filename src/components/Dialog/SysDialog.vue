<template>
  <el-dialog
    :model-value="props.visible"
    :title="props.title"
    :width="dialogWidth"
    :before-close="onClose"
    append-to-body
    :close-on-click-modal="false"
    class="sys-dialog"
    @update:model-value="onVisibleChange"
  >
    <!-- 展示内容:高度自适应,超过 65vh 时内部滚动 -->
    <div class="sys-dialog__body">
      <slot name="content" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" plain @click="onClose">取消</el-button>
        <el-button
          type="primary"
          plain
          :loading="props.loading"
          @click="onConfirm"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DialogProps } from '@/types';

/**
 * 通用弹窗。
 *
 * 与旧实现的区别:
 *  - 不再要求调用方传 height:内容区自动撑高,超出 65vh 时内部滚动,
 *    因此各页面不用再各自猜一个像素高度
 *  - 支持 v-model:visible(通过 update:visible 事件),X / ESC 关闭也会同步
 *  - 样式用 scoped + :deep(),不再全局污染所有 .el-dialog
 */
const props = withDefaults(defineProps<DialogProps>(), {
  title: '提示',
  visible: false,
  width: 630,
  loading: false,
});

// 注册事件
const emit = defineEmits<{
  (e: 'onClose'): void;
  (e: 'onConfirm'): void;
  (e: 'update:visible', value: boolean): void;
}>();

/** 数字按 px 处理,字符串(如 '60%')原样使用 */
const dialogWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width,
);

// 关闭弹窗
const onClose = () => {
  emit('onClose');
};
// 确认弹窗
const onConfirm = () => {
  emit('onConfirm');
};
// el-dialog 自身关闭(右上角 X / ESC)时同步 v-model:visible
const onVisibleChange = (value: boolean) => {
  emit('update:visible', value);
};
</script>

<style lang="scss" scoped>
.sys-dialog__body {
  max-height: 65vh;
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-dialog__header) {
  height: 54px;
  padding: 0 10px;
  margin-right: 0;
  line-height: 54px;
  background-color: #fff;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;

  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: #000;
  }
}

:deep(.el-dialog__headerbtn) {
  height: 54px;

  .el-dialog__close {
    // 原来是 #fff,在白色标题栏上完全看不见
    color: #909399;
  }
}

:deep(.el-dialog__body) {
  padding: 10px;
}

:deep(.el-dialog__footer) {
  padding: 10px;
  border-top: 1px solid #f0f0f0;
}
</style>

<template>
  <el-dialog
    :model-value="props.visible"
    :title="props.title"
    :width="props.width + 'px'"
    :before-close="onClose"
    append-to-body
    :close-on-click-modal="false"
  >
    <!-- 展示内容 -->
    <div :style="{ height: props.height + 'px' }">
      <slot name="content" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <!-- Cancel -->
        <el-button type="danger" plain @click="onClose">取消</el-button>
        <!-- Confirm -->
        <el-button type="primary" plain @click="onConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { DialogProps } from '@/types';

/**
 * 接收父组件传递的数据
 * withDefaults：设置默认值
 * defineProps：接收父组件传递的参数
 */
const props = withDefaults(defineProps<DialogProps>(), {
  title: '提示',
  visible: false,
  width: 630,
  height: 280,
});
// 注册事件
const emit = defineEmits(['onClose', 'onConfirm', 'update:visible']);

// 关闭弹窗
const onClose = () => {
  emit('onClose');
};
// 确认弹窗
const onConfirm = () => {
  emit('onConfirm');
};
</script>

<style lang="scss" scope>
/* .container {
  overflow-x: initial;
  overflow-y: auto;
} */
.el-dialog {
  padding: 0;
  border-top-left-radius: 7px !important;
  border-top-right-radius: 7px !important;

  .el-dialog__header {
    height: 54px;
    padding-bottom: 0;
    padding-left: 10px;
    margin-right: 0;
    line-height: 54px;
    background-color: #fff !important;
    border-top-left-radius: 7px !important;
    border-top-right-radius: 7px !important;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      color: #000;
    }
  }

  .el-dialog__headerbtn {
    height: 54px !important;

    .el-dialog__close {
      color: #fff;
    }
  }

  .el-dialog__body {
    padding: 10px;
  }

  .el-dialog__footer {
    padding: 10px;
    border-top: 1px solid #fff !important;
  }
}
</style>

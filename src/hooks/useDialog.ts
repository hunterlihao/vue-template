import { reactive } from 'vue';
import type { DialogModel } from '@/types';

/**
 * 简易弹窗状态(内容区高度自适应,不再需要 height)。
 * 复杂的新增/编辑表单建议直接用 useCrudDialog。
 */
export default function useDialog() {
  // 定义弹框属性
  const dialog = reactive<DialogModel>({
    title: '标题',
    visible: false,
    width: 630,
  });

  const onShow = () => {
    dialog.visible = true;
  };
  const onClose = () => {
    dialog.visible = false;
  };
  const onConfirm = () => {
    dialog.visible = false;
  };
  return {
    dialog,
    onShow,
    onClose,
    onConfirm,
  };
}

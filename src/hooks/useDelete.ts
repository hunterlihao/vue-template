import { ElMessage } from 'element-plus';
import type { Result } from '@/types';
import myConfirm from '@/utils/myConfirm.ts';

/**
 * 删除操作:二次确认 -> 调用删除接口 -> 刷新列表 -> 提示。
 *
 * 原先 5 个列表页各自写一遍,文案与刷新时机都在复制粘贴里漂移。
 * 用法:
 *   const { remove } = useDelete(deleteApi, getList);
 *   <el-button @click="remove(row.roleId)">删除</el-button>
 */
export default function useDelete(
  deleteApi: (id: string) => Promise<Result>,
  refresh: () => void | Promise<void>,
  options: {
    confirmText?: string;
    successText?: string;
  } = {},
) {
  const { confirmText = '确定要删除该数据吗？', successText = '删除成功' } =
    options;

  /** 确认并删除 */
  const remove = async (id: string) => {
    const confirmed = await myConfirm(confirmText);
    if (!confirmed) return;
    const res = await deleteApi(id);
    if (res && res.code === 200) {
      await refresh();
      ElMessage.success(successText);
    }
  };

  return { remove };
}

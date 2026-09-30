import { ElMessageBox } from 'element-plus';

/**
 * 确认框。
 *
 * 返回 boolean:确定 -> true,取消 / 关闭 / 异常 -> false。
 * (旧实现内部用 Promise + reject 再 catch,调用方拿到的类型是 boolean | void,
 *  这里改成统一的 Promise<boolean>。)
 */
export default async function myConfirm(
  text: string,
  title?: string,
): Promise<boolean> {
  try {
    await ElMessageBox.confirm(text, title || '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    return true;
  } catch {
    return false;
  }
}

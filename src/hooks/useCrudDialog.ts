import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import type { DialogModel, Result } from '@/types';

export interface UseCrudDialogOptions<T> {
  /** 生成一份"空表单",用于打开弹窗时重置 */
  createModel: () => T;
  /** 新增接口 */
  addApi: (model: T) => Promise<Result>;
  /** 编辑接口 */
  editApi: (model: T) => Promise<Result>;
  addTitle?: string;
  editTitle?: string;
  width?: number;
  height?: number;
  successMessage?: string;
}

export interface OpenOptions<T> {
  title?: string;
  width?: number;
  height?: number;
  /** 回显之后再做一些额外处理,例如清空密码、设置角色 id */
  fill?: (model: T, row: Partial<T>) => void;
}

/**
 * 新增/编辑弹窗骨架:统一管理弹窗状态、add/edit 标识、表单实例与提交逻辑。
 *
 * 用法:
 *   const { dialog, tags, addRef, addModel, openAdd, openEdit, close, submit } =
 *     useCrudDialog({ createModel: () => ({...}), addApi, editApi });
 */
export default function useCrudDialog<T extends object>(
  options: UseCrudDialogOptions<T>,
) {
  const {
    createModel,
    addApi,
    editApi,
    addTitle = '新增',
    editTitle = '编辑',
    width = 630,
    height = 280,
    successMessage = '操作成功',
  } = options;

  const dialog = reactive<DialogModel>({
    title: '',
    visible: false,
    width,
    height,
  });
  /** add: 新增;edit: 编辑 */
  const tags = ref<'add' | 'edit'>('add');
  const addRef = ref<FormInstance>();
  const addModel = reactive(createModel()) as T;
  const submitting = ref(false);

  /** 重置表单数据 */
  function resetModel() {
    Object.assign(addModel, createModel());
  }

  function applyOptions(opts: OpenOptions<T>, defaultTitle: string) {
    dialog.title = opts.title ?? defaultTitle;
    if (opts.width !== undefined) dialog.width = opts.width;
    if (opts.height !== undefined) dialog.height = opts.height;
    dialog.visible = true;
  }

  /** 打开新增弹窗 */
  function openAdd(opts: OpenOptions<T> = {}) {
    tags.value = 'add';
    resetModel();
    addRef.value?.clearValidate();
    applyOptions(opts, addTitle);
  }

  /** 打开编辑弹窗 */
  function openEdit(row: Partial<T>, opts: OpenOptions<T> = {}) {
    tags.value = 'edit';
    resetModel();
    Object.assign(addModel, row);
    opts.fill?.(addModel, row);
    addRef.value?.clearValidate();
    applyOptions(opts, editTitle);
  }

  /** 关闭弹窗 */
  function close() {
    dialog.visible = false;
  }

  /** 提交:校验 -> 调新增/编辑接口 -> 刷新列表 -> 关闭 */
  async function submit(onSuccess?: () => void | Promise<void>) {
    const form = addRef.value;
    if (!form || submitting.value) return;
    const valid = await form.validate().catch(() => false);
    if (!valid) return;
    submitting.value = true;
    try {
      const res =
        tags.value === 'add' ? await addApi(addModel) : await editApi(addModel);
      if (res && res.code === 200) {
        await onSuccess?.();
        ElMessage.success(successMessage);
        close();
      }
    } finally {
      submitting.value = false;
    }
  }

  return {
    dialog,
    tags,
    addRef,
    addModel,
    submitting,
    resetModel,
    openAdd,
    openEdit,
    close,
    submit,
  };
}

export type DictTagType = 'primary' | 'success' | 'info' | 'warning' | 'danger';

export interface DictItem {
  label: string;
  type: DictTagType;
}

/**
 * 枚举 -> 展示文案/颜色的字典。
 * 之前相同的映射在 UserList / MenuList 里各写一遍,颜色和文案容易漂移。
 */
export const sexDict: Record<string, DictItem> = {
  '0': { label: '男', type: 'primary' },
  '1': { label: '女', type: 'danger' },
};

export const enabledDict: Record<string, DictItem> = {
  '1': { label: '启用', type: 'success' },
  '0': { label: '禁用', type: 'danger' },
};

export const yesNoDict: Record<string, DictItem> = {
  '1': { label: '是', type: 'primary' },
  '0': { label: '否', type: 'danger' },
};

/** 菜单类型:0 目录 / 1 菜单 / 2 按钮 */
export const menuTypeDict: Record<string, DictItem> = {
  '0': { label: '目录', type: 'danger' },
  '1': { label: '菜单', type: 'success' },
  '2': { label: '按钮', type: 'primary' },
};

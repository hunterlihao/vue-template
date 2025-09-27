// 菜单数据类型
export type MenuType = {
  menuId: string;
  parentId: string;
  title: string;
  code: string;
  name: string;
  path: string;
  url: string;
  type: string;
  icon: string;
  parentName: string;
  orderNum: string;
};

// 动态菜单数据类型
export interface DynamicMenuType {
  path: string;
  component: string;
  name: string;
  meta: {
    title: string;
    icon: string;
    roles: string[];
  };
  children?: DynamicMenuType[];
}

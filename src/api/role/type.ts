// 角色数据类型
export type SysRole = {
  roleId: string;
  roleName: string;
  remark: string;
};

// 列表查询的参数
export type RoleListParm = {
  params: string;
  current: number;
  size: number;
  total: number;
};

// 分配菜单数据类型
export type saveMenuParm = {
  roleId: string;
  list: Array<string>;
};

// 角色下拉选项(/admin/role/selectList)
export type RoleOption = {
  value: string | number;
  label: string;
};

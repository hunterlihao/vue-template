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

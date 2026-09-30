// 角色数据类型
export type SysRole = {
  roleId: string;
  roleName: string;
  remark: string;
};

// 列表查询参数已统一到 @/types 的 PageParm

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

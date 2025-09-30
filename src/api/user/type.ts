// 用户数据类型
export type SysUser = {
  userId: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  sex: string;
  nickName: string;
  roleId: string;
  avatarUrl?: string;
  isEnabled?: number; // 1: 启用, 2: 禁用
  isAdmin?: number; // 1: 管理员, 2: 普通用户
};

export interface AddModel {
  userId: string;
  username: string;
  password: string;
  phone: string;
  email: string;
  sex: string;
  nickName: string;
  roleId: string;
  avatarUrl?: string;
  isEnabled?: number; // 1: 启用, 2: 禁用
  isAdmin?: number; // 1: 管理员, 2: 普通用户
}

// 列表查询的参数
export type UserListParm = {
  params: string;
  current: number;
  size: number;
  total: number;
};

export interface Login {
  username: string;
  password: string;
  captchaKey: string;
  captchaCode: string;
}

// 菜单树参数
export type AssignParm = {
  userId: string;
  roleId: string;
};

// 修改密码参数
export type UpdatePwd = {
  userId: string;
  oldPassword: string;
  password: string;
};

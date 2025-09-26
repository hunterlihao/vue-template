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
}

// 列表查询的参数
export type UserListParm = {
  params: string;
  current: number;
  size: number;
  total: number;
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
}

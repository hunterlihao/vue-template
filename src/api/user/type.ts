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

// 列表查询参数已统一到 @/types 的 PageParm

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

// ---------------------------------------------------------------- 接口返回

/** 登录返回 */
export type LoginResult = {
  userId: string;
  nickName: string;
  token: string;
  avatarUrl: string;
};

/** 验证码 */
export type CaptchaResult = {
  key: string;
  image: string;
};

/** 当前登录用户信息(接口不返回密码字段) */
export type CurrentUser = Omit<SysUser, 'password'>;

/** /admin/user/info 返回:权限码 + 用户信息 */
export type UserInfoResult = {
  permissions: string[];
  user: Pick<SysUser, 'userId' | 'nickName' | 'avatarUrl'>;
};

/** 分配菜单的树节点(只需要这几个字段) */
export type AssignTreeMenu = {
  menuId: string;
  title: string;
  children?: AssignTreeMenu[];
};

/** 分配菜单返回:树 + 已分配的菜单 id */
export type AssignTreeResult = {
  menuList: AssignTreeMenu[];
  checkList: string[];
};

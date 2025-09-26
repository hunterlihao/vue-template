// 用户管理接口
import http from '@/utils/http.ts';
import type {
  AssignParm,
  Login,
  SysUser,
  UpdatePwd,
  UserListParm,
} from '@/api/user/type.ts';
// 统一管理接口

const API = {
  ADD_URI: '/admin/user',
  GET_LIST_URI: '/admin/user/list',
  GET_ROLE_LIST_URI: '/admin/user/getRoleList',
  UPDATE_URI: '/admin/user',
  RESET_PASSWORD_URI: '/admin/user/resetPassword',
  CAPTCHA_URI: '/admin/user/login/captcha',
  LOGIN_URI: '/admin/user/login',
  GET_ASSIGN_TREE_URI: '/admin/menu/getAssignTre',
  UPDATE_PASSWORD_URI: '/admin/user/updatePassword',
  GET_INFO_URI: '/admin/user/info',
  LOGOUT_URI: '/admin/user/logout',
} as const;

//新增用户
export const addApi = (parm: SysUser) => {
  return http.post(API.ADD_URI, parm);
};

//用户列表
export const getListApi = (parm: UserListParm) => {
  return http.post(API.GET_LIST_URI, parm);
};

//根据用户id查询角色
export const getRoleListApi = (userId: string) => {
  return http.get(API.GET_ROLE_LIST_URI, { userId: userId });
};

//修改用户
export const editApi = (parm: SysUser) => {
  return http.put(API.UPDATE_URI, parm);
};

//删除用户
export const deleteApi = (userId: string) => {
  return http.delete(`/admin/user/${userId}`);
};

//重置密码
export const resetPasswordApi = (parm: { userId: string }) => {
  return http.post(API.RESET_PASSWORD_URI, parm);
};

// 验证码
export const getCaptchaApi = () => {
  return http.get(API.CAPTCHA_URI);
};

// 登录
export const loginApi = (parm: Login) => {
  return http.post(API.LOGIN_URI, parm);
};

//查询菜单树
export const getAssignTreeApi = (pram: AssignParm) => {
  return http.get(API.GET_ASSIGN_TREE_URI, pram);
};

// 修改密码
export const updatePasswordApi = (parm: UpdatePwd) => {
  return http.post(API.UPDATE_PASSWORD_URI, parm);
};

// 获取用户信息
export const getUserInfoApi = (userId: string) => {
  return http.get(API.GET_INFO_URI, { userId });
};

//退出登录
export const logoutApi = () => {
  return http.get(API.LOGOUT_URI);
};

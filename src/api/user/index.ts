// 用户管理接口
import http from '@/utils/http.ts';
import type { SysUser, UserListParm } from '@/api/user/type.ts';
// 统一管理接口

const API = {
  ADD_URI: '/admin/user',
  GET_LIST_URI: '/admin/user/list',
  GET_ROLE_LIST_URI: '/admin/user/getRoleList',
  UPDATE_URI: '/admin/user',
  RESET_PASSWORD_URI: '/admin/user/resetPassword',
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

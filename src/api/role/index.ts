// 角色管理接口
import http from '@/utils/http.ts';
// 统一管理接口
import type { RoleListParm, SysRole } from '@/api/role/type.ts';

const API = {
  ADD_URI: '/admin/role',
  GET_LIST_URI: '/admin/role/list',
} as const;

// 新增角色
export const addApi = (parm: SysRole) => {
  return http.post(API.ADD_URI, parm);
};

// 角色列表
export const getListApi = (parm: RoleListParm) => {
  return http.post(API.GET_LIST_URI, parm);
};

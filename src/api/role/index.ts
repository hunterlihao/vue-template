// 角色管理接口
import http from '@/utils/http.ts';
// 统一管理接口
import type { RoleListParm, SysRole } from '@/api/role/type.ts';

const API = {
  ADD_URI: '/admin/role',
  GET_LIST_URI: '/admin/role/list',
  UPDATE_URI: '/admin/role',
} as const;

// 新增角色
export const addApi = (parm: SysRole) => {
  return http.post(API.ADD_URI, parm);
};

// 角色列表
export const getListApi = (parm: RoleListParm) => {
  return http.post(API.GET_LIST_URI, parm);
};

// 修改角色
export const updateApi = (parm: SysRole) => {
  return http.put(API.UPDATE_URI, parm);
};

// 删除角色
export const deleteApi = (roleId: string) => {
  return http.delete(`/admin/role/${roleId}`);
};

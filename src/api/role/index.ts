// 角色管理接口
import http from '@/utils/http.ts';
// 统一管理接口
import type { RoleListParm, saveMenuParm, SysRole } from '@/api/role/type.ts';

const API = {
  ADD_URI: '/admin/role',
  GET_LIST_URI: '/admin/role/list',
  UPDATE_URI: '/admin/role',
  Select_URI: '/admin/role/selectList',
  SAVE_ROLE_MENU_URI: '/admin/role/saveRoleMenu',
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
export const editApi = (parm: SysRole) => {
  return http.put(API.UPDATE_URI, parm);
};

// 删除角色
export const deleteApi = (roleId: string) => {
  return http.delete(`/admin/role/${roleId}`);
};

//角色下拉列表
export const getSelectApi = () => {
  return http.get(API.Select_URI);
};

// 分配角色菜单
export const saveRoleMenuApi = (parm: saveMenuParm) => {
  return http.post(API.SAVE_ROLE_MENU_URI, parm);
};

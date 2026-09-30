//菜单管理
import http from '@/utils/http.ts';
import type { Result } from '@/types';
import type { DynamicMenuType, MenuType } from '@/api/menu/type.ts';

const API = {
  GET_PARENT_URI: '/admin/menu/parent',
  ADD_URI: '/admin/menu',
  GET_LIST_URI: '/admin/menu/list',
  UPDATE_URI: '/admin/menu',
  GET_MENU_URI: '/admin/menu/getMenuList',
  IMPORT_URI: '/admin/excel/uploadMenu',
} as const;

//获取上级菜单
export const getParentApi = () => {
  return http.get<Result<MenuType[]>>(API.GET_PARENT_URI);
};

//新增菜单
export const addApi = (parm: MenuType) => {
  return http.post(API.ADD_URI, parm);
};
//列表(菜单是整棵树)
export const getListApi = () => {
  return http.get<Result<MenuType[]>>(API.GET_LIST_URI);
};
//修改菜单
export const editApi = (parm: MenuType) => {
  return http.put(API.UPDATE_URI, parm);
};
//删除菜单
export const deleteApi = (menuId: string) => {
  return http.delete(`/admin/menu/${menuId}`);
};

//获取当前用户可访问的菜单(动态路由)
export const getMenuListApi = (userId: string) => {
  return http.get<Result<DynamicMenuType[]>>(API.GET_MENU_URI, { userId });
};

//导入菜单数据
export const importApi = (formData: FormData) => {
  return http.post<Result<null>>(API.IMPORT_URI, formData);
};

// 物资类型(分类)管理接口
import http from '@/utils/http.ts';
import type { PageParm, PageResult, Result } from '@/types';
import type { CategoryOption, SysCategory } from '@/api/category/type.ts';

const API = {
  ADD_URI: '/admin/category',
  GET_LIST_URI: '/admin/category/list',
  UPDATE_URI: '/admin/category',
  SELECT_URI: '/admin/category/selectList',
} as const;

// 新增类型
export const addApi = (parm: SysCategory) => {
  return http.post(API.ADD_URI, parm);
};

// 类型列表
export const getListApi = (parm: PageParm) => {
  return http.post<Result<PageResult<SysCategory>>>(API.GET_LIST_URI, parm);
};

// 修改类型
export const editApi = (parm: SysCategory) => {
  return http.put(API.UPDATE_URI, parm);
};

// 删除类型
export const deleteApi = (categoryId: string) => {
  return http.delete(`/admin/category/${categoryId}`);
};

// 类型下拉列表
export const getSelectApi = () => {
  return http.get<Result<CategoryOption[]>>(API.SELECT_URI);
};

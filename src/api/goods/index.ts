// 商品管理接口
import http from '@/utils/http.ts';
import type { PageParm, PageResult, Result } from '@/types';
import type { SysGoods } from '@/api/goods/type.ts';

const API = {
  ADD_URI: '/admin/goods',
  GET_LIST_URI: '/admin/goods/list',
  UPDATE_URI: '/admin/goods',
} as const;

// 新增商品
export const addApi = (parm: SysGoods) => {
  return http.post(API.ADD_URI, parm);
};

// 商品列表
export const getListApi = (parm: PageParm) => {
  return http.post<Result<PageResult<SysGoods>>>(API.GET_LIST_URI, parm);
};

// 修改商品
export const editApi = (parm: SysGoods) => {
  return http.put(API.UPDATE_URI, parm);
};

// 删除商品
export const deleteApi = (goodsId: string) => {
  return http.delete(`/admin/goods/${goodsId}`);
};

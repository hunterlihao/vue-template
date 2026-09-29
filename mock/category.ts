// 物资类型(分类)管理 mock
import type { MockMethod } from 'vite-plugin-mock';
import { categories, fail, ok } from './_data';

let autoId = 100;

/** 生成新的类型 id */
function nextId(): string {
  autoId += 1;
  return String(autoId);
}

export default [
  // 类型下拉列表(商品表单里选择所属类型)
  {
    url: '/api/admin/category/selectList',
    method: 'get',
    response: () =>
      ok(
        categories.map((item) => ({
          value: item.categoryId,
          label: item.categoryName,
        })),
      ),
  },
  // 类型列表(分页 + 关键字)
  {
    url: '/api/admin/category/list',
    method: 'post',
    response: ({ body }) => {
      const current = Number(body?.current) || 1;
      const size = Number(body?.size) || 10;
      const keyword = String(body?.params ?? '').trim();
      const list = keyword
        ? categories.filter(
            (item) =>
              item.categoryName.includes(keyword) ||
              item.categoryCode.includes(keyword),
          )
        : categories;
      const start = (current - 1) * size;
      return ok({
        records: list.slice(start, start + size),
        total: list.length,
      });
    },
  },
  // 新增类型
  {
    url: '/api/admin/category',
    method: 'post',
    response: ({ body }) => {
      if (categories.some((item) => item.categoryCode === body?.categoryCode)) {
        return fail('类型编码已存在');
      }
      categories.unshift({
        categoryId: nextId(),
        categoryName: body?.categoryName ?? '',
        categoryCode: body?.categoryCode ?? '',
        orderNum: body?.orderNum ?? '1',
        remark: body?.remark ?? '',
      });
      return ok(null, '新增成功');
    },
  },
  // 修改类型
  {
    url: '/api/admin/category',
    method: 'put',
    response: ({ body }) => {
      const item = categories.find(
        (row) => row.categoryId === body?.categoryId,
      );
      if (!item) return fail('类型不存在');
      Object.assign(item, {
        categoryName: body.categoryName ?? item.categoryName,
        categoryCode: body.categoryCode ?? item.categoryCode,
        orderNum: body.orderNum ?? item.orderNum,
        remark: body.remark ?? item.remark,
      });
      return ok(null, '修改成功');
    },
  },
  // 删除类型(放在最后,避免 :categoryId 抢先匹配固定路径)
  {
    url: '/api/admin/category/:categoryId',
    method: 'delete',
    response: ({ query }) => {
      const categoryId = String(query.categoryId);
      const index = categories.findIndex(
        (item) => item.categoryId === categoryId,
      );
      if (index === -1) return fail('类型不存在');
      categories.splice(index, 1);
      return ok(null, '删除成功');
    },
  },
] as MockMethod[];

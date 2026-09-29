// 商品管理 mock
import type { MockMethod } from 'vite-plugin-mock';
import { categoryName, fail, goodsList, ok, type MockGoods } from './_data';

let autoId = 100;

/** 生成新的商品 id */
function nextId(): string {
  autoId += 1;
  return String(autoId);
}

/** 列表返回时带上类型名称,前端不用再查一次 */
function withCategoryName(item: MockGoods) {
  return { ...item, categoryName: categoryName(item.categoryId) };
}

export default [
  // 商品列表(分页 + 关键字)
  {
    url: '/api/admin/goods/list',
    method: 'post',
    response: ({ body }) => {
      const current = Number(body?.current) || 1;
      const size = Number(body?.size) || 10;
      const keyword = String(body?.params ?? '').trim();
      const list = keyword
        ? goodsList.filter((item) => item.goodsName.includes(keyword))
        : goodsList;
      const start = (current - 1) * size;
      return ok({
        records: list.slice(start, start + size).map(withCategoryName),
        total: list.length,
      });
    },
  },
  // 新增商品
  {
    url: '/api/admin/goods',
    method: 'post',
    response: ({ body }) => {
      goodsList.unshift({
        goodsId: nextId(),
        goodsName: body?.goodsName ?? '',
        categoryId: String(body?.categoryId ?? ''),
        price: Number(body?.price) || 0,
        stock: Number(body?.stock) || 0,
        unit: body?.unit ?? '',
        remark: body?.remark ?? '',
      });
      return ok(null, '新增成功');
    },
  },
  // 修改商品
  {
    url: '/api/admin/goods',
    method: 'put',
    response: ({ body }) => {
      const item = goodsList.find((row) => row.goodsId === body?.goodsId);
      if (!item) return fail('商品不存在');
      Object.assign(item, {
        goodsName: body.goodsName ?? item.goodsName,
        categoryId: body.categoryId ?? item.categoryId,
        price: Number(body.price ?? item.price),
        stock: Number(body.stock ?? item.stock),
        unit: body.unit ?? item.unit,
        remark: body.remark ?? item.remark,
      });
      return ok(null, '修改成功');
    },
  },
  // 删除商品(放在最后,避免 :goodsId 抢先匹配固定路径)
  {
    url: '/api/admin/goods/:goodsId',
    method: 'delete',
    response: ({ query }) => {
      const goodsId = String(query.goodsId);
      const index = goodsList.findIndex((item) => item.goodsId === goodsId);
      if (index === -1) return fail('商品不存在');
      goodsList.splice(index, 1);
      return ok(null, '删除成功');
    },
  },
] as MockMethod[];

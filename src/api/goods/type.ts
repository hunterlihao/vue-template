// 商品数据类型
export type SysGoods = {
  goodsId: string;
  goodsName: string;
  categoryId: string;
  categoryName: string;
  price: number;
  stock: number;
  unit: string;
  remark: string;
};

// 列表查询参数已统一到 @/types 的 PageParm

// 物资类型(分类)数据类型
export type SysCategory = {
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  orderNum: string;
  remark: string;
};

// 列表查询参数
export type CategoryListParm = {
  params: string;
  current: number;
  size: number;
  total: number;
};

// 下拉选项
export type CategoryOption = {
  value: string;
  label: string;
};

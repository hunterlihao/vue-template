// 物资类型(分类)数据类型
export type SysCategory = {
  categoryId: string;
  categoryName: string;
  categoryCode: string;
  orderNum: string;
  remark: string;
};

// 列表查询参数已统一到 @/types 的 PageParm

// 下拉选项
export type CategoryOption = {
  value: string;
  label: string;
};

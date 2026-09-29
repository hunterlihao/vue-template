import { onMounted, reactive, ref } from 'vue';
import type { Result } from '@/types';

/** 列表查询参数(分页模式) */
export interface TableSearchParm {
  current: number;
  size: number;
  total: number;
  params: string;
}

export interface UseTablePageOptions {
  /** 列表查询接口 */
  api: (parm?: any) => Promise<Result>;
  /** 是否分页:true 走 records/total,false 直接把 data 当数组(默认 true) */
  paged?: boolean;
  /** 是否在 onMounted 自动查询(默认 true) */
  immediate?: boolean;
  /** 初始每页条数(默认 10) */
  size?: number;
}

/**
 * 列表页数据骨架:统一管理查询参数、分页事件、表格数据与 loading。
 *
 * 用法:
 *   const { searchParm, tableList, getList, searchBtn, resetBtn, sizeChange, currentChange } =
 *     useTablePage({ api: getListApi });
 */
export default function useTablePage(options: UseTablePageOptions) {
  const { api, paged = true, immediate = true, size = 10 } = options;

  const searchParm = reactive<TableSearchParm>({
    current: 1,
    size,
    total: 0,
    params: '',
  });
  const tableList = ref<any[]>([]);
  const loading = ref(false);

  /** 查询列表 */
  async function getList() {
    loading.value = true;
    try {
      const res = paged ? await api(searchParm) : await api();
      if (res && res.code === 200) {
        if (paged) {
          tableList.value = res.data?.records ?? [];
          searchParm.total = res.data?.total ?? 0;
        } else {
          tableList.value = Array.isArray(res.data) ? res.data : [];
        }
      }
    } finally {
      loading.value = false;
    }
  }

  /** 页容量变化 */
  function sizeChange(value: number) {
    searchParm.size = value;
    getList();
  }

  /** 页码变化 */
  function currentChange(value: number) {
    searchParm.current = value;
    getList();
  }

  /** 查询按钮 */
  function searchBtn() {
    getList();
  }

  /** 重置按钮 */
  function resetBtn() {
    searchParm.params = '';
    searchParm.current = 1;
    getList();
  }

  if (immediate) {
    onMounted(getList);
  }

  return {
    searchParm,
    tableList,
    loading,
    getList,
    sizeChange,
    currentChange,
    searchBtn,
    resetBtn,
  };
}

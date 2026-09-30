import { onMounted, reactive, shallowRef } from 'vue';
import type { PageParm, PageResult, Result } from '@/types';

export type { PageParm };

export interface UseTablePageOptions<TRow, TFilter = Record<string, never>> {
  /** 列表查询接口:分页接口返回 { records, total },不分页接口直接返回数组 */
  api: (parm: PageParm<TFilter>) => Promise<Result<PageResult<TRow> | TRow[]>>;
  /** 是否在 onMounted 自动查询(默认 true) */
  immediate?: boolean;
  /** 初始每页条数(默认 10) */
  size?: number;
  /** 额外筛选条件的初始值 */
  filter?: TFilter;
}

/**
 * 列表页数据骨架:统一管理查询参数、分页事件、表格数据与 loading。
 *
 * 行类型通过泛型传入,模板里 scope.row 也就有了类型:
 *   const { searchParm, tableList, loading, getList } =
 *     useTablePage<SysUser>({ api: getListApi });
 *
 * 需要额外筛选条件时再传第二个泛型:
 *   useTablePage<SysUser, { status: number }>({ api: getListApi, filter: { status: 1 } })
 */
export default function useTablePage<TRow, TFilter = Record<string, never>>(
  options: UseTablePageOptions<TRow, TFilter>,
) {
  const { api, immediate = true, size = 10 } = options;

  // 分页与关键字:这部分是固定结构
  const searchParm = reactive({
    current: 1,
    size,
    total: 0,
    params: '',
  });
  /**
   * 额外筛选条件。
   * 用 shallowRef 而不是 reactive:reactive 会对泛型做深度解包(UnwrapRef),
   * 导致 TFilter 在赋值处变成不可比较的类型。
   */
  const filter = shallowRef<TFilter>((options.filter ?? {}) as TFilter);
  const tableList = shallowRef<TRow[]>([]);
  const loading = shallowRef(false);

  /**
   * 查询列表。
   * 返回结构决定怎么取数据:数组当整表,否则按 { records, total } 处理 ——
   * 这样分页与不分页接口可以共用同一个骨架。
   */
  async function getList() {
    loading.value = true;
    try {
      const res = await api({ ...searchParm, filter: filter.value });
      if (res && res.code === 200) {
        const data = res.data;
        if (Array.isArray(data)) {
          tableList.value = data;
          searchParm.total = data.length;
        } else {
          tableList.value = data?.records ?? [];
          searchParm.total = data?.total ?? 0;
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
    searchParm.current = 1;
    getList();
  }

  /** 重置按钮 */
  function resetBtn() {
    searchParm.params = '';
    searchParm.current = 1;
    filter.value = (options.filter ?? {}) as TFilter;
    getList();
  }

  if (immediate) {
    onMounted(getList);
  }

  return {
    searchParm,
    filter,
    tableList,
    loading,
    getList,
    sizeChange,
    currentChange,
    searchBtn,
    resetBtn,
  };
}

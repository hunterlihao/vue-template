import { describe, expect, it, vi } from 'vitest';
import useTablePage from '@/hooks/useTablePage.ts';
import type { PageResult, Result } from '@/types';

interface Row {
  id: number;
  name: string;
}

/** 分页接口 */
const pagedApi = async (): Promise<Result<PageResult<Row>>> => ({
  code: 200,
  message: 'ok',
  data: {
    records: [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
    ],
    total: 42,
  },
});

/** 不分页接口(菜单那种整棵树) */
const plainApi = async (): Promise<Result<Row[]>> => ({
  code: 200,
  message: 'ok',
  data: [{ id: 1, name: 'a' }],
});

describe('useTablePage', () => {
  it('分页接口:按 records/total 取数据', async () => {
    const { tableList, searchParm, getList, loading } = useTablePage<Row>({
      api: pagedApi,
      immediate: false,
    });

    await getList();

    expect(tableList.value).toHaveLength(2);
    expect(tableList.value[0].name).toBe('a');
    expect(searchParm.total).toBe(42);
    expect(loading.value).toBe(false);
  });

  it('不分页接口:直接把数组当整表', async () => {
    const { tableList, searchParm, getList } = useTablePage<Row>({
      api: plainApi,
      immediate: false,
    });

    await getList();

    expect(tableList.value).toHaveLength(1);
    expect(searchParm.total).toBe(1);
  });

  it('非 200 时保持空列表且 loading 复位', async () => {
    const api = async (): Promise<Result<PageResult<Row>>> => ({
      code: 500,
      message: 'boom',
      data: { records: [{ id: 9, name: 'x' }], total: 1 },
    });
    const { tableList, getList, loading } = useTablePage<Row>({
      api,
      immediate: false,
    });

    await getList();

    expect(tableList.value).toEqual([]);
    expect(loading.value).toBe(false);
  });

  it('把分页参数与额外筛选条件一起传给接口', async () => {
    const api = vi.fn(async () => ({
      code: 200,
      message: 'ok',
      data: { records: [], total: 0 },
    }));
    const { getList, searchParm, filter } = useTablePage<
      Row,
      { status: number }
    >({
      api,
      immediate: false,
      size: 20,
      filter: { status: 1 },
    });

    searchParm.params = 'abc';
    filter.value = { status: 2 };
    await getList();

    expect(api).toHaveBeenCalledWith({
      current: 1,
      size: 20,
      total: 0,
      params: 'abc',
      filter: { status: 2 },
    });
  });

  it('重置会把关键字与筛选条件恢复到初始值', async () => {
    const api = vi.fn(async () => ({
      code: 200,
      message: 'ok',
      data: { records: [], total: 0 },
    }));
    const { resetBtn, searchParm, filter } = useTablePage<
      Row,
      { status: number }
    >({
      api,
      immediate: false,
      filter: { status: 1 },
    });

    searchParm.params = 'changed';
    searchParm.current = 5;
    filter.value = { status: 9 };
    resetBtn();

    expect(searchParm.params).toBe('');
    expect(searchParm.current).toBe(1);
    expect(filter.value).toEqual({ status: 1 });
  });
});

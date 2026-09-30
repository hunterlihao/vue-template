import { describe, expect, it } from 'vitest';
import { HOME_PATH, normalizeTab } from '@/utils/tabs.ts';

describe('normalizeTab', () => {
  it('把旧版本持久化的路由对象整理成 { path, title, icon }', () => {
    const legacy = {
      path: '/system/user',
      name: 'SysUser',
      meta: { title: '用户管理', icon: 'User', hidden: false },
      matched: [{ path: '/system' }],
      fullPath: '/system/user',
    };
    expect(normalizeTab(legacy)).toEqual({
      path: '/system/user',
      title: '用户管理',
      icon: 'User',
    });
  });

  it('已经是 TabItem 时保持字段不变', () => {
    expect(
      normalizeTab({ path: '/goods/list', title: '商品列表', icon: 'Goods' }),
    ).toEqual({ path: '/goods/list', title: '商品列表', icon: 'Goods' });
  });

  it('缺少标题时回落到 path', () => {
    expect(normalizeTab({ path: '/home', meta: {} })).toEqual({
      path: '/home',
      title: '/home',
      icon: undefined,
    });
  });

  it('没有图标时 icon 为 undefined', () => {
    expect(normalizeTab({ path: '/404', meta: { title: '404' } })?.icon).toBe(
      undefined,
    );
  });

  it('脏数据返回 null', () => {
    expect(normalizeTab(null)).toBeNull();
    expect(normalizeTab(undefined)).toBeNull();
    expect(normalizeTab('nonsense')).toBeNull();
    expect(normalizeTab({ title: '没有 path' })).toBeNull();
    expect(normalizeTab({ path: 123 })).toBeNull();
  });

  it('常量为 /home', () => {
    expect(HOME_PATH).toBe('/home');
  });
});

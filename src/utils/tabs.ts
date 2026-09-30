/**
 * 标签页的数据模型与兼容处理(纯函数,不依赖 router / pinia,方便单测)。
 */

/** 标签页只需要渲染标签用的这三个字段 */
export interface TabItem {
  path: string;
  title: string;
  icon?: string;
}

export const HOME_PATH = '/home';

/**
 * 把任意来源(旧版本持久化的路由对象、路由记录、TabItem)整理成 TabItem。
 *
 * 兼容旧结构是这个函数存在的意义:老版本把整个 RouteLocationNormalized 存进了
 * localStorage(含 matched 等字段),直接当 TabItem 用会读到 undefined 的标题。
 */
export function normalizeTab(raw: unknown): TabItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const path = typeof item.path === 'string' ? item.path : '';
  if (!path) return null;
  const meta = (
    item.meta && typeof item.meta === 'object' ? item.meta : {}
  ) as Record<string, unknown>;
  const title = typeof item.title === 'string' ? item.title : '';
  const metaTitle = typeof meta.title === 'string' ? meta.title : '';
  const icon = typeof item.icon === 'string' ? item.icon : '';
  const metaIcon = typeof meta.icon === 'string' ? meta.icon : '';
  return {
    path,
    title: title || metaTitle || path,
    icon: icon || metaIcon || undefined,
  };
}

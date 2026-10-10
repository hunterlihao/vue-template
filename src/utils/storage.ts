/**
 * 本地存储的安全读写。
 *
 * 两个原则:
 *  1. key 集中声明,清理时只动本应用自己的 key —— 不再用 localStorage.clear()
 *     把同域下其他应用的数据一起清掉。
 *  2. 解析一律走 safeParse。这些代码会在请求拦截器和渲染期间执行,
 *     存储被改坏时抛异常会直接白屏,兜底值更安全。
 */
export const STORAGE_KEYS = {
  /** 登录令牌 */
  token: 'TOKEN',
  /** 用户展示信息(昵称),由 pinia 持久化插件写入 */
  user: 'user',
  /** 历史遗留的权限码缓存,清理时需要一并删除 */
  codeList: 'codeList',
  /** 标签页 */
  tabs: 'tabsList',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/** 读取字符串,不存在时返回 null */
export function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** 安全解析 JSON,失败或为空时返回 fallback */
export function safeParse<T>(key: string, fallback: T): T {
  const raw = safeGet(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/** 写入 JSON,忽略隐私模式等场景下的写入失败 */
export function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 存储不可用时静默降级,不影响业务流程 */
  }
}

/** 只清理本应用自己的 key */
export function clearAppStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* 同上 */
    }
  });
}

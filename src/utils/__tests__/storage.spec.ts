import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  STORAGE_KEYS,
  clearAppStorage,
  safeGet,
  safeParse,
  safeSet,
} from '@/utils/storage.ts';

/** 内存版 localStorage,避免测试依赖 jsdom */
function createStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createStorage());
});

describe('safeParse', () => {
  it('key 不存在时返回兜底值', () => {
    expect(safeParse('missing', { a: 1 })).toEqual({ a: 1 });
    expect(safeParse('missing', [] as string[])).toEqual([]);
  });

  it('内容被写坏时返回兜底值而不是抛异常', () => {
    // 这正是修复前的白屏原因:JSON.parse 直接抛,且发生在渲染期间
    localStorage.setItem('broken', '{not json');
    expect(() => safeParse('broken', [])).not.toThrow();
    expect(safeParse('broken', [] as string[])).toEqual([]);
  });

  it('正常内容按 JSON 解析', () => {
    localStorage.setItem('ok', JSON.stringify({ code: 200 }));
    expect(safeParse('ok', {})).toEqual({ code: 200 });
  });

  it('存储值为 "null" 时回退到兜底值', () => {
    localStorage.setItem('nullish', 'null');
    expect(safeParse('nullish', ['fallback'])).toEqual(['fallback']);
  });
});

describe('safeSet / safeGet', () => {
  it('写入后可读回序列化内容', () => {
    safeSet('user', { userId: 1 });
    expect(safeGet('user')).toBe('{"userId":1}');
  });

  it('存储抛异常时不向外扩散', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('quota exceeded');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    });
    expect(() => safeSet('a', 1)).not.toThrow();
    expect(safeGet('a')).toBeNull();
  });
});

describe('clearAppStorage', () => {
  it('只清理本应用的 key,不动同域下其他应用的数据', () => {
    Object.values(STORAGE_KEYS).forEach((key) =>
      localStorage.setItem(key, 'x'),
    );
    localStorage.setItem('other-app-token', 'keep-me');

    clearAppStorage();

    Object.values(STORAGE_KEYS).forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
    expect(localStorage.getItem('other-app-token')).toBe('keep-me');
  });
});

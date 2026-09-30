// 登录令牌的读写:全项目只有这里直接操作 TOKEN
import { STORAGE_KEYS, safeGet } from '@/utils/storage.ts';

/** 存储 token */
export const SET_TOKEN = (token: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.token, token);
  } catch {
    /* 存储不可用时忽略 */
  }
};

/** 读取 token */
export const GET_TOKEN = (): string | null => safeGet(STORAGE_KEYS.token);

/** 删除 token */
export const REMOVE_TOKEN = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.token);
  } catch {
    /* 存储不可用时忽略 */
  }
};

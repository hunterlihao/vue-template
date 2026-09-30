import { describe, expect, it, vi } from 'vitest';
import { getTime } from '@/utils/time.ts';

/** 用假时间验证时段边界,避免测试结果随运行时刻变化 */
function atHour(hour: number) {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 30, hour, 0, 0));
}

describe('getTime', () => {
  it('0-9 点返回"早上"', () => {
    atHour(8);
    expect(getTime()).toBe('早上');
  });

  it('10-12 点返回"上午"', () => {
    atHour(11);
    expect(getTime()).toBe('上午');
  });

  it('13-18 点返回"下午"', () => {
    atHour(15);
    expect(getTime()).toBe('下午');
  });

  it('19 点之后返回"晚上"', () => {
    atHour(21);
    expect(getTime()).toBe('晚上');
  });
});

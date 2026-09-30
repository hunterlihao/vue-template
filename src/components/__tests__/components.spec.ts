import { describe, expect, it } from 'vitest';
import { createSSRApp, h, type Component } from 'vue';
// 通过 vue 的子路径导入,避免额外引入 @vue/server-renderer 依赖
import { renderToString } from 'vue/server-renderer';
import ElementPlus, {
  ID_INJECTION_KEY,
  ZINDEX_INJECTION_KEY,
} from 'element-plus';
import SearchBar from '@/components/SearchBar/SearchBar.vue';
import TablePager from '@/components/TablePager/TablePager.vue';
import TableEmpty from '@/components/TableEmpty/TableEmpty.vue';
import DictTag from '@/components/DictTag/DictTag.vue';
import { enabledDict, menuTypeDict, sexDict, yesNoDict } from '@/const/dict.ts';
import { iconOf } from '@/components/icons.ts';

/**
 * 共享组件冒烟测试:用 SSR 渲染,不需要浏览器环境。
 * 目的是锁住这几个组件的对外接口(改签名/改字典时这里会直接失败)。
 */
async function render(
  component: Component,
  props: Record<string, unknown> = {},
) {
  return renderWithSlots(component, props, {});
}

/** 带插槽的渲染(SSR) */
async function renderWithSlots(
  component: Component,
  props: Record<string, unknown>,
  slots: Record<string, () => unknown>,
) {
  const app = createSSRApp({
    render: () => h(component, props, slots),
  });
  app.use(ElementPlus);
  // SSR 下 Element Plus 需要 id / z-index 提供器,否则会打印告警
  app.provide(ID_INJECTION_KEY, { prefix: 1000, current: 0 });
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 });
  return renderToString(app);
}

describe('DictTag', () => {
  it('按字典渲染文案', async () => {
    expect(await render(DictTag, { value: 0, dict: sexDict })).toContain('男');
    expect(await render(DictTag, { value: 1, dict: sexDict })).toContain('女');
    expect(await render(DictTag, { value: 1, dict: enabledDict })).toContain(
      '启用',
    );
    expect(await render(DictTag, { value: 0, dict: yesNoDict })).toContain(
      '否',
    );
    expect(await render(DictTag, { value: 2, dict: menuTypeDict })).toContain(
      '按钮',
    );
  });

  it('未命中字典时回落到占位符,不报错', async () => {
    expect(await render(DictTag, { value: 99, dict: sexDict })).toContain('-');
    expect(await render(DictTag, { value: null, dict: sexDict })).toContain(
      '-',
    );
  });
});

describe('TableEmpty', () => {
  it('渲染默认文案', async () => {
    const html = await render(TableEmpty);
    expect(html).toContain('暂无数据');
    expect(html).toContain('table-empty');
  });

  it('支持自定义文案', async () => {
    expect(await render(TableEmpty, { text: '还没有角色' })).toContain(
      '还没有角色',
    );
  });
});

describe('TablePager', () => {
  it('渲染总条数并带上分页信息', async () => {
    const html = await render(TablePager, {
      current: 1,
      size: 10,
      total: 42,
    });
    expect(html).toContain('table-pager');
    expect(html).toContain('42');
  });
});

describe('SearchBar', () => {
  it('渲染默认的搜索/重置按钮,并能透出 actions 插槽', async () => {
    const html = await renderWithSlots(
      SearchBar,
      { model: {} },
      { actions: () => h('button', '新增') },
    );
    expect(html).toContain('搜索');
    expect(html).toContain('重置');
    expect(html).toContain('新增');
  });
});

describe('iconOf', () => {
  it('返回登记过的图标组件', () => {
    expect(iconOf('Search')).toBeTruthy();
    expect(iconOf('Setting')).toBeTruthy();
  });

  it('未登记的图标回落到默认图标而不是 undefined', () => {
    expect(iconOf('NotAnIcon')).toBeTruthy();
    expect(iconOf(undefined)).toBeTruthy();
  });
});

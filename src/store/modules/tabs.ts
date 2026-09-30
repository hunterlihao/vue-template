import { defineStore } from 'pinia';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import router from '@/router';
import { HOME_PATH, normalizeTab, type TabItem } from '@/utils/tabs.ts';

/** 首页标签(标题与图标取路由表里的配置) */
function createHomeTab(): TabItem {
  const home = router.getRoutes().find((item) => item.path === HOME_PATH);
  return (
    normalizeTab({ path: HOME_PATH, meta: home?.meta }) ?? {
      path: HOME_PATH,
      title: '首页',
      icon: 'HomeFilled',
    }
  );
}

/**
 * 标签页仓库。
 *
 * 持久化的只有 { path, title, icon }(见 utils/tabs.ts),
 * 不再把整个路由对象写进 localStorage。
 */
export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabsList: [] as TabItem[],
  }),
  actions: {
    // 添加标签页(首页始终排在最前)
    addTab(route: RouteLocationNormalizedLoaded) {
      const tab = normalizeTab(route);
      if (!tab) return;

      if (!this.tabsList.some((item) => item.path === HOME_PATH)) {
        this.tabsList.unshift(createHomeTab());
      }
      // 避免重复添加
      if (this.tabsList.some((item) => item.path === tab.path)) return;
      this.tabsList.push(tab);
    },

    // 关闭标签页,返回关闭后应该停留的路径
    closeTab(path: string) {
      this.tabsList = this.tabsList.filter((item) => item.path !== path);
      return this.tabsList.length > 0
        ? this.tabsList[this.tabsList.length - 1].path
        : HOME_PATH;
    },

    // 关闭当前标签页
    closeCurrentTab(path: string) {
      return this.closeTab(path);
    },

    // 关闭其他标签页(保留首页与当前页)
    closeOtherTabs(path: string) {
      this.tabsList = this.tabsList.filter(
        (item) => item.path === path || item.path === HOME_PATH,
      );
    },

    // 关闭所有标签页
    closeAllTabs() {
      this.tabsList = [];
      return HOME_PATH;
    },
  },
  persist: {
    key: 'tabsList',
    storage: localStorage,
    /**
     * 兼容旧数据:老版本持久化的是完整路由对象,
     * 水合之后统一整理成 { path, title, icon } 并丢掉多余字段。
     * (钩子名在本插件 4.x 里是 afterHydrate)
     */
    afterHydrate: (ctx) => {
      const store = ctx.store as unknown as { tabsList: unknown[] };
      store.tabsList = (store.tabsList ?? [])
        .map(normalizeTab)
        .filter((item): item is TabItem => item !== null);
    },
  },
});

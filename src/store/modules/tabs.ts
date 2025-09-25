import { defineStore } from 'pinia';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import router from '@/router';

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabsList: [] as RouteLocationNormalizedLoaded[],
  }),
  actions: {
    // 添加标签页
    addTab(route: RouteLocationNormalizedLoaded) {
      // 确保首页标签存在
      const hasHome = this.tabsList.some((tab) => tab.path === '/home');
      if (!hasHome) {
        // 如果当前路由就是首页，则直接用当前路由信息
        if (route.path === '/home') {
          this.tabsList.push(route);
        } else {
          // 否则通过router获取首页路由配置
          const home = router.getRoutes().find((r) => r.path === '/home');
          if (home) {
            this.tabsList.push({
              ...home,
              path: '/home',
              meta: home.meta,
            } as unknown as RouteLocationNormalizedLoaded);
          }
        }
      }

      // 避免重复添加
      if (!this.tabsList.some((tab) => tab.path === route.path)) {
        this.tabsList.push(route);
      }
    },

    // 关闭标签页
    closeTab(path: string) {
      const index = this.tabsList.findIndex((item) => item.path === path);
      if (index !== -1) {
        this.tabsList.splice(index, 1);
      }
      return this.tabsList.length > 0
        ? this.tabsList[this.tabsList.length - 1].path
        : '/home';
    },

    // 关闭当前标签页
    closeCurrentTab(path: string) {
      return this.closeTab(path);
    },

    // 关闭其他标签页
    closeOtherTabs(path: string) {
      // 保留首页标签和当前选中的标签页
      this.tabsList = this.tabsList.filter(
        (item) => item.path === path || item.path === '/home',
      );
    },

    // 关闭所有标签页
    closeAllTabs() {
      this.tabsList = [];
      return '/home';
    },
  },
  persist: [
    {
      key: 'tabsList',
      storage: sessionStorage,
    },
  ],
});

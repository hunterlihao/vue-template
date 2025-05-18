import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import router from '@/router';

export const useTabsStore = defineStore('tabs', () => {
  // 保存当前所有标签页的数组
  const tabsList = ref<RouteLocationNormalizedLoaded[]>([]);

  // 添加标签页
  const addTab = (route: RouteLocationNormalizedLoaded) => {
    // 确保首页标签存在
    const hasHome = tabsList.value.some((tab) => tab.path === '/home');
    if (!hasHome) {
      // 如果当前路由就是首页，则直接用当前路由信息
      if (route.path === '/home') {
        tabsList.value.push(route);
      } else {
        // 否则通过router获取首页路由配置
        const home = router.getRoutes().find((r) => r.path === '/home');
        if (home) {
          tabsList.value.push({
            ...home,
            path: '/home',
            meta: home.meta,
          } as unknown as RouteLocationNormalizedLoaded);
        }
      }
    }

    // 避免重复添加
    if (!tabsList.value.some((tab) => tab.path === route.path)) {
      tabsList.value.push(route);
    }
  };

  // 关闭标签页
  const closeTab = (path: string) => {
    const index = tabsList.value.findIndex((item) => item.path === path);
    if (index !== -1) {
      tabsList.value.splice(index, 1);
    }
    return tabsList.value.length > 0
      ? tabsList.value[tabsList.value.length - 1].path
      : '/home';
  };

  // 关闭当前标签页
  const closeCurrentTab = (path: string) => {
    return closeTab(path);
  };

  // 关闭其他标签页
  const closeOtherTabs = (path: string) => {
    tabsList.value = tabsList.value.filter((item) => item.path === path);
  };

  // 关闭所有标签页
  const closeAllTabs = () => {
    tabsList.value = [];
    return '/home';
  };

  return {
    tabsList,
    addTab,
    closeTab,
    closeCurrentTab,
    closeOtherTabs,
    closeAllTabs,
  };
});

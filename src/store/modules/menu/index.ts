import type { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import type { DynamicMenuType } from '@/api/menu/type';
import { getMenuListApi } from '@/api/menu';
import { removeDynamicRoutes } from '@/router/dynamic.ts';
import Layout from '@/layout/index.vue';

// 预扫描 views 下所有页面组件,用于把菜单里的组件路径映射成懒加载函数
// (原来的 import(`../../../views/${componentPath}`) 无法被 Vite 静态分析,
//  打包后这些页面不会生成 chunk,按菜单跳转会 404)
const viewModules = import.meta.glob('@/views/**/*.vue');

/** 把菜单里的组件路径解析成页面组件(找不到时回落到 404 页面) */
function resolveViewComponent(componentPath: string) {
  const fallback = viewModules['/src/views/404/index.vue'];
  let viewPath = String(componentPath || '').replace(/^\/+/, '');
  if (!viewPath) return fallback;
  if (!viewPath.endsWith('.vue')) viewPath += '.vue';
  const key = `/src/views/${viewPath}`;
  const loader = viewModules[key];
  if (!loader) {
    console.warn(`[menu] 未找到菜单对应的页面组件: ${key}`);
    return fallback;
  }
  return loader;
}

// 定义菜单仓库状态类型
interface MenuState {
  dynamicRoutes: RouteRecordRaw[];
}

export const useMenuStore = defineStore('Menu', {
  // 注意:菜单/路由不做持久化。路由必须每次都由服务端返回的菜单重新构建,
  // 否则本地存储里被改写的内容会被当成可信配置注册进路由表。
  state: (): MenuState => ({
    dynamicRoutes: [],
  }),

  getters: {
    getDynamicRoutes(state) {
      return state.dynamicRoutes;
    },
  },

  actions: {
    // 设置动态路由
    setDynamicRoutes(routes: RouteRecordRaw[]) {
      this.dynamicRoutes = routes;
    },

    /**
     * 拉取菜单并转换为路由。
     * 失败时抛出,由调用方决定是重试还是跳登录,不在这里吞掉。
     */
    async getMenuList(userId: string): Promise<RouteRecordRaw[]> {
      const res = await getMenuListApi(userId);
      if (!res || res.code !== 200) return [];
      const dynamicRoutes = this.transformMenuToRoutes(res.data);
      this.setDynamicRoutes(dynamicRoutes);
      return dynamicRoutes;
    },

    // 将菜单数据转换为路由格式
    transformMenuToRoutes(menuData: DynamicMenuType[]): RouteRecordRaw[] {
      if (!Array.isArray(menuData)) return [];
      return menuData.map((menu) => {
        const route: RouteRecordRaw = {
          path: menu.path,
          name: menu.name,
          meta: {
            title: menu.meta.title,
            icon: menu.meta.icon,
            roles: menu.meta.roles,
          },
        } as RouteRecordRaw;

        // 处理组件
        if (menu.component === 'Layout') {
          route.component = Layout;
        } else {
          // 后端返回的组件路径(如 /system/User/UserList.vue)-> 页面组件
          route.component = resolveViewComponent(menu.component);
        }

        // 处理子路由
        if (menu.children && menu.children.length > 0) {
          const children = this.transformMenuToRoutes(menu.children);
          route.children = children;
          // 如果有子路由，设置重定向到第一个子路由
          if (children.length > 0) {
            route.redirect = children[0].path;
          }
        }

        return route;
      });
    },

    // 清空菜单路由(同时把它注册到 router 的路由一并注销)
    clearMenuRoutes() {
      removeDynamicRoutes(this.dynamicRoutes);
      this.dynamicRoutes = [];
    },
  },
});

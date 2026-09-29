// 菜单相关仓库
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import type { DynamicMenuType } from '@/api/menu/type';
import { getMenuListApi } from '@/api/menu';
import Layout from '@/layout/index.vue';
import router from '@/router/index.ts';

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
  menuRoutes: RouteRecordRaw[];
  dynamicRoutes: RouteRecordRaw[];
}

export const useMenuStore = defineStore('Menu', {
  state: (): MenuState => ({
    menuRoutes: [],
    dynamicRoutes: [],
  }),

  getters: {
    getMenuRoutes(state) {
      return state.menuRoutes;
    },
    getDynamicRoutes(state) {
      return state.dynamicRoutes;
    },
  },

  actions: {
    // 设置菜单路由
    setMenuRoutes(routes: RouteRecordRaw[]) {
      this.menuRoutes = routes;
    },

    // 设置动态路由
    setDynamicRoutes(routes: RouteRecordRaw[]) {
      this.dynamicRoutes = routes;
    },

    // 获取动态菜单数据
    async getMenuList(userId: string) {
      try {
        const res = await getMenuListApi(userId);
        if (res && res.code === 200) {
          // 将后端返回的菜单数据转换为路由格式
          const dynamicRoutes = this.transformMenuToRoutes(res.data);
          this.setDynamicRoutes(dynamicRoutes);
          // 保存到本地存储
          localStorage.setItem('dynamicRoutes', JSON.stringify(res.data));
          return dynamicRoutes;
        }
        return [];
      } catch (error) {
        console.error('获取菜单列表失败:', error);
        return [];
      }
    },

    // 将菜单数据转换为路由格式
    transformMenuToRoutes(menuData: DynamicMenuType[]): RouteRecordRaw[] {
      return menuData.map((menu) => {
        const route: any = {
          path: menu.path,
          name: menu.name,
          meta: {
            title: menu.meta.title,
            icon: menu.meta.icon,
            roles: menu.meta.roles,
          },
        };

        // 处理组件
        if (menu.component === 'Layout') {
          route.component = Layout;
        } else {
          // 后端返回的组件路径(如 /system/User/UserList.vue)-> 页面组件
          route.component = resolveViewComponent(menu.component);
        }

        // 处理子路由
        if (menu.children && menu.children.length > 0) {
          route.children = this.transformMenuToRoutes(menu.children);
          // 如果有子路由，设置重定向到第一个子路由
          if (route.children && route.children.length > 0) {
            route.redirect = route.children[0].path;
          }
        }

        return route;
      });
    },

    // 从本地存储恢复动态路由
    restoreDynamicRoutes() {
      try {
        const dynamicRoutesStr = localStorage.getItem('dynamicRoutes');
        if (dynamicRoutesStr) {
          const menuData = JSON.parse(dynamicRoutesStr);
          const dynamicRoutes = this.transformMenuToRoutes(menuData);
          this.setDynamicRoutes(dynamicRoutes);
          return dynamicRoutes;
        }
      } catch (error) {
        console.error('恢复动态路由失败:', error);
      }
      return [];
    },

    // 清空菜单路由
    clearMenuRoutes() {
      // 移除之前添加的动态路由
      this.dynamicRoutes.forEach((route) => {
        if (route.name) {
          router.removeRoute(route.name);
        }
      });

      this.menuRoutes = [];
      this.dynamicRoutes = [];
      localStorage.removeItem('dynamicRoutes');
    },
  },

  persist: {
    key: 'menu',
    storage: localStorage,
  },
});

// 菜单相关仓库
import { defineStore } from 'pinia';
import type { RouteRecordRaw } from 'vue-router';
import type { DynamicMenuType } from '@/api/menu/type';
import { getMenuListApi } from '@/api/menu';
import Layout from '@/layout/index.vue';
import router from '@/router/index.ts';

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
          // 动态导入组件 - 修正路径处理
          // 处理后端返回的不同格式的组件路径 (现在以 '/' 开头)
          let componentPath = menu.component;

          // 标准化路径 - 移除开头的 '/'
          if (componentPath.startsWith('/')) {
            componentPath = componentPath.substring(1);
          }

          // 直接使用动态导入，Vite 会处理模块解析
          // 从 src/store/modules/menu/index.ts 到 src/views 需要 ../../../views/
          route.component = () => import(`../../../views/${componentPath}`);
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

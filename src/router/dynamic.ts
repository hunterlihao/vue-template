/**
 * 动态路由的注册与注销。
 *
 * 单独成模块的原因:注册/注销路由需要 router 实例,
 * 如果写在 store 里就会形成 store -> router -> permission -> store 的循环依赖。
 * store 只负责数据,路由的增删由这里统一处理。
 */
import type { RouteRecordRaw } from 'vue-router';
import router from '@/router';

/** 注册动态路由(同名路由重复注册会被跳过) */
export function addDynamicRoutes(routes: RouteRecordRaw[]): void {
  routes.forEach((route) => {
    if (route.name && !router.hasRoute(route.name)) {
      router.addRoute(route);
    }
  });
}

/** 注销动态路由 */
export function removeDynamicRoutes(routes: RouteRecordRaw[]): void {
  routes.forEach((route) => {
    if (route.name && router.hasRoute(route.name)) {
      router.removeRoute(route.name);
    }
  });
}

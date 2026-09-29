import 'vue-router';

/**
 * 扩展 vue-router 的 RouteMeta 类型。
 *
 * 默认 RouteMeta 的字段是 unknown,导致 route.meta.title / icon 传到
 * 子组件 props 时类型报错。这里把项目实际用到的菜单字段声明出来。
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 菜单/标签页标题 */
    title?: string;
    /** 菜单图标(element-plus 图标组件名) */
    icon?: string;
    /** 是否在菜单中隐藏 */
    hidden?: boolean;
    /** 可访问该路由的角色 */
    roles?: string[];
  }
}

// 路由鉴权:登录态判断、权限与动态路由加载、进度条
import router from '@/router';
import setting from './setting';
import nprogress from 'nprogress';
//引入进度条样式
import 'nprogress/nprogress.css';
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import { useUserStore } from './store/modules/user';
import pinia from './store';
import { useTabsStore } from '@/store/modules/tabs.ts';

nprogress.configure({ showSpinner: false });

const userStore = useUserStore(pinia);
const tabsStore = useTabsStore(pinia);

/**
 * 全局前置守卫。
 *
 * 与旧实现的关键差别:
 *  1. 启动时不再从 localStorage 恢复动态路由 —— 路由只能来自本次会话里
 *     服务端返回的菜单,本地存储里的内容一律不可信。
 *  2. 用 permissionsLoaded 标记"已加载",而不是靠 codeList.length > 0。
 *     后端返回空权限时旧写法永远进不了放行分支,会无限重定向。
 *  3. 权限接口失败时清空会话再跳登录,不再依赖 logout 接口的成功与否。
 */
router.beforeEach(async (to, _from, next) => {
  document.title = `${setting.title} - ${to.meta.title ?? ''}`;
  nprogress.start();

  // 未登录:只放行登录页,其余带上 redirect
  if (!userStore.token) {
    if (to.path === '/login') return next();
    return next({ path: '/login', query: { redirect: to.path } });
  }

  // 已登录不要再进登录页
  if (to.path === '/login') return next({ path: '/' });

  // 每个会话只加载一次权限与动态路由
  if (!userStore.permissionsLoaded) {
    try {
      await userStore.loadPermissions();
      // 用 replace 重新进入当前地址,让刚注册的动态路由生效
      return next({ ...to, replace: true });
    } catch {
      // 令牌失效或接口异常:清空本地会话后回登录页
      userStore.resetSession();
      tabsStore.closeAllTabs();
      return next({ path: '/login', query: { redirect: to.path } });
    }
  }

  // 已加载完成:登记标签页并放行
  if (to.meta.title && to.path !== '/404') {
    tabsStore.addTab(to);
  }
  return next();
});

// 全局后置守卫
router.afterEach(() => {
  nprogress.done();
});

// 路由出错(例如懒加载 chunk 失败)时也要收掉进度条
router.onError(() => {
  nprogress.done();
});

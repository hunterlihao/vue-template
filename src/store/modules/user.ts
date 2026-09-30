// 用户相关仓库
import { defineStore } from 'pinia';
import type { UserState } from '@/store/modules/types/type.ts';
import { constantRoute } from '@/router/router.ts';
import { getUserInfoApi, logoutApi } from '@/api/user';
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token.ts';
import { clearAppStorage } from '@/utils/storage.ts';
import { addDynamicRoutes } from '@/router/dynamic.ts';
import { useMenuStore } from './menu/index.ts';

export const useUserStore = defineStore('User', {
  /**
   * 注意:权限码、菜单路由、token 都不放在持久化范围内。
   *  - token 由 utils/token.ts 单独管理(单一来源)
   *  - 权限码与菜单必须每次会话重新向服务端获取,否则改一改本地存储就能伪造权限
   */
  state: (): UserState => ({
    userId: '',
    nickName: '',
    avatarUrl: '',
    token: GET_TOKEN(),
    codeList: [],
    permissionsLoaded: false,
    menuRoutes: constantRoute,
  }),

  getters: {
    getUserId(state) {
      return state.userId;
    },
    getNickName(state) {
      return state.nickName;
    },
    getAvatar(state) {
      return state.avatarUrl;
    },
    getToken(state) {
      return state.token;
    },
    getCodeList(state) {
      return state.codeList;
    },
  },

  actions: {
    setUserId(userId: string) {
      this.userId = userId;
    },
    setNickName(nickName: string) {
      this.nickName = nickName;
    },
    setToken(token: string) {
      this.token = token || null;
      if (token) {
        SET_TOKEN(token);
      } else {
        REMOVE_TOKEN();
      }
    },
    setCodeList(codeList: string[]) {
      this.codeList = Array.isArray(codeList) ? codeList : [];
    },
    setAvatar(avatarUrl: string) {
      this.avatarUrl = avatarUrl;
    },

    /**
     * 拉取用户信息、权限码与动态菜单,并注册动态路由。
     * 只在路由守卫里调用一次(靠 permissionsLoaded 标记)。
     * 注意这里不做长度判断:后端返回空权限也是"已加载",
     * 否则守卫会反复重入,直到 vue-router 报无限重定向。
     */
    async loadPermissions(): Promise<void> {
      const res = await getUserInfoApi(this.userId);
      if (!res || res.code !== 200) {
        throw new Error('获取用户信息失败');
      }

      this.setCodeList(res.data?.permissions);

      if (res.data?.user) {
        this.userId = res.data.user.userId || this.userId;
        this.nickName = res.data.user.nickName || this.nickName;
        this.avatarUrl = res.data.user.avatarUrl || this.avatarUrl;
      }

      // 获取动态菜单并注册路由(注册动作在 router/dynamic.ts 里,store 不直接碰 router)
      const menuStore = useMenuStore();
      const dynamicRoutes = await menuStore.getMenuList(this.userId);
      addDynamicRoutes(dynamicRoutes);

      // 合并常量路由和动态路由
      this.menuRoutes = [...constantRoute, ...dynamicRoutes];
      this.permissionsLoaded = true;
    },

    /** 清空本地会话:状态、存储、动态路由 */
    resetSession() {
      // 先注销动态路由(要拿旧的 dynamicRoutes,必须在清空之前)
      const menuStore = useMenuStore();
      menuStore.clearMenuRoutes();

      this.userId = '';
      this.nickName = '';
      this.avatarUrl = '';
      this.token = null;
      this.codeList = [];
      this.permissionsLoaded = false;
      this.menuRoutes = constantRoute;

      REMOVE_TOKEN();
      clearAppStorage();
    },

    /**
     * 退出登录。
     * 接口调用是"尽力而为":断网/500/令牌过期都不影响本地退出,
     * 也绝不向外抛异常 —— 否则调用方后面的跳转代码不会执行。
     */
    async logout(): Promise<void> {
      try {
        await logoutApi();
      } catch {
        // 服务端登出失败不阻塞本地登出
      } finally {
        this.resetSession();
      }
    },
  },

  // 只持久化展示用的用户信息;token / 权限码 / 菜单路由都在 select 之外
  persist: {
    key: 'user',
    storage: localStorage,
    pick: ['userId', 'nickName', 'avatarUrl'],
  },
});

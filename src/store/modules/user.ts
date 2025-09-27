// 用户相关仓库
import { defineStore } from 'pinia';
import type { UserState } from '@/store/modules/types/type.ts';
import { constantRoute } from '@/router/router.ts';
import { getUserInfoApi, logoutApi } from '@/api/user';
import { GET_TOKEN, REMOVE_TOKEN } from '@/utils/token.ts';
import { useMenuStore } from './menu/index.ts';

// 从本地存储获取用户信息
function getUserInfoFromLocalStorage() {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        userId: user.userId || '',
        nickName: user.nickName || '',
        avatarUrl: user.avatarUrl || '',
      };
    }
  } catch (error) {
    console.error('解析用户信息失败:', error);
  }
  return {
    userId: '',
    nickName: '',
    avatarUrl: '',
  };
}

export const useUserStore = defineStore('User', {
  // 存储数据
  state: (): UserState => {
    const userInfo = getUserInfoFromLocalStorage();
    return {
      userId: userInfo.userId,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      token: GET_TOKEN(),
      codeList: (() => {
        try {
          const codeListStr = localStorage.getItem('codeList');
          return codeListStr ? JSON.parse(codeListStr) : [];
        } catch {
          return [];
        }
      })(),
      menuRoutes: constantRoute, // 添加菜单路由数据
    };
  },
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
  // 异步/逻辑
  actions: {
    setUserId(userId: string) {
      this.userId = userId;
    },
    setNickName(nickName: string) {
      this.nickName = nickName;
    },
    setToken(token: string) {
      this.token = token;
    },
    setCodeList(codeList: any) {
      this.codeList = codeList;
    },
    setAvatar(avatarUrl: string) {
      this.avatarUrl = avatarUrl;
    },
    async getUserInfo() {
      return new Promise<void>(async (resolve, reject) => {
        try {
          // 获取用户权限信息
          const res = await getUserInfoApi(this.userId);
          if (res && res.code === 200) {
            this.codeList = res.data.permissions;
            localStorage.setItem(
              'codeList',
              JSON.stringify(res.data.permissions),
            );

            // 设置用户信息
            if (res.data.user) {
              this.userId = res.data.user.userId || this.userId;
              this.nickName = res.data.user.nickName || this.nickName;
              this.avatarUrl = res.data.user.avatarUrl || this.avatarUrl;

              // 保存用户信息到本地存储
              localStorage.setItem(
                'user',
                JSON.stringify({
                  userId: this.userId,
                  nickName: this.nickName,
                  avatarUrl: this.avatarUrl,
                }),
              );
            }

            // 获取动态菜单
            const menuStore = useMenuStore();
            const dynamicRoutes = await menuStore.getMenuList(this.userId);

            // 合并常量路由和动态路由
            this.menuRoutes = [...constantRoute, ...dynamicRoutes];
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    async logout() {
      let res = await logoutApi();
      if (res && res.code === 200) {
        this.userId = '';
        this.nickName = '';
        this.avatarUrl = '';
        this.token = '';
        this.codeList = [];
        this.menuRoutes = constantRoute;
        localStorage.removeItem('codeList');
        localStorage.removeItem('user');
        localStorage.removeItem('menu');
        REMOVE_TOKEN();

        // 清空菜单路由
        const menuStore = useMenuStore();
        menuStore.clearMenuRoutes();

        return res.code;
      }
    },
  },
  persist: {
    key: 'user',
    storage: localStorage,
    // pick: ['userId', 'nickName', 'token', 'avatarUrl', 'codeList'],
  },
});

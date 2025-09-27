// 用户相关仓库
import { defineStore } from 'pinia';
import type { UserState } from '@/store/modules/types/type.ts';
import { constantRoute } from '@/router/router.ts';
import { getUserInfoApi, logoutApi } from '@/api/user';
import { GET_TOKEN, REMOVE_TOKEN } from '@/utils/token.ts';

export const useUserStore = defineStore('User', {
  // 存储数据
  state: (): UserState => ({
    userId: '',
    nickName: '',
    avatarUrl: '',
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
    getUserInfo() {
      return new Promise<void>((resolve, reject) => {
        getUserInfoApi(this.userId)
          .then((res) => {
            if (res && res.code === 200) {
              this.codeList = res.data.permissions;
              localStorage.setItem(
                'codeList',
                JSON.stringify(res.data.permissions),
              );
            }
            resolve(this.codeList);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    async logout() {
      let res = await logoutApi();
      if (res && res.code === 200) {
        this.userId = '';
        this.nickName = '';
        this.avatarUrl = '';
        this.token = '';
        localStorage.removeItem('codeList');
        localStorage.removeItem('user');
        REMOVE_TOKEN();
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

// 用户相关仓库
import { defineStore } from 'pinia';
import type { UserState } from '@/store/modules/types/type.ts';
import { constantRoute } from '@/router/router.ts';

export const useUserStore = defineStore('User', {
  // 存储数据
  state: (): UserState => ({
    userId: '',
    username: '',
    nickName: '',
    avatarUrl: '',
    token: '',
    codeList: JSON.parse(localStorage.getItem('codeList') || '[]'),
    menuRoutes: constantRoute, // 添加菜单路由数据
  }),
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getUsername(state) {
      return state.username;
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
    getMenuRoutes(state) {
      return state.menuRoutes;
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
    setMenuRoutes(menuRoutes: any) {
      this.menuRoutes = menuRoutes;
    },
  },
});

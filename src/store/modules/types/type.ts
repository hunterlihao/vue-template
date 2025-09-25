import type { RouteRecordRaw } from 'vue-router';

//定义仓库state类型
export interface UserState {
  userId: string;
  username: string;
  nickName: string;
  avatarUrl: string;
  token: string;
  codeList: any;
  menuRoutes: RouteRecordRaw[];
}

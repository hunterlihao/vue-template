import type { RouteRecordRaw } from 'vue-router';

//定义仓库state类型
export interface UserState {
  userId: string;
  nickName: string;
  avatarUrl: string;
  token: string | null;
  codeList: any;
  menuRoutes: RouteRecordRaw[];
}

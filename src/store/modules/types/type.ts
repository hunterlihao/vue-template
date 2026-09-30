import type { RouteRecordRaw } from 'vue-router';

//定义仓库state类型
export interface UserState {
  userId: string;
  nickName: string;
  avatarUrl: string;
  token: string | null;
  /** 服务端返回的按钮权限码 */
  codeList: string[];
  /** 本次会话是否已成功加载过权限与动态路由(不持久化) */
  permissionsLoaded: boolean;
  menuRoutes: RouteRecordRaw[];
}

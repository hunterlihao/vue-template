// 用户相关接口
import request from '@/utils/request.ts';
import type {
  LoginForm,
  LoginResponseData,
  UserInfoResponseData,
} from '@/api/user/type.ts';

// 统一管理接口
const API = {
  LOGIN_URL: '/user/login',
  USER_INFO_URL: '/user/info',
} as const;

// 登录接口
export const reqLogin = (data: LoginForm) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data);

// 获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, UserInfoResponseData>(API.USER_INFO_URL);

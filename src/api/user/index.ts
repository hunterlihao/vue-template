// 用户相关接口
import request from '@/utils/request.ts';
import type {
  LoginForm,
  LoginResponseData,
  UserInfoResponseData,
  ValidateUCodeData,
} from '@/api/user/type.ts';

// 统一管理接口
const API = {
  LOGIN_URL: '/user/login',
  USER_INFO_URL: '/user/info',
  VALIDATE_CODE_URL: '/user/code',
  LOGOUT_URL: '/user/logout',
} as const;

// 登录接口
export const reqLogin = (data: LoginForm) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data);

// 获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, UserInfoResponseData>(API.USER_INFO_URL);

/**
 * 获取验证码
 */
export const reqGetCode = () =>
  request.get<any, ValidateUCodeData>(API.VALIDATE_CODE_URL);

/**
 * 退出登录
 */
export const reqLogout = () => request.get(API.LOGOUT_URL);

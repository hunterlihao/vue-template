// 用户相关仓库
import { defineStore } from 'pinia';
import { reqLogin, reqUserInfo } from '@/api/user';
import type { LoginForm, LoginResponseData } from '@/api/user/type.ts';
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from '@/utils/token.ts';
import type { UserState } from '@/store/modules/types/type.ts';

// 引入常量路由
import { constantRoute } from '@/router/router.ts';

export const useUserStore = defineStore('User', {
  // 存储数据
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // token
      menuRoutes: constantRoute, //  菜单路由
      username: '',
      avatar: '',
      //存储当前用户是否包含某一个按钮
      buttons: [],
    };
  },
  // 异步/逻辑
  actions: {
    async login(data: LoginForm) {
      const result: LoginResponseData = await reqLogin(data);
      if (result.code === 200) {
        // 存储token
        this.token = result.data.token as string;
        // 本地持久化存储token
        SET_TOKEN(result.data.token as string);
        // 保证当前async函数返回成功的Promise
        return 'ok';
      } else {
        return Promise.reject(new Error(result.data.message));
      }
    },
    // 获取用户信息
    async userInfo() {
      //请求用户信息
      const result: any = await reqUserInfo();
      //判断请求是否成功
      if (result.code === 200) {
        //将用户信息存储到pinia中
        this.username = result.data.checkUser.username;
        this.avatar = result.data.checkUser.avatar;
        return 'ok';
      } else {
        return Promise.reject(new Error(result.data.message));
      }
    },
    //退出登录
    userLogout() {
      /*//退出登录请求
      const result: any = await reqLogout();
      if (result.code == 200) {*/
      //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
      this.token = '';
      this.username = '';
      this.avatar = '';
      REMOVE_TOKEN();
      return 'ok';
      /*} else {
        return Promise.reject(new Error(result.message));
      }*/
    },
  },
  // 计算属性
  getters: {},
});

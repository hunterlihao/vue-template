// 对axios进行封装
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/modules/user.ts';
// 利用create方法创建axios实例
const request = axios.create({
  // 设置请求的根路径 基础路径会携带/api
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
});
// 请求拦截器
request.interceptors.request.use((config) => {
  // config配置对象，里面有headers请求头，经常给服务器携带token
  // 返回配置对象
  //获取用户相关的小仓库:获取仓库内部token,登录成功以后携带给服务器
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 响应成功
    return response.data;
  },
  (error) => {
    // 响应失败
    // 提示错误信息
    let message: string = '';
    const status = error.response.status;
    switch (status) {
      case 401:
        message = 'token过期';
        break;
      case 403:
        message = '无权访问';
        break;
      case 404:
        message = '请求地址错误';
        break;
      case 500:
        message = '服务器故障';
        break;
      default:
        message = '网络错误';
        break;
    }
    ElMessage({
      type: 'error',
      message,
    });
    return Promise.reject(error);
  },
);

export default request;

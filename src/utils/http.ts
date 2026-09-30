// 对axios进行封装
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/modules/user.ts';
import type { Result } from '@/types';

const config: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API, // 请求接口的地址
  timeout: 5000, // 请求超时时间
};

/** HTTP 状态码对应的提示文案 */
const STATUS_TEXT: Record<number, string> = {
  400: '错误请求',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求错误，未找到接口',
  405: '请求方法未允许',
  408: '请求超时',
  500: '后台接口出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'http版本不支持该请求',
};

/**
 * 登录态失效处理。
 *  - 只清理本应用自己的存储(见 utils/storage.ts),不用 localStorage.clear()
 *  - 用 router 跳转而不是 location.href:本项目是 hash 路由,
 *    直接改 href 会绕开前端路由,静态托管下还会 404
 *  - router 用动态 import 引入,避免 http -> router -> store -> http 的循环依赖
 *  - redirecting 标记避免并发请求时反复跳转
 */
let redirecting = false;
async function handleUnauthorized(): Promise<void> {
  if (redirecting) return;
  redirecting = true;
  try {
    useUserStore().resetSession();
    const { default: router } = await import('@/router');
    const from = router.currentRoute.value;
    await router.replace({
      path: '/login',
      query: from.path === '/login' ? {} : { redirect: from.fullPath },
    });
  } finally {
    redirecting = false;
  }
}

class Http {
  // 初始化axios
  private instance: AxiosInstance;
  // 初始化
  constructor(configs: AxiosRequestConfig) {
    // 创建axios实例
    this.instance = axios.create(configs);
    // 配置拦截器
    this.interceptors();
  }
  // 请求发送，返回之后处理
  private interceptors() {
    // 添加请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // token 只有一个来源:user store(内部读 utils/token.ts)
        const token = useUserStore().getToken;
        if (token && config.headers) {
          config.headers['token'] = token;
        }
        return config;
      },
      // 请求没发出去就失败,原样抛出,不要 resolve 成普通值
      (error) => Promise.reject(error),
    );

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data;
        // 业务码 401:登录态失效
        if (data?.code === 401) {
          handleUnauthorized();
          return Promise.reject(new Error('登录已过期，请重新登录'));
        }
        if (data?.code === 200) {
          return data;
        }
        // 显示后端返回的错误信息
        const errorMsg = data?.msg || data?.message || '服务器出错！';
        ElMessage.error(errorMsg);
        return Promise.reject(new Error(errorMsg));
      },
      (error) => {
        const status: number | undefined = error?.response?.status;
        // 真正的 HTTP 401 同样要走失效处理,旧实现只弹了个提示
        if (status === 401) {
          handleUnauthorized();
        }
        const errorMsg =
          error?.response?.data?.msg ||
          error?.response?.data?.message ||
          (status ? STATUS_TEXT[status] : '') ||
          (status ? `连接错误${status}` : '连接到服务器失败');
        ElMessage.error(errorMsg);
        return Promise.reject(error);
      },
    );
  }
  // Post
  post<T = Result>(url: string, data?: object): Promise<T> {
    return this.instance.post(url, data);
  }
  //Put
  put<T = Result>(url: string, data?: object): Promise<T> {
    return this.instance.put(url, data);
  }
  //Get
  get<T = Result>(url: string, params?: object): Promise<T> {
    return this.instance.get(url, { params });
  }
  // Delete
  delete<T = Result>(url: string): Promise<T> {
    return this.instance.delete(url);
  }
}

export default new Http(config);

import { createApp } from 'vue';
import App from './App.vue';
// 引入element-plus插件与样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//@ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// 引入自定义插件对象
import globalComponent from './components/index';
// 引入持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

// 引入全局样式
import '@/styles/index.scss';

//  引入路由
import router from '@/router';
// 引入自定义路由守卫
import './permission';
// 引入pinia
import pinia from '@/store';
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css';

import myConfirm from '@/utils/myConfirm.ts';

const app = createApp(App);
// 安装element-plus 并国际化
app.use(ElementPlus, {
  locale: zhCn, // 国际化配置
});
// 使用持久化插件
pinia.use(piniaPluginPersistedstate);
// 注册项目全局组件
app.use(globalComponent);
// 注册路由
app.use(router);

// 注册pinia
app.use(pinia);

// 将app挂载到dom中
app.mount('#app');
//全局挂载
app.config.globalProperties.$myConfirm = myConfirm;

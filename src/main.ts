import { createApp } from 'vue';
import App from './App.vue';
// 引入element-plus插件与样式
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
//@ts-expect-error忽略当前文件ts类型的检测否则有红色提示(打包会失败)国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

//@ts-expect-error svg插件 需要的配置代码
import 'virtual:svg-icons-register';

// 引入自定义插件对象
import globalComponent from './components/index';

// 引入全局样式
import '@/styles/index.scss';

const app = createApp(App);
// 安装element-plus 并国际化
app.use(ElementPlus, {
  locale: zhCn, // 国际化配置
});
// 注册项目全局组件
app.use(globalComponent);

// 将app挂载到dom中
app.mount('#app');

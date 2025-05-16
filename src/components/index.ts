import SvgIcon from './SvgIcon/index.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

const allGlobalComponent: any = { SvgIcon };
// 对外暴露的插件
export default {
  install(app: any) {
    // 全局注册所有组件
    Object.keys(allGlobalComponent).forEach((key: string) => {
      app.component(key, allGlobalComponent[key]);
    });
    // 将 ElementPlusIconsVue 全部注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component as any);
    }
  },
};

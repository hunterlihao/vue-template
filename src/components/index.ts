import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// 对外暴露的插件
export default {
  install(app: any) {
    // 将 ElementPlusIconsVue 全部注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component as any);
    }
  },
};

import type { App } from 'vue';
import { icons } from './icons.ts';

/**
 * 全局插件:只注册 icons.ts 里登记过的 Element Plus 图标。
 *
 * 为什么要白名单:模板里大量使用 `icon="Search"` 这种字符串写法,
 * 它依赖全局注册;而全量注册会把整套图标库打进产物。
 *
 * 说明:通用组件(SysDialog / SelectChecked / UploadImg)不做全局注册,
 * 由使用方显式 import —— 这样它们才能跟着所在路由一起懒加载。
 */
export default {
  install(app: App) {
    Object.entries(icons).forEach(([name, component]) => {
      app.component(name, component);
    });
  },
};

/**
 * 全局注册的 Element Plus 图标白名单。
 *
 * 早期实现是把 `@element-plus/icons-vue` 里的**全部**图标注册成全局组件,
 * 这会强制打包整套图标库(压缩后约 200KB)。
 * 现在改成显式登记:模板里仍然可以写 `icon="Search"` 这种字符串写法,
 * 但只有登记过的图标才会进入产物。
 *
 * 新增图标:在下面 import 并加入 icons 即可;
 * 后端菜单返回了未登记的图标名时会回落到 Menu 图标,不会渲染空白。
 */
import type { Component } from 'vue';
import {
  ArrowRight,
  Avatar,
  DataLine,
  Delete,
  DocumentDelete,
  Download,
  Edit,
  Expand,
  Files,
  Fold,
  FullScreen,
  Goods,
  HomeFilled,
  Key,
  Lock,
  Menu,
  Plus,
  Promotion,
  Refresh,
  Search,
  Setting,
  ShoppingCart,
  SwitchButton,
  Unlock,
  Upload,
  User,
} from '@element-plus/icons-vue';

export const icons: Record<string, Component> = {
  ArrowRight,
  Avatar,
  DataLine,
  Delete,
  DocumentDelete,
  Download,
  Edit,
  Expand,
  Files,
  Fold,
  FullScreen,
  Goods,
  HomeFilled,
  Key,
  Lock,
  Menu,
  Plus,
  Promotion,
  Refresh,
  Search,
  Setting,
  ShoppingCart,
  SwitchButton,
  Unlock,
  Upload,
  User,
};

/** 按名称取图标组件;未登记时回落到 fallback(默认 Menu) */
export function iconOf(name?: string, fallback = 'Menu'): Component {
  return icons[name ?? ''] ?? icons[fallback] ?? Menu;
}

# 更新日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [1.0.0] - 2026-09-30

首个可开源版本。在原有后台管理系统的基础上做了系统性加固:

### 新增

- 单元测试(Vitest):`utils/storage`、`utils/time`、`const/rules` 共 16 个用例,另加 8 个共享组件 SSR 冒烟测试
- `.env.example`、`.editorconfig`、`.nvmrc`、CI 工作流
- `utils/storage.ts`:集中管理本地存储 key,`safeParse` 兜住损坏数据
- `router/dynamic.ts`:动态路由的注册/注销独立成模块,解开 store 与 router 的循环依赖
- 共享组件与钩子:`SearchBar`、`TablePager`、`TableEmpty`、`DictTag`、`useDelete`、`const/dict.ts`
- `components/icons.ts`:图标白名单,替换原来"注册全部 Element Plus 图标"的做法
- 列表页钩子支持行类型与筛选条件泛型:`useTablePage<SysUser>` / `PageParm<TFilter>`
- 单元测试补齐到 35 个:新增标签页数据兼容、`useTablePage` 分页/非分页/重置等用例

### 修复

- `pnpm build` 因两处类型错误而失败(`MenuList` 的死条件、`WsTest` 的隐式 any)
- `pnpm lint:style` 因配置错误完全无法运行;修复后其报告的问题已全部处理
- 认证状态被整体持久化、启动时从 localStorage 恢复动态路由 —— 改为权限与路由只由服务端返回,每次会话重新加载
- `logout()` 在接口失败时不清状态且会抛异常,导致调用方后续跳转不执行
- 权限码为空时路由守卫无限重定向
- 请求拦截器把错误 resolve 成普通值、未保护的 `JSON.parse` 会导致白屏
- 401 处理使用 `localStorage.clear()` 与 `location.href`,会清除同域其它应用数据并绕开 hash 路由
- `SysDialog` 的 `scoped` 拼写错误导致样式全局泄漏;关闭图标白底白字不可见;`v-model:visible` 从未生效
- `SelectChecked` 会修改 props、`width` 不生效、反选逻辑错误
- `RoleList` 操作列的 `style="width"` 写法无效;`setting.logoHidden` 语义反了;顶部栏高度与子元素差 15px
- `useCrudDialog` 编辑回显是浅拷贝,弹窗与表格行共享嵌套引用
- 接口路径 `getAssignTre` 拼写错误
- mock:用户列表返回密码字段、权限对所有账号都是全量、验证码不过期可复用、上传无类型与大小限制
- 重置样式中的 `font-family: inhert` 拼写错误

### 变更

- 移除开发遗留页 `WsTest.vue` 及其路由
- 删除约 92KB 无引用静态资源与 8 处空 `<style>` 块
- 文件与字段改名:`permisstion.ts` → `permission.ts`、`layout/lago/` → `layout/logo/`、`refsh` → `refresh`
- 颜色、层级统一收敛到 `styles/variable.scss`;SCSS `@import` 迁移到 `@use`
- echarts 改为按需注册 + vendor 分包,`element-plus` 不再打包全部图标

[Unreleased]: https://github.com/hunterlihao/vue-template/commits/master
[1.0.0]: https://github.com/hunterlihao/vue-template/releases

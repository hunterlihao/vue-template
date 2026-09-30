# 更新日志

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与 [语义化版本](https://semver.org/lang/zh-CN/)。

## [Unreleased]

## [1.0.0] - 2026-09-30

首个可开源版本。在原有后台管理系统的基础上做了系统性加固:

### 新增

- 单元测试(Vitest):`utils/storage`、`utils/time`、`const/rules` 共 16 个用例
- `.env.example`、`.editorconfig`、`.nvmrc`、CI 工作流
- `utils/storage.ts`:集中管理本地存储 key,`safeParse` 兜住损坏数据
- `router/dynamic.ts`:动态路由的注册/注销独立成模块,解开 store 与 router 的循环依赖

### 修复

- `pnpm build` 因两处类型错误而失败(`MenuList` 的死条件、`WsTest` 的隐式 any)
- `pnpm lint:style` 因配置错误完全无法运行;修复后其报告的问题已全部处理
- 认证状态被整体持久化、启动时从 localStorage 恢复动态路由 —— 改为权限与路由只由服务端返回,每次会话重新加载
- `logout()` 在接口失败时不清状态且会抛异常,导致调用方后续跳转不执行
- 权限码为空时路由守卫无限重定向
- 请求拦截器把错误 resolve 成普通值、未保护的 `JSON.parse` 会导致白屏
- 401 处理使用 `localStorage.clear()` 与 `location.href`,会清除同域其它应用数据并绕开 hash 路由

### 变更

- 移除开发遗留页 `WsTest.vue` 及其路由
- 重置样式中的 `font-family: inhert` 拼写错误
- SCSS 变量、keyframes 统一为 kebab-case

[Unreleased]: https://example.com/compare/v1.0.0...HEAD
[1.0.0]: https://example.com/releases/tag/v1.0.0

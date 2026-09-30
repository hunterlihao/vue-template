# vue-template

基于 **Vue 3 + TypeScript + Vite + Element Plus** 的后台管理模板。内置本地 mock,**克隆下来不需要后端就能跑通全部流程**:登录、动态菜单、按钮级权限、增删改查。

## 特性

- **技术栈**:Vue 3.5 · Vite 6.4 · TypeScript 5.8(strict)· Element Plus 2.9 · Pinia 3 · Vue Router 4
- **认证与权限**:登录/登出、动态路由、按钮级权限(`usePerm`),权限与路由只来自服务端返回
- **纯前端可运行**:`vite-plugin-mock` 提供 6 组接口(用户/角色/菜单/分类/商品/上传),含验证码
- **列表页骨架**:`useTablePage` / `useCrudDialog` / `useTableHeight` 等 hooks,统一查询、分页、弹窗与提交
- **工程化**:ESLint 9(flat config)、Prettier、Stylelint、Vitest、Husky + commitlint,全部开箱通过
- **多环境**:`.env.development` / `.env.production` / `.env.example`

## 环境要求

| 依赖    | 版本     | 说明                                                    |
| ------- | -------- | ------------------------------------------------------- |
| Node.js | >= 22.12 | Vitest 5 的要求(只跑构建的话 Vite 6 需要 20.19+)        |
| pnpm    | >= 10    | 仓库使用 pnpm 12,依赖构建白名单见 `pnpm-workspace.yaml` |

> `pnpm-workspace.yaml` 里的 `allowBuilds` / `onlyBuiltDependencies` 不能删。esbuild、vue-demi 等包需要执行安装脚本,被忽略时会出现"装了一半"的依赖(例如 element-plus 缺少 `dist/` 目录,启动直接报 `Failed to resolve import "element-plus/dist/index.css"`)。

## 快速开始

```bash
pnpm install
pnpm dev          # http://127.0.0.1:5050
```

演示账号:**admin / 123456**,也可以使用 `user2` ~ `user15`(密码同上,权限更少)。

登录页验证码由 mock 生成,点击图片可刷新。

> 需要局域网或手机访问时:`pnpm dev --host`。
> 需要自动打开浏览器时:`pnpm dev --open`。

## 常用脚本

| 脚本              | 作用                                     |
| ----------------- | ---------------------------------------- |
| `pnpm dev`        | 启动开发服务器(5050 端口,默认只监听本机) |
| `pnpm build`      | 类型检查 + 生产构建                      |
| `pnpm build:pro`  | 指定 production 模式构建                 |
| `pnpm preview`    | 预览构建产物                             |
| `pnpm type-check` | 仅做 `vue-tsc` 类型检查                  |
| `pnpm lint`       | ESLint 检查                              |
| `pnpm lint:style` | Stylelint 检查                           |
| `pnpm fix`        | ESLint + Stylelint 自动修复              |
| `pnpm format`     | Prettier 格式化                          |
| `pnpm test`       | 运行 Vitest 单元测试                     |

## 目录结构

```
├── mock/                     # 本地 mock(以 _ 开头的文件只做共享数据,不注册路由)
│   ├── _data.ts              # 用户/角色/菜单/商品等种子数据与工具函数
│   └── user.ts menu.ts ...   # 各模块接口
├── src/
│   ├── api/                  # 接口定义,每个模块 index.ts + type.ts
│   ├── components/           # 通用组件:Dialog / UploadImg / SelectCheck / SearchBar / TablePager / TableEmpty / DictTag
│   │   └── icons.ts          # Element Plus 图标白名单(新增图标要在这里登记)
│   ├── const/                # 表单校验规则、字典(dict.ts)等常量
│   ├── hooks/                # useTablePage / useCrudDialog / useDelete / usePerm / useEcharts ...
│   ├── layout/               # 布局:侧边栏、菜单、顶栏、标签页
│   ├── router/               # 路由表 + 动态路由注册(dynamic.ts)
│   ├── store/                # Pinia 仓库:user / menu / tabs / setting
│   ├── styles/               # 全局样式与 SCSS 变量
│   ├── utils/                # http / token / storage / time 等
│   ├── views/                # 页面
│   ├── permission.ts         # 路由守卫(鉴权 + 动态路由加载)
│   └── setting.ts            # 应用标题、logo 等配置
└── vite.config.ts            # Vite 配置(mock 开关、代理、别名、测试)
```

## 权限模型

**路由权限**:登录后调用 `/admin/user/info` 拿到用户信息与权限码,再调用菜单接口拿到菜单树,由 `src/router/dynamic.ts` 注册成真实路由;菜单里的组件路径通过 `import.meta.glob` 映射为懒加载组件(找不到时回落到 404 页)。

**按钮权限**:

```vue
<script setup lang="ts">
import usePerm from '@/hooks/usePerm';
const { hasPerm } = usePerm();
</script>

<template>
  <el-button v-if="hasPerm(['sys:user:add'])">新增</el-button>
</template>
```

> ⚠️ **安全边界**:前端权限只影响界面展示,不能当作安全措施。本模板刻意**不持久化**权限码、动态路由与 token 之外的敏感状态 —— 每次会话都重新向服务端获取,避免"改一改 localStorage 就能进后台"。真正的鉴权必须在后端完成。

## 接入真实后端

1. 修改 `.env.development`:

   ```bash
   VITE_APP_USE_MOCK='false'
   VITE_APP_BASE_API='/api'                 # 或直接写后端地址
   VITE_SERVER='http://your-backend:8100'   # dev server 代理目标
   ```

2. 按下面的约定对齐接口(见 `src/types/index.d.ts` 与各模块 `api/*/type.ts`):

   - 响应体:`{ code: number; message: string; data: T }`,`code === 200` 视为成功,`401` 视为登录失效
   - 请求头:`token` 字段携带登录令牌
   - 错误提示:非 200 时读取 `msg` / `message`

3. 直接删除 `mock/` 目录,并把 `vite.config.ts` 里的 `viteMockServe` 插件去掉。

## Mock 说明

- `vite-plugin-mock` 只在开发服务器生效;**生产构建不会包含 mock 代码**
- 每个文件默认导出 `MockMethod[]`;`url` 需包含 `/api` 前缀
- 以 `_` 开头的文件(如 `_data.ts`)不会被注册成路由,用于放共享种子数据
- 上传接口返回 data URL(不落盘),导出接口返回 CSV,仅用于演示

## 常见问题

**启动报 `Failed to resolve import "element-plus/dist/index.css"`**
依赖的安装脚本被 pnpm 忽略了。确认 `pnpm-workspace.yaml` 中的白名单存在,然后 `pnpm install` 重新安装。

**页面空白 / 反复跳登录**
检查后端 `/admin/user/info` 是否返回 `code: 200`。权限码为空是允许的(不会死循环),但接口失败会被守卫判定为登录失效。

**样式改动不生效**
全局 SCSS 变量在 `src/styles/variable.scss`,通过 `css.preprocessorOptions.scss.additionalData` 注入,页面里可以直接使用。

## 贡献

见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可证

[MIT](./LICENSE)

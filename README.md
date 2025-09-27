# 后台管理系统

一个基于 Vue 3 + TypeScript + Vite 构建的现代化后台管理系统，集成了权限管理、用户管理、菜单管理等功能。

## 项目简介

本项目是一个企业级后台管理系统，采用前后端分离架构，具备完整的用户认证、权限控制、数据管理等功能。系统基于Vue 3生态系统构建，使用TypeScript增强代码健壮性，通过Vite提升开发体验。

## 技术栈

- **核心框架**: Vue 3 (Composition API)
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **UI框架**: Element Plus
- **构建工具**: Vite
- **语言**: TypeScript
- **样式**: SCSS
- **代码规范**: ESLint + Prettier + Stylelint
- **HTTP客户端**: Axios
- **图表库**: ECharts
- **图标**: Element Plus Icons + SVG Icons

## 功能特性

### 1. 用户认证与权限控制

- 用户登录/登出
- 验证码校验
- Token持久化存储
- 动态路由权限控制
- 按钮级别权限控制
- 用户信息管理

### 2. 系统管理

- 用户管理（增删改查、密码重置）
- 角色管理（角色分配、权限配置）
- 菜单管理（动态菜单、权限字段配置）

### 3. 界面特性

- 响应式布局
- 动态侧边栏
- 标签页导航
- 面包屑导航
- 主题切换（暗黑模式支持）
- 自定义滚动条样式

### 4. 开发特性

- TypeScript类型安全
- Git提交规范（Commitlint + Husky）
- 代码格式化（Prettier）
- 代码质量检查（ESLint + Stylelint）
- 环境变量配置
- Mock数据支持

## 项目结构

```
src/
├── api/                 # 接口请求封装
├── assets/              # 静态资源
├── components/          # 全局组件
├── directive/           # 自定义指令
├── hocks/               # 自定义Hooks
├── layout/              # 布局组件
├── router/              # 路由配置
├── store/               # 状态管理
├── styles/              # 全局样式
├── utils/               # 工具函数
├── views/               # 页面组件
├── App.vue             # 根组件
├── main.ts             # 入口文件
├── permisstion.ts      # 路由权限控制
└── setting.ts          # 项目配置
```

## 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

## 安装与启动

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发环境启动

```bash
pnpm dev
```

### 3. 生产环境构建

```bash
pnpm build
```

### 4. 预览构建结果

```bash
pnpm preview
```

## 环境变量配置

项目支持多环境配置：

- `.env.development` - 开发环境
- `.env.production` - 生产环境

关键环境变量：

```bash
VITE_APP_TITLE=后台管理系统      # 应用标题
VITE_APP_BASE_API=/api          # API基础路径
```

## 权限控制说明

### 路由权限

系统通过动态路由实现页面访问权限控制，用户登录后根据角色获取对应的菜单权限。

### 按钮权限

通过自定义指令 `v-if` 结合权限码实现按钮级别的权限控制：

```vue
<el-button v-if="global.$hasPerm(['sys:user:add'])">新增</el-button>
```

## 代码规范

项目集成了完整的代码规范工具链：

- **ESLint**: JavaScript/TypeScript代码质量检查
- **Prettier**: 代码格式化
- **Stylelint**: CSS/SCSS样式检查
- **Commitlint**: Git提交信息规范

## 目录说明

### 核心业务模块

- `views/system/User/` - 用户管理模块
- `views/system/Role/` - 角色管理模块
- `views/system/Menu/` - 菜单管理模块

### 全局功能

- `components/` - 可复用组件
- `directive/` - 自定义指令（如权限控制）
- `utils/` - 工具函数（如HTTP客户端、时间处理等）
- `hocks/` - 自定义Hooks

## 部署说明

1. 构建生产版本：

```bash
pnpm build:pro
```

2. 将 `dist` 目录下的文件部署到服务器

3. 配置服务器反向代理，将API请求转发到后端服务

## 开发指南

### 新增页面

1. 在 `views/` 目录下创建页面组件
2. 在 `router/router.ts` 中添加路由配置
3. 在菜单管理中添加对应菜单项

### 新增API

1. 在 `api/` 对应模块中添加接口定义
2. 在 `api/*/type.ts` 中定义数据类型

### 新增状态管理

1. 在 `store/modules/` 中创建新的store模块
2. 在组件中通过 `useStore()` 引入使用

## 注意事项

1. 项目使用Element Plus作为UI框架，请遵循其组件使用规范
2. 所有API请求应通过 `utils/http.ts` 封装的axios实例发起
3. 权限控制通过 `permisstion.ts` 中的路由守卫实现
4. 图标使用Element Plus Icons和自定义SVG图标结合的方式

## 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目仅供学习交流使用。

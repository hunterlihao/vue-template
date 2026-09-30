# 贡献指南

感谢参与改进这个模板。以下约定用于保持代码风格与提交历史的一致。

## 开发流程

```bash
pnpm install
pnpm dev
```

提交前请确保下面四条全部通过(CI 也会跑同样的检查):

```bash
pnpm type-check   # vue-tsc 类型检查
pnpm lint         # ESLint
pnpm lint:style   # Stylelint
pnpm test         # Vitest
```

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/),由 `commitlint` 强制校验:

```
<type>(<scope>): <subject>

<body>
```

允许的 type:`feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `revert` `build`。

> 注意:`body-max-line-length` 生效,正文每行不要超过 100 个字符,否则提交会被 pre-commit 钩子拦下。

## 代码约定

- **TypeScript**:`strict` + `noUnusedLocals`。不要用非空断言(`!`),ESLint 会报错;用可选访问 + 提前 return 替代。
- **禁止 `any`**:`@typescript-eslint/no-explicit-any` 是 **error**。接口返回统一走 `Result<T>`,默认泛型是 `unknown` —— 要读 `data` 就必须在 api 层声明它是什么类型(`http.get<Result<UserInfoResult>>(...)`)。
- **列表页**:用 `useTablePage<行类型>({ api: getListApi })` 拿到带类型的 `tableList` 与 `loading`;分页参数统一用 `@/types` 的 `PageParm<TFilter>`,不要再各模块复制一份 `XxxListParm`。
- **本地存储**:不要直接 `localStorage.getItem/setItem`,走 `src/utils/storage.ts`(`safeParse` 会兜住损坏的数据,`clearAppStorage` 只清本应用的 key);持久化的 store 只存必要字段,结构变化时用 `afterHydrate` 做兼容。
- **权限判断**:统一使用 `usePerm()` + `v-if`。不要新增权限指令 —— 部分调用点在 `<el-table-column>` 这类无根元素组件上,指令拿不到 DOM 会静默失效。
- **样式**:颜色、尺寸等复用 `src/styles/variable.scss` 中的变量;组件内样式一律 `<style scoped lang="scss">`。
- **注释**:只在解释"为什么"时写;不要保留指向已删除文件的过时注释。块注释里不要出现 `*/` 形态的路径写法(会提前结束注释)。

## 新增一个页面

1. 新建 `src/views/xxx/XxxList.vue`(列表页建议复用 `useTablePage` + `useCrudDialog` + `useDelete` + `SearchBar` / `TablePager` / `TableEmpty`)
2. 在 `src/api/xxx/` 下补 `index.ts` 与 `type.ts`
3. 在 `mock/xxx.ts` 里补对应 mock 接口(或直接对接后端)
4. 在菜单管理里加一条菜单(菜单里的组件路径要与 `src/views/` 下的相对路径一致)
5. 补一条 Vitest 用例(纯逻辑优先)

## 新增枚举/状态展示

不要在各页面里手写 `<el-tag v-if="x === 0">` 这类映射,统一加到 `src/const/dict.ts`,模板里用:

```vue
<DictTag :value="row.sex" :dict="sexDict" />
```

## 新增图标

模板里可以直接写字符串图标(`icon="Search"`),但它依赖全局注册。本项目只注册白名单里的图标以控制体积:

1. 在 `src/components/icons.ts` 里 `import` 并加入 `icons`
2. 后端菜单返回了未登记的图标名时会自动回落到默认图标

## 新增一个接口模块

```ts
// src/api/foo/index.ts
import http from '@/utils/http.ts';
import type { FooListParm, Foo } from './type.ts';

const API = {
  GET_LIST_URI: '/admin/foo/list',
  ADD_URI: '/admin/foo',
} as const;

export const getListApi = (parm: FooListParm) =>
  http.post(API.GET_LIST_URI, parm);
export const addApi = (parm: Foo) => http.post(API.ADD_URI, parm);
```

## 提交 Pull Request 前的检查清单

- [ ] `pnpm type-check`、`pnpm lint`、`pnpm lint:style`、`pnpm test` 全部通过
- [ ] `pnpm build` 可以成功构建
- [ ] 新增的纯逻辑带单元测试
- [ ] 没有提交 `dist/`、`.env.local` 等本地文件
- [ ] 提交信息符合 Conventional Commits

## 许可证

贡献的代码将以 [MIT](./LICENSE) 许可证发布。

import globals from 'globals';
import tsParser from 'typescript-eslint';
import vuePlugin from 'eslint-plugin-vue';
import typeScriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/eslint.config.js',
      '**/vite.config.ts',
    ],

    // 语言支持配置
    languageOptions: {
      // 全局变量
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
      // 指定语言解析器
      parser: vueParser,
      // 解析器选项
      parserOptions: {
        parser: tsParser.parser,
        ecmaVersion: 'latest', // 指定 ECMAScript 版本
        sourceType: 'module', // 指定模块类型
        jsxPragma: 'React', // 指定  JSX 的运行时的 pragma
        ecmaFeatures: {
          // 启用额外的语言特性
          jsx: true, // 启用 JSX
        },
      },
    },
    // 插件支持配置
    plugins: {
      '@typescript-eslint': typeScriptPlugin,
      vue: vuePlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // eslint（https://eslint.bootcss.com/docs/rules/）
      'no-var': 'error', // 要求使用 let 或 const 而不是 var
      'no-multiple-empty-lines': ['error', { max: 1 }], // 不允许多个空行
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', //  禁止使用 console
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 禁用 debugger
      'no-unexpected-multiline': 'error', // 禁止空余的多行
      'no-useless-escape': 'off', // 禁止不必要的转义字符

      // typeScript (https://typescript-eslint.io/rules)
      '@typescript-eslint/no-unused-vars': 'error', // 禁止定义未使用的变量
      '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
      '@typescript-eslint/no-explicit-any': 'error', // 禁止使用 any 类型
      '@typescript-eslint/no-non-null-assertion': 'error', // 禁止使用非空断言操作符（!）
      '@typescript-eslint/no-namespace': 'off', // 禁止使用自定义 TypeScript 模块和命名空间。
      'vue/multi-word-component-names': 'off', // 要求组件名称始终为 “-” 链接的单词
      'vue/no-mutating-props': 'off', // 不允许组件 prop的改变
      'vue/attribute-hyphenation': 'off', // 对模板中的自定义组件强制执行属性命名样式

      'prettier/prettier': 'error', //
    },
    settings: {
      'vue/setup-compiler-macros': true, // 允许在 setup 中使用 ref
    },
  },
]);

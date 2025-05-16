// commitlint.config.js
// 引入 Commitlint 的 defineConfig 方法，用于更清晰地定义配置项

// 使用 ESM 模块的方式导出配置
export default {
  // 继承官方的推荐配置 "@commitlint/config-conventional"
  // 包含了一些基本的提交规范，比如 type 的分类、格式校验等
  extends: ['@commitlint/config-conventional'],

  // 自定义校验规则
  rules: {
    // 校验提交的 type 类型
    'type-enum': [
      2, // 表示该规则的错误级别，2 是 error，提交失败
      'always', // 表示该规则总是生效
      [
        // 可选的 type 类型列表：
        'feat', // 新功能（feature）
        'fix', // 修复 bug
        'docs', // 文档相关的修改
        'style', // 代码格式（不影响功能，例如空格、分号等）
        'refactor', // 代码重构（既不修复错误也不添加新功能）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚到上一个版本
        'build', // 构建系统或外部依赖的变动
      ],
    ],

    // 不强制 type 的大小写格式
    'type-case': [0],

    // 不校验 type 是否为空
    'type-empty': [0],

    // 不校验 scope 是否为空
    'scope-empty': [0],

    // 不强制 scope 的大小写格式
    'scope-case': [0],

    // 不校验 subject（描述）的句末是否加句号
    'subject-full-stop': [0, 'never'],

    // 不强制 subject 的大小写格式
    'subject-case': [0, 'never'],

    // 不强制提交信息的标题长度限制
    'header-max-length': [0, 'always', 72],
  },
};

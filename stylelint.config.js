// Stylelint 配置(ESM)。
//
// 注意两点,否则 stylelint 根本起不来:
//  1. 本项目是 "type": "module",而 stylelint-config-html /
//     stylelint-config-recommended-vue 都没有 exports 字段,
//     ESM 下必须写全文件名(vue.js / scss/index.js)。
//  2. postcss-scss / postcss-html 是 customSyntax(解析器),不是 plugin,
//     不能放进 plugins 数组。
import stylelintStandard from 'stylelint-config-standard';
import stylelintHtmlVue from 'stylelint-config-html/vue.js';
import stylelintScss from 'stylelint-config-standard-scss';
import stylelintVueScss from 'stylelint-config-recommended-vue/scss/index.js';
import stylelintRecessOrder from 'stylelint-config-recess-order';

export default {
  extends: [
    stylelintStandard,
    stylelintHtmlVue,
    stylelintScss,
    stylelintVueScss,
    stylelintRecessOrder,
  ],
  overrides: [
    {
      // .vue / .html 的 customSyntax 由 stylelint-config-html/vue 提供
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
  ignoreFiles: ['**/*.js', '**/*.ts', '**/*.json', '**/*.md', '**/*.yaml'],
  rules: {
    'value-keyword-case': null,
    'no-descending-specificity': null,
    'function-url-quotes': 'always',
    'no-empty-source': null,
    'selector-class-pattern': null,
    'property-no-unknown': null,
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep'],
      },
    ],
  },
};

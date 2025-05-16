import stylelintStandard from 'stylelint-config-standard';
import stylelintHtmlVue from 'stylelint-config-html/vue';
import stylelintScss from 'stylelint-config-standard-scss';
import stylelintVueScss from 'stylelint-config-recommended-vue/scss';
import stylelintRecessOrder from 'stylelint-config-recess-order';
import stylelintPrettier from 'stylelint-config-prettier';
import postcssScss from 'postcss-scss';
import postcssHtml from 'postcss-html';

export default {
  extends: [
    stylelintStandard,
    stylelintHtmlVue,
    stylelintScss,
    stylelintVueScss,
    stylelintRecessOrder,
    stylelintPrettier,
  ],
  plugins: [postcssScss, postcssHtml],
  overrides: [
    {
      files: ['**/*.(scss|css|vue|html)'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['**/*.(html|vue)'],
      customSyntax: 'postcss-html',
    },
  ],
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
  ],
  rules: {
    'value-keyword-case': null,
    'no-descending-specificity': null,
    'function-url-quotes': 'always',
    'no-empty-source': null,
    'selector-class-pattern': null,
    'property-no-unknown': null,
    'block-opening-brace-space-before': 'always',
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

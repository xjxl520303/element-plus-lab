import antfu from '@antfu/eslint-config'
import VueVine from '@vue-vine/eslint-config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default antfu(
  {
    // 重写 antfu 规则自身的配置
    rules: {
      // 避免在 pnpm-workspace.yaml 中强制添加 trustPolicy: downgrade 导致 pnpm install 时失败
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
  ...VueVine(),
  {
    // 在 flat config 模式下，docs/examples/**/*.vue 没有命中任何带
    // vue-eslint-parser + typescript-eslint 的配置项，只能用默认 JS 解析器，导致 TS 语法在这里被当成错误。
    files: [
      'docs/examples/**/*.vue',
      'packages/playground/**/*.vue',
    ],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        vine: 'readonly',
        vineStyle: 'readonly',
      },
    },
  },
)

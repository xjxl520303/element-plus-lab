import antfu from '@antfu/eslint-config'
import VueVine from '@vue-vine/eslint-config'
import globals from 'globals'

export default antfu({
  // 重写 antfu 规则自身的配置
  rules: {
    // 避免在 pnpm-workspace.yaml 中强制添加 trustPolicy: downgrade 导致 pnpm install 时失败
    'pnpm/yaml-enforce-settings': 'off',
  },
}, ...VueVine(), {
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
      vine: 'readonly',
      vineStyle: 'readonly',
    },
  },
})

import antfu from '@antfu/eslint-config'
import VueVine from '@vue-vine/eslint-config'
import globals from 'globals'

export default antfu({
  // 重写 antfu 规则自身的配置
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

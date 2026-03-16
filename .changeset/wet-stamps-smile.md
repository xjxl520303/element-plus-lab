---
"element-plus-lab": minor
---

- 支持 `app.use(ElementPlusLab)` 一次性注册所有 Vue 组件，以及 `app.use(ElFormGroup)` 等单组件注册
- 新增 `withInstall` 与 `ElementPlusLab` 插件导出，README 改为英文并补充安装与用法说明
- 为组件包新增 `@element-plus-lab/utils` 依赖，并在 tsdown 中通过 `deps.alwaysBundle` / `deps.neverBundle` 明确打包策略，确保发布包不依赖 workspace 私有包
- 将入口内部实现改为从 `@element-plus-lab/components` 导入 hooks 与组件，统一内部依赖路径与 monorepo 包结构


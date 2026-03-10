# element-plus-lab

## 0.1.1

### Patch Changes

- [#4](https://github.com/xjxl520303/element-plus-lab/pull/4) [`675626e`](https://github.com/xjxl520303/element-plus-lab/commit/675626e20e6742d64a34702087d332d6f3008ab4) Thanks [@xjxl520303](https://github.com/xjxl520303)!
  - 修复 `element-plus-lab` 在 eslint / publint 下的配置问题，清理多余字段
  - 将 `tsconfig`、`tsdown`、`vitest` 等构建与类型配置上移到仓库根目录，统一管理
  - 优化 `useDialog` 钩子实现，并补充单元测试与 playground 示例
  - 更新文档与示例代码，补充 useDialog / EllDialogResult 使用说明及项目结构说明

## 0.1.0

### Minor Changes

- [#2](https://github.com/xjxl520303/element-plus-lab/pull/2) [`bb68e45`](https://github.com/xjxl520303/element-plus-lab/commit/bb68e455b56755c67b21e292067f16fd721775de) Thanks [@xjxl520303](https://github.com/xjxl520303)!

  - 新增 `useDialog` 对话框封装组件，替代在 vben-business-components 中原有的 `useBusDialog`。同时完善对话框类型定义与导出形态（包括 Twoslash 支持和对外 API 调整）。

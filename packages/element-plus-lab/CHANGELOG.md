# element-plus-lab

## 0.2.0

### Minor Changes

- ## element-plus-lab

  - **新增 `useDrawer` 抽屉封装**：基于 `createTemplatePromise` 与 portal-vue，提供 Promise 化 API。
  - **展示变体 `variant`**：`default`（标题+内容+底部按钮）、`blank`（仅内容、遮罩可关）、`simple`（标题+关闭、仅关闭按钮可关）。
  - **头部与操作配置**：`headerConfig`（title、closeable、closePlacement）、`actionConfig`（actions、okText/cancelText、placement、okHandler/cancelHandler）。
  - **beforeClose / keepInstance**：关闭前拦截与保留实例不销毁，行为与 useDialog 对齐。
  - **共享类型**：`EllOverlayResult`、`EllOverlayCloseReason` 从 `@element-plus-lab/utils` 导出；抽屉关闭原因与结果类型与对话框统一。
  - **样式**：`headerConfig.closePlacement === 'left'` 时通过类名 `ell-drawer-close-left` 与可选样式文件 `element-plus-lab/drawer-close-placement.css` 控制关闭按钮在左侧。

  ## docs

  - **useDrawer 文档**：基础用法、variant、设置内容、beforeClose、keepInstance、关闭/操作按钮位置、API 与类型说明。
  - **示例**：基础、variant、set-content、before-close、keep-instance、header-actions-layout。
  - **文档修正**：设置头部示例解构修正（三个 useDrawer 调用）；类型说明与 types 一致。

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

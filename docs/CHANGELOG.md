# @element-plus-lab/docs

## 0.4.0

### Minor Changes

- [#10](https://github.com/xjxl520303/element-plus-lab/pull/10) [`9e1c7e4`](https://github.com/xjxl520303/element-plus-lab/commit/9e1c7e43f05f138493eeb20f534a3db20b7050e9) Thanks [@xjxl520303](https://github.com/xjxl520303)!
  - 快速开始与包概览同步 `app.use(ElementPlusLab)` / `app.use(ElXxx)` 两种注册方式
  - 文档中补充 Vue 组件注册说明与 portal-target 配置示例
  - 新增 `useDialog` / `useDrawer` 专题文档与基础用法示例，统一 `ell-*` portal 目标命名，并在站点布局中挂载 `ell-dialog`、`ell-drawer`
  - 调整 VitePress 与 Tailwind 配置，引入 Shiki 高亮 `@vitepress-demo-preview` 源码块，确保组件示例在文档中的样式与交互正常呈现

### Patch Changes

- Updated dependencies [[`9e1c7e4`](https://github.com/xjxl520303/element-plus-lab/commit/9e1c7e43f05f138493eeb20f534a3db20b7050e9)]:
  - element-plus-lab@0.3.0

## 0.3.0

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

### Patch Changes

- Updated dependencies []:
  - element-plus-lab@0.2.0

## 0.2.1

### Patch Changes

- [#7](https://github.com/xjxl520303/element-plus-lab/pull/7) [`bae95da`](https://github.com/xjxl520303/element-plus-lab/commit/bae95dabacf971d0b868fbb3bf02fb20bcc87804) Thanks [@xjxl520303](https://github.com/xjxl520303)!
  - 补充 `useDialog` 对话框封装文档，完善基础用法与 API 说明
  - 新增《在单元测试中 mock portal-vue》指南，沉淀有状态 Wormhole/PortalTarget mock 实践

## 0.2.0

### Minor Changes

- [#4](https://github.com/xjxl520303/element-plus-lab/pull/4) [`675626e`](https://github.com/xjxl520303/element-plus-lab/commit/675626e20e6742d64a34702087d332d6f3008ab4) Thanks [@xjxl520303](https://github.com/xjxl520303)!
  - 在指南中补充 `useDialog` 与 `EllDialogResult` 的使用示例和快速上手代码片段
  - 新增「本地包（monorepo）」「包目录（package catalog）」和「exports 配置」等项目结构说明文档
  - 调整对话框相关示例代码，与最新组件实现保持一致
  - 精简文档站构建流程，移除 Twoslash 集成并优化 VitePress 主题和类型配置

### Patch Changes

- Updated dependencies [[`675626e`](https://github.com/xjxl520303/element-plus-lab/commit/675626e20e6742d64a34702087d332d6f3008ab4)]:
  - element-plus-lab@0.1.1

## 0.1.0

### Minor Changes

- [#2](https://github.com/xjxl520303/element-plus-lab/pull/2) [`bb68e45`](https://github.com/xjxl520303/element-plus-lab/commit/bb68e455b56755c67b21e292067f16fd721775de) Thanks [@xjxl520303](https://github.com/xjxl520303)! - 为 `useDialog` 增加完整的入门与用法文档，并补充项目层面的分支规范、发版流程以及文档与组件库在本地开发和 Vercel 部署时的联动配置说明。

### Patch Changes

- Updated dependencies [[`bb68e45`](https://github.com/xjxl520303/element-plus-lab/commit/bb68e455b56755c67b21e292067f16fd721775de)]:
  - element-plus-lab@0.1.0

# 介绍

这里介绍了 Element Plus Lab 中已实现及后续将实现的组件清单。

::: tip

- 这里列出的不一定是最终所有的实现，仅供参考，请以实际实现为准。
- 最终的实现顺序并不一定和列出的顺序一致，已实现会标注对应的版本号。

:::

## 基础组件

在 Element Plus 提供的组件基础上进行二次封装并作为后续业务组件的基础组件。

- [x] `useDialog` 对话框封装 <sup>0.1.0</sup>
- [x] `useDrawer` 抽屉封装 <sup>0.1.0+</sup>
- [ ] `useFormDialog` 表单对话框封装
- [ ] `useRequestMask` 请求遮罩封装
- [ ] `<el-simple-steps>` 轻量级步骤条
- [ ] `<el-simple-page-header>` 轻量级页面头部
- [ ] `<el-form-group>` 表单分组
- [ ] `<el-department-picker>` 部门和人员选择器
- [ ] `<el-pro-table>` 表格增强组件
- [ ] `<el-form-layout>` 表单布局组件
- [ ] `<el-form-query>` 表单查询组件
- [ ] `<el-page-layout>` 页面布局组件
- [ ] `<el-admin-layout>` 管理后台布局组件
- [ ] `<el-form-renderer>` 表单渲染器组件
- [ ] `<el-table-transfer>` 表格穿梭框组件
- [ ] `<el-tree-transfer>` 树形穿梭框组件
- [ ] `<el-upload-dialog>` 上传对话框组件
- [ ] `<el-attachment-upload>` 附件上传组件
- [ ] `<el-download>` 下载组件

## 业务组件

业务组件是针对特定业务场景进行封装和抽象的组件，旨在提升业务开发效率和复用性。这类组件通常结合实际项目需求，具备一定的业务逻辑，能够快速支持常见的业务操作和流程。你可以根据实际需要，直接引入使用这些业务组件，或在其基础上进行二次开发，以满足更复杂的业务场景。

- [ ] `<el-cru-index>` 包含表单查询、工具栏和表格的超级组件
- [ ] `<el-cru-page>` 包含表单创建、编辑和详情（查看）的超级组件
- [ ] `<el-flow>` 流程组件
- [ ] `<el-flow-viewer>` 流程查看组件
- [ ] `<el-draft-list>` 草稿列表组件
- [ ] `<el-product-picker>` 产品选择器组件

## 第三方库封装

对第三方库进行封装并作为业务组件库的补充。

- [ ] `<el-tanstack-table>` TanStask Table 二次封装

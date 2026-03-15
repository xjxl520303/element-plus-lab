---
title: SimplePageHeader 页面头部
---

# ElSimplePageHeader 页面头部

`ElSimplePageHeader` 组件用于提供一个带有【返回】按钮和页面标题或者选项卡（默认为**申请信息**和**流程图**两个选项卡）的详情页面头部（Header）的功能。

::: info 说明

- 组件的诞生背景是企业管理系统中各种需要走流程的功能的**创建**、**编辑**和**详情**页面。
- 这里所谓的**流程**是指在管理系统中一些功能的创建和编辑需要别人进行**审批**、**复核**、**处理**等操作，然后流转到下一个节点。
- 组件会用在后续的页面级组件（待开发）中。

:::

组件提供了两种显示方式（以采购系统中供应商入库申请为例）：

- **返回按钮 + 页面标题**：适用于无流程的预先通过后端导入的**编辑**与**查看**页面。
- **返回按钮 + 选项卡**：适用于有流程的供应商**申请**、**草稿编辑**和**详情**页面。

## 基础用法

<preview path="@/components/basic/simple-page-header/basic/index.vue" />

## 高级用法

默认情况下通过组件提供的插槽 `extra` 来添加表单的【保存】或【提交】以及其它按钮。针对默认提供的选项卡功能，可以使用 portal-vue 为每一个选项卡插入不同的内容：在默认插槽获取 `uid`，并通过 Portal 目标位置 `${uid}-${tab}-extra` 动态插入内容。

::: info 说明

- `extra` 插槽内容和 portal-vue 指定的内容是共存的，可通过 portal-vue 的 `order` 属性指定顺序（默认 `extra` 插入的内容 `order` 为 `5`）。
- `${uid}-${tab}-extra` 中的 `tab` 为选项卡的 `value` 值。

:::

<preview path="@/components/basic/simple-page-header/portal/index.vue" />

## 自定义选项卡

组件提供了 `tabConfig` 属性来覆盖默认的选项卡配置；若仅需修改第一个选项卡的名称，可设置 `firstTabLabel`。

<preview path="@/components/basic/simple-page-header/custom/index.vue" />

## 选项卡切换事件

组件提供 `beforeChange` 和 `afterChange`，可在切换时注入加载指示器：前者异步返回 `true` 继续执行，后者用于关闭加载。

<preview path="@/components/basic/simple-page-header/loading/index.vue" />

## 页面回退（返回）说明

组件提供 `back` 事件处理返回逻辑，可根据需求集成 Vue Router：通过查询参数或浏览器历史返回上一页，或在微前端下回到指定应用。

## API

```vue
<template>
  <ElSimplePageHeader
    :back-text="backText"
    :title="title"
    :first-tab-label="firstTabLabel"
    :default-tab="defaultTab"
    :tab-config="tabConfig"
    :before-change="beforeChange"
    :after-change="afterChange"
    @tab-change="handleTabChange"
    @tab-change-error="handleTabChangeError"
    @back="handleBack"
  >
    <template #back>
      <!-- 自定义返回区域（图标+文案等） -->
    </template>
    <template #extra>
      <!-- 额外内容 -->
    </template>
    <template #default="{ uid }">
      <Portal :to="`${uid}-${tab}-extra`">
        <!-- 内容 -->
      </Portal>
    </template>
  </ElSimplePageHeader>
</template>
```

### Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| backText | 返回按钮文案（未使用 `#back` 插槽时生效） | `string` | `'返回'` |
| title | 页面标题 | `string` | - |
| firstTabLabel | 第一个选项卡的标签文本 | `string` | `'申请信息'` |
| defaultTab | 默认选中的选项卡的值 | `string` | `'0'` |
| tabConfig | 选项卡列表 | `EllSimplePageHeaderTab[]` | `[{ label: '申请信息', value: '0' }, { label: '流程图', value: '1' }]` |
| beforeChange | 选项卡改变前的拦截函数 | `(value: string) => Promise<boolean>` | - |
| afterChange | 选项卡改变后的拦截函数 | `(value: string) => Promise<void> \| void` | - |

### Events

| 事件名 | 描述 | 参数 |
| --- | --- | --- |
| tabChange | 选项卡改变时触发 | `(value: string) => void` |
| tabChangeError | 选项卡切换时 `beforeChange` 抛出错误时触发 | `(error: unknown) => void` |
| back | 返回按钮点击时触发 | `() => void` |

### Slots

| 插槽名 | 描述 | 参数 |
| --- | --- | --- |
| back | 自定义返回区域（替换默认的图标+文案） | - |
| extra | 右侧额外内容区域 | - |
| default | 用于 portal-vue 动态插入内容 | `{ uid: string }` |

### Portal 目标

| 目标位置 | 描述 |
| --- | --- |
| `${uid}-${tab}-extra` | 指定某一选项卡的额外内容，`tab` 为选项卡的 `value`。 |

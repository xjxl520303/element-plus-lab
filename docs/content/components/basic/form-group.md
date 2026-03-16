---
title: FormGroup 表单分组
---

# ElFormGroup 表单分组

`ElFormGroup` 用于在表单中对字段进行分组显示，将相关表单项组织在一起，支持折叠/展开，便于阅读和填写。

::: info 说明

- 默认支持点击左侧图标折叠/展开分组内容。
- 可通过 `description` 或 `desc` 插槽显示描述信息。
- 可通过 `extra` 插槽在头部右侧添加额外内容（如操作按钮）。
- 主题样式可根据项目自行覆盖。

:::

## 基础用法

<preview path="@/components/basic/form-group/basic/index.vue" />

## 默认折叠

设置 `defaultFolded` 为 `true` 可使分组默认折叠。

<preview path="@/components/basic/form-group/default-folded/index.vue" />

## 受控折叠

使用 `v-model:folded` 可从外部控制折叠状态（如「全部展开」按钮）。

<preview path="@/components/basic/form-group/controlled-fold/index.vue" />

## 折叠动画

设置 `animated` 为 `true` 可开启展开/收起的过渡动画。

<preview path="@/components/basic/form-group/animated/index.vue" />

## 展开/折叠钩子

分组提供展开与折叠的前后钩子：**展开后**可做异步加载并配合加载动画，**折叠/展开前**可做校验与拦截。

| 钩子 | 说明 |
| --- | --- |
| `beforeExpand` | 展开前调用，返回 `false` 或 `Promise<false>` 可阻止展开 |
| `afterExpand` | 展开完成后调用，可用于发起请求、加载内容并显示加载动画 |
| `beforeCollapse` | 折叠前调用，返回 `false` 可阻止折叠（如未保存提示） |
| `afterCollapse` | 折叠完成后调用 |

<preview path="@/components/basic/form-group/async-expand/index.vue" />

## API

```vue
<template>
  <ElFormGroup
    v-model:folded="folded"
    :title="title"
    :description="description"
    :default-folded="defaultFolded"
    :animated="animated"
    :before-expand="beforeExpand"
    :after-expand="afterExpand"
    :before-collapse="beforeCollapse"
    :after-collapse="afterCollapse"
  >
    <template #desc>
      <!-- 自定义描述 -->
    </template>
    <template #extra>
      <!-- 头部右侧额外内容 -->
    </template>
    <!-- 分组内容 -->
  </ElFormGroup>
</template>
```

### Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题 | `string` | - |
| description | 分组描述 | `string` | - |
| defaultFolded | 是否默认折叠（仅在不使用 `v-model:folded` 时生效） | `boolean` | `false` |
| animated | 是否开启折叠/展开动画 | `boolean` | `false` |
| beforeExpand | 展开前钩子，返回 `false` 阻止展开 | `() => boolean \| Promise<boolean \| void>` | - |
| afterExpand | 展开后钩子，可用于异步加载内容与加载动画 | `() => void \| Promise<void>` | - |
| beforeCollapse | 折叠前钩子，返回 `false` 阻止折叠 | `() => boolean \| Promise<boolean \| void>` | - |
| afterCollapse | 折叠后钩子 | `() => void \| Promise<void>` | - |

### v-model

| 名称 | 描述 |
| --- | --- |
| folded | 是否折叠，支持受控 |

### Slots

| 插槽名 | 描述 |
| --- | --- |
| default | 分组内容 |
| desc | 自定义描述（覆盖 `description`） |
| extra | 头部右侧额外内容 |

---
title: 快速开始
order: 1
---

# 快速开始

当前组件库提供两类能力：**Vue 组件**（如 `ElFormGroup`、`ElSimplePageHeader`、`ElSimpleSteps`）与 **钩子函数**（如 `useDialog`、`useDrawer`）。Vue 组件需通过 `app.use()` 全局注册或按需注册；钩子无需注册，在需要处引入即可，但使用 `useDialog` / `useDrawer` 时需在根组件中放置对应的 `portal-vue` 传送目标。

## 安装

选择项目中使用的包管理工具进行安装，这里以 `pnpm` 为例：

```bash
pnpm add element-plus-lab
```

::: info

项目中大部分组件的实现依赖于 `portal-vue` 的特性，因此请确保项目中引入了 `portal-vue`，同时依赖了 `@vueuse/core` 和 `ulid`（已作为内部依赖引入，无需手动安装，建议在项目中代替 UUID） 库。

:::

项目支持以 ESM、 CommonJS 以及 UMD 的方式引入。**目前只在本地测试了 ESM 的方式，CommonJS 未做验证，UMD 未做测试**。

## 使用

### 注册 Vue 组件

所有以 `.vue` 形式提供的组件（如 `ElFormGroup`、`ElSimplePageHeader`、`ElSimpleSteps`）支持两种注册方式：

**方式一：一次性全局安装**

```ts
import { createApp } from 'vue'
import ElementPlusLab from 'element-plus-lab'

const app = createApp(App)
app.use(ElementPlusLab)  // 注册 ElFormGroup、ElSimplePageHeader、ElSimpleSteps
```

**方式二：按需单独安装**

```ts
import { createApp } from 'vue'
import { ElFormGroup } from 'element-plus-lab'

const app = createApp(App)
app.use(ElFormGroup)  // 仅注册 ElFormGroup
```

钩子函数（如 `useDialog`、`useDrawer`）无需注册，在需要处直接引入使用即可。

### 使用 useDialog

截止目前项目发布了 `useDialog`、`useDrawer` 等钩子函数，以及 `ElFormGroup`、`ElSimplePageHeader`、`ElSimpleSteps` 等组件。这里以 `useDialog` 为例介绍钩子用法。

1. 在项目的共享入口组件（通常是 `App.vue`）中添加 `portal-vue` 的传送目标。使用 `useDialog` 需要 `ell-dialog`，使用 `useDrawer` 需要 `ell-drawer`。

```vue
<template>
  <portal-target name="ell-dialog" multiple />
  <portal-target name="ell-drawer" multiple />
</template>
```

2. 在需要使用对话框的地方引入 `useDialog` 钩子函数，并调用 `openDialog()` 方法打开对话框。

```ts
import { useDialog, type EllOverlayResult } from 'element-plus-lab'

const { openDialog } = useDialog()

const someTrigger = async () => {
  try {
    const result = await openDialog()
    console.log('对话框结果：', result)
  } catch (error: unknown) {
    // 在 catch 中先用 unknown 接住，再断言为 EllOverlayResult
    const result = error as EllOverlayResult
    console.log('对话框关闭原因：', result.reason)
  }
}
```

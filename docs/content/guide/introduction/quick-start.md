---
title: 快速开始
order: 1
---

# 快速开始

当前组件库提供了常见的业务组件封装，并以常规组件、指令和钩子函数的方式提供，部分组件因为结合了 `portal-vue` 的特性，只需要引入对应的钩子函数，不需要进行注册使用，但还是需要在项目中手动指定 `portal-vue` 的传送目标名称。

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

截止目前项目只发布了一个 `useDialog` 的钩子函数，用于封装 `<el-dialog>` 组件，所以这里以 `useDialog` 为例进行介绍。

1. 在项目的共享入口组件（通常是 `App.vue` 中）添加 `portal-vue` 的传送目标名称 `ell-dialog`。

```vue
<template>
  <portal-target name="ell-dialog" />
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

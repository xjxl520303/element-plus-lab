---
title: SimpleSteps 步骤条
---

# ElSimpleSteps 步骤条

`ElSimpleSteps` 是一个轻量级步骤条组件，用于展示多步骤流程的当前步骤位置。步骤的展示状态（未开始/进行中/已完成）由 `v-model` 当前值推导，不修改 `options` 数据。对于更复杂的步骤条需求，建议使用 Element Plus 的 `<el-steps>` 组件。

## 基础用法

默认步骤条不占满宽度，仅通过 `space` 设置步骤项最小间距，可自行设置宽度占满可用空间。

<preview path="@/components/basic/simple-steps/basic/index.vue" />

## 步骤跳转

组件未提供【上一步】/【下一步】方法，需通过 `v-model` 或 ref 调用 `setStep` 实现跳转。

<preview path="@/components/basic/simple-steps/more/index.vue" />

## API

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 当前步骤（第几步） | `number` | `1` |
| space | 步骤项最小间距 | `number` | `16` |
| options | 步骤配置 | `EllSimpleStepsOption[]` | `[]` |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| setStep | 设置当前步骤 | `(step: number) => void` |

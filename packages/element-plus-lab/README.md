# Element Plus Lab

A business component library based on Element Plus. Provides Promise-style dialog/drawer hooks and Vue components such as form group, steps, and page header.

## Installation

```bash
pnpm add element-plus-lab
```

Install and register these peer dependencies in your project:

```bash
pnpm add vue element-plus portal-vue @vueuse/core
```

Some components use `@element-plus/icons-vue`; install it when you need those components.

## Usage

### Registering Vue components

All `.vue` components (`ElFormGroup`, `ElSimplePageHeader`, `ElSimpleSteps`) can be registered in two ways:

**Option 1: Register all at once**

```ts
import { createApp } from 'vue'
import ElementPlusLab from 'element-plus-lab'

const app = createApp(App)
app.use(ElementPlusLab)
```

**Option 2: Register individually**

```ts
import { createApp } from 'vue'
import { ElFormGroup } from 'element-plus-lab'

const app = createApp(App)
app.use(ElFormGroup)
```

Hooks (`useDialog`, `useDrawer`) do not need registration; import and use them where needed.

### Using useDialog / useDrawer

Before using `useDialog` or `useDrawer`, add the corresponding portal targets in your root component (e.g. `App.vue`):

```vue
<template>
  <portal-target name="ell-dialog" multiple />
  <portal-target name="ell-drawer" multiple />
</template>
```

Then import and call the hook in your code:

```ts
import { useDialog, type EllOverlayResult } from 'element-plus-lab'

const { openDialog } = useDialog()

async function open() {
  try {
    await openDialog({ title: 'Confirm', content: 'Are you sure?' })
    // User clicked OK
  } catch (error: unknown) {
    const result = error as EllOverlayResult
    console.log('Close reason:', result.reason) // 'cancel' | 'close' | 'ok'
  }
}
```

For more options (custom header/content/footer, `beforeClose`, keep instance, etc.), see the [project documentation](https://github.com/xjxl520303/element-plus-lab).

## Exports overview

| Type       | Name                  | Description                                      |
| ---------- | --------------------- | ------------------------------------------------ |
| Hook       | `useDialog`           | Promise-style wrapper around `<el-dialog>`       |
| Hook       | `useDrawer`           | Promise-style wrapper around `<el-drawer>`       |
| Vue component | `ElFormGroup`      | Form group with collapsible section and hooks    |
| Vue component | `ElSimplePageHeader` | Page header with tabs and back button        |
| Vue component | `ElSimpleSteps`    | Steps component driven by `v-model`              |
| Plugin     | `ElementPlusLab`      | Registers all Vue components above at once       |

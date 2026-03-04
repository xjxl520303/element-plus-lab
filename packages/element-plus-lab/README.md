# Element Plus Lab

A business component library based on Element Plus.

## Quick Start

Install the package:

```bash
pnpm add element-plus-lab
```

Before using the package, you need to install the following dependencies:

```bash
pnpm add portal-vue @vueuse/core
```

Some other dependencies may be required depending on the components you use, but they only need when you use the corresponding components.

## Usage

At the moment this package only provides one component, **`useDialog`**. More components will be added later. Below is a brief example of how to use `useDialog` (a Promise-based wrapper around `<el-dialog>`).

**1. Add a portal target in your root component (e.g. `App.vue`):**

```vue
<template>
  <portal-target name="ell-dialog" />
</template>
```

**2. Use it where you need to open a dialog:**

```ts
import { useDialog, type EllDialogResult } from 'element-plus-lab'

const { openDialog } = useDialog()

// async/await
async function open() {
  try {
    await openDialog({ title: 'Confirm', content: 'Are you sure you want to delete?' })
    // User clicked OK
  } catch (error: unknown) {
    // User cancelled or closed; error.reason is 'cancel' | 'close'
    const result = error as EllDialogResult
    console.log('Dialog closed reason:', result.reason)
  }
}
```

For more options (custom header/content/footer, `beforeClose`, keep instance, etc.), see the project documentation.

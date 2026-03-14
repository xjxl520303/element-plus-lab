---
title: useDialog 对话框封装
---

# useDialog 对话框封装

`useDialog` 钩子函数主要基于 Vue Use 提供的 `createTemplatePromise()` 函数以及 portal-vue 来封装 `<el-dialog>` 功能。

1. **基于 Element Plus 的 `<el-dialog>`**：直接使用 `<el-dialog>` 组件，通过 `dialogConfig` 可以访问原组件的全部功能和属性，与 Element Plus 生态完美融合。
2. **Promise 化的 API**：使用 `async/await` 或 Promise 方式处理对话框的确认/取消操作，代码更简洁直观，无需额外的状态管理。
3. **支持嵌套对话框**：可以在对话框内部打开新的对话框，支持复杂的交互场景。
4. **灵活的内容设置方式**：支持三种方式设置内容（文本、渲染函数、portal-vue），优先级清晰，可以灵活组合使用。
5. **Portal-vue 集成**：借助 portal-vue 的强大功能，可以将来自不同组件的内容同时渲染到同一对话框中，实现跨组件的组合。
6. **自动清理机制**：对话框关闭时自动清理 portal 状态，无需手动管理，避免状态残留问题。

::: info 注意

要使用 `useDialog`，请确保在全局中（通常在设置 `RouterView` 的位置）设置好 portal-vue 的目标位置 `<PortalTarget name="ell-dialog" multiple />`。

:::

## 基础用法

最简单的使用方式就是设置 `content` 属性，同时我们可以在调用 `openDialog` 时通过 `async/await` 结合 `try...catch` 或者 Promise 方式来实现 `ElMessageBox` 的**确认/取消**功能。

::: code-group

```ts [使用 async/await 结合 try...catch]
import { ElMessage } from 'element-plus';
import { useDialog } from 'element-plus-lab';

const { openDialog } = useDialog();

async function open() {
  try {
    await openDialog({ content: '确定要执行此操作吗？' });
    ElMessage.success('已确认');
  } catch (error) {
    console.error(error);
    ElMessage.info('已取消');
  }
}
```

```ts [使用 Promise]
import { ElMessage } from 'element-plus';
import { useDialog } from 'element-plus-lab';

const { openDialog } = useDialog();

function open() {
  openDialog({ content: '确定要执行此操作吗？' })
    .then(() => {
      ElMessage.success('已确认');
    })
    .catch((error) => {
      console.error(error);
      ElMessage.info('已取消');
    });
}
```

:::

::: info 注意

对话框的**关闭**是通过 Vueuse 的 `createTemplatePromise` 函数提供的 `resolve` 和 `reject` 函数实现的，只有在主动点击【确认】时才 `resolve`，主动【取消】或【关闭】操作都将调用 `reject` 函数，可以通过其参数来获取关闭的原因 `reason` 和关闭时传递的参数 `data`。

:::

<preview path="@/components/basic/dialog/basic/index.vue" />

## 设置对话框内容

对话框的内容设置主要是头部、主体内容和底部区域。通常在头部放置对话框标题和【关闭】按钮，在底部放置【确认】和【取消】按钮，而主体区域是主要设置内容的地方。由于我们基于 ElDialog 进行二次封装，因此在头部可以通过 `title` 属性来设置简单的文本（即对话框标题），如果需要进行复杂的设置可以使用 `renderHeader()` 函数以及 portal-vue 对应的目标位置（组件提供 `headerPortalName` 作为 `<portal />` 的 `to` 值）来指定内容。

::: info 注意

- 三种设置内容的方式优先级为：渲染函数 > portal-vue 方式 > `title` 属性。
- 使用 portal-vue 方式可以向同一个目标位置指定多个来源，可以指定 `order` 值来明确渲染的先后顺序，同时指定 `name` 值，以避免重复渲染。

:::

对于主体区域，我们同样有三种方式来设置内容，只不过名称不一样（这里为 `content` 属性、 `render()` 函数和 `contentPortalName` 值）。

底部区域我们默认提供【取消】和【确定】两个操作按钮，可以通过 `actions` 属性来控制显示，如果其值为空数组则不会显示任何按钮。当然底部也有对应的 `renderFooter()` 函数和 `footerPortalName` 值。

::: code-group

```ts [设置头部]
<script lang="tsx" setup>
import { useDialog } from 'element-plus-lab';

const { openDialog: open1 } = useDialog();
const { openDialog: open2, headerPortalName } = useDialog();
const { openDialog: open3 } = useDialog();

function openWithTitle() {
  open1({
    title: "对话框标题"
  })
}

function openWithPortal() {
  // 这里可以不传任何参数
  // 对话框头部在模板中通过 portal-vue 指定
  open2()
}

function openWithRender() {
  open3({
    renderHeader: () => "对话框标题"
  })
}
<script>

<template>
  <portal :to="headerPortalName" name="header">
    <div>对话框标题</div>
  </portal>
</template>
```

```ts [设置主体内容]
<script lang="tsx" setup>
import { useDialog } from 'element-plus-lab';

const { openDialog: open1 } = useDialog();
const { openDialog: open2, contentPortalName } = useDialog();
const { openDialog: open3 } = useDialog();

function openWithContent() {
  open1({
    content: "对话框主体内容"
  })
}

function openWithPortal() {
  // 这里可以不传任何参数
  // 对话框主体内容在模板中通过 portal-vue 指定
  open2()
}

function openWithRender() {
  open3({
    render: () => "对话框主体内容"
  })
}
<script>

<template>
  <portal :to="contentPortalName" name="content">
    <div>对话框主体内容</div>
  </portal>
</template>
```

```ts [设置底部内容]
<script lang="tsx" setup>
import { useDialog } from 'element-plus-lab';

const { openDialog: open1 } = useDialog();
const { openDialog: open2, footerPortalName } = useDialog();
const { openDialog: open3 } = useDialog();

function openWithActions() {
  // 只显示一个【确认】按钮
  // 通过 `okText` 修改按钮文本
  // 通过 `okHandler` 来处理【确认】事件
  open1({
    okText: "Ok",
    actions: ['ok'],
    okHandler: (resolve) => {
      // 直接关闭，可以设置 `data` 来传递参数
      // 这里 `resolve()` 参数会成为 `open1()` 函数的返回值
      resolve({ reason: 'ok', data: '这里是关闭传递的参数' })
    }
  })
}

function openWithPortal() {
  // 这里可以不传任何参数
  // 对话框底部在模板中通过 portal-vue 指定
  open2()
}

function openWithRender() {
  open3({
    renderFooter: (resolve, reject) => (
      <>
        <ElButton onClick={() => reject({ reason: 'cancel' })}>退出</ElButton>
        <ElButton onClick={() => resolve({ reason: 'ok' })} type="primary">
          下一步
        </ElButton>
      </>
    ),
  });
}
<script>

<template>
  <portal :to="footerPortalName" name="footer" v-slot="{ resolve, reject }">
    <ElButton @click="() => reject({ reason: 'cancel' })">取消</ElButton>
    <ElButton type="primary" @click="() => resolve({ reason: 'ok', data: '额外内容' })">确认</ElButton>
  </portal>
</template>
```

<preview path="@/components/basic/dialog/set-content/index.vue" />

:::

## beforeClose() 函数

组件提供了底部区域点击【取消】和【确定】的事件处理器 `cancelHandler` 和 `okHandler`，通过参数 `resolve` 和 `reject` 可以控制是否要关闭对话框，但是如果通过点击右上角的【关闭】图标、点击遮罩或者按 <kbd>Esc</kbd> 关闭对话框时想要阻止就需要用到 `beforeClose()` 函数。

`beforeClose` 支持两种方式来控制对话框的关闭：

1. **通过返回值控制**：
   - 返回 `false`：阻止对话框关闭
   - 返回 `true`、`undefined` 或不返回值：允许关闭对话框

2. **通过 `resolve`/`reject` 参数手动控制**：
   - 调用 `resolve({ reason: 'ok', data: '...' })` 手动关闭对话框
   - 调用 `reject({ reason: 'cancel', data: '...' })` 取消关闭（但这种方式在 `beforeClose` 中较少使用）

两种方式可以结合使用，如果手动调用了 `resolve`/`reject`，则不再检查返回值。

<preview path="@/components/basic/dialog/before-close/index.vue" />

## 保留 ElDialog 实例不被销毁

默认情况下 `useDialog` 会在关闭时自动销毁 `<el-dialog>` 组件实例，并默认设置了属性 `destroyOnClose` 为 `true`。如果想要保留 `<el-dialog>` 的实例不被销毁，请按以下方式来设置：

1. 将 `useDialog()` 的第一个参数 `keepInstance` 设置为 `true`。
2. 建议同时通过 `useDialog()` 第二个参数 `targetName`（例如：`ell-dialog-keep`） 添加自己的 portal-target 目标名称来挂载 `<el-dialog>` 的实例，并在当前页面放置 `<portal-target name="ell-dialog-keep" multiple />`，这样 `<el-dialog>` 实例跟随页面一同销毁。

<preview path="@/components/basic/dialog/keep-instance/index.vue" />

## 如何二次封装

组件只提供了最基础的功能，基于当前组件可以扩展出很多的业务组件，这里给出一个典型的场景示例：在打开对话框前显示加载状态，避免用户长时间等待。

下面是实现的参考代码片段（仅作参考，并非最佳实践）：

```tsx
import { useDialog } from 'element-plus-lab';

type XxxProps = {};

export function useEllXxx() {
  // `useRequestMask()` 需要自行实现
  const { openMask, closeMask } = useRequestMask();
  const { openDialog, ...others } = useDialog();

  return {
    openDialog: async (args: XxxProps) => {
      await openMask('组件加载中...');
      return new Promise(outerResolve => {
        // 使用 `setTimeout` 用于确保遮罩优先于对话框显示，避免长时间等待
        setTimeout(() => {
          outerResolve(
            openDialog({
              title: args.title, // 可以自行选择在当前组件中暴露出哪些 `useDialog` 的属性
              dialogConfig: {
                ...args.dialogConfig,
                onOpened: async () => {
                  // 在这里关闭遮罩
                  await closeMask();
                }
              },
              beforeClose: args.beforeClose,
              render: (resolve, reject) => {
                return (
                  <div>二次封装内容</div>
                )
              },
              renderFooter: (resolve, reject) => {
                return (
                  <div>自定义底部</div>
                )
              }
            })
          )
        }, 10);
      })
    },
    ...others
  }
}
```

## API

```ts
import { useDialog } from 'element-plus-lab';

const { openDialog, /* 导出参数 */ } = useDialog(keepInstance?, targetName?);

const res = openDialog({
  // 配置
});
```

### useDialog 参数

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| keepInstance | 是否保持实例（不销毁 `<el-dialog>` 组件，可以多次打开同一个对话框） | `boolean` | `false` |
| targetName | `<el-dialog>` 组件放置位置 `portal-vue` 目标名称 | `string` | `'ell-dialog'` |

### openDialog 参数

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| args | 对话框配置参数 | `EllDialogProps \| undefined` | `undefined` |

### Props

所有属性都可作为 `openDialog()` 的参数，也可以不传任何参数显示一个带标题和按钮无主体内容的对话框。

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 对话框标题 | `string` | `'提示'` |
| width | 对话框宽度 | `number` | `400` |
| content | 对话框主体内容 | `string` | - |
| dialogConfig | ElDialog 组件的属性配置 | `Partial<DialogProps>` | - |
| actions | 对话框底部按钮配置 | `Array<'cancel' \| 'ok'>` | `['cancel', 'ok']` |
| okText | 确定按钮文本 | `string` | `'确定'` |
| cancelText | 取消按钮文本 | `string` | `'取消'` |
| renderHeader | 对话框头部渲染器 | `(resolve: (v: EllOverlayResult \| Promise<EllOverlayResult>) => void, reject: (value?: any) => void ) => JSX.Element \| string \| VNodeChild` | - |
| render | 对话框主体内容渲染器 | `(resolve: (v: EllOverlayResult \| Promise<EllOverlayResult>) => void, reject: (value?: any) => void ) => JSX.Element \| string \| VNodeChild` | - |
| renderFooter | 对话框底部渲染器 | `(resolve: (v: EllOverlayResult \| Promise<EllOverlayResult>) => void, reject: (value?: any) => void ) => JSX.Element \| string \| VNodeChild` | - |
| beforeClose | 对话框关闭时的拦截函数 | `(resolve: (v: EllOverlayResult) => void, reject: (v: EllOverlayResult) => void) => boolean \| Promise<boolean \| undefined> \| Promise<void> \| undefined` | - |
| okHandler | 确认按钮事件处理器 | `(resolve: (v: EllOverlayResult) => void, reject: (v: EllOverlayResult) => void) => Promise<void> \| void` | - |
| cancelHandler | 取消按钮事件处理器 | `(resolve: (v: EllOverlayResult) => void, reject: (v: EllOverlayResult) => void) => Promise<void> \| void` | - |

### Portal

通过组件提供的 Portal 传送目标位置，可以灵活的设置组件的内容。

| 属性名 | 描述 | 支持多个来源 | 参数 | 默认值 |
| --- | --- | --- | --- | --- |
| headerPortalName | 用于指定对话框头部内容 | 是 | `{ resolve, reject, args }` | `${sender}-el-dialog-header` |
| contentPortalName | 用于指定对话框主体内容 | 是 | `{ resolve, reject, args }` | `${sender}-el-dialog-content` |
| footerPortalName | 用于指定对话框底部内容 | 是 | `{ resolve, reject, args }` | `${sender}-el-dialog-footer` |

::: info 说明：

- `resolve()` 和 `reject()` 为关闭对话框的函数。
- `args` 为 `openDialog` 传入的配置参数。

:::

## 类型说明

::: details 显示类型声明

```ts
import type { DialogProps } from 'element-plus';
import type { JSX } from 'vue/jsx-runtime';

import type { VNodeChild } from 'vue';

/**
 * 对话框关闭原因
 *
 * @description 对话框关闭原因可用于判断是否正常关闭和取消关闭
 *
 * - `cancel`：取消关闭
 * - `close`：点击关闭按钮关闭
 * - `ok`：确认关闭
 */
export type EllDialogCloseReason = 'cancel' | 'close' | 'ok';

export interface EllDialogProps {
  /**
   * 对话框标题
   *
   * @defaultValue `'提示'`
   */
  title?: string;

  /**
   * 对话框宽度
   *
   * @defaultValue `400`
   */
  width?: number;

  /**
   * `<el-dialog>` 的属性
   */
  dialogConfig?: Partial<DialogProps>;

  /**
   * 对话框底部按钮配置
   *
   * @defaultValue `['cancel', 'ok']`
   * @description 按钮配置决定了对话框底部按钮的显示顺序和内容
   *
   * - `cancel`：取消按钮
   * - `ok`：确认按钮
   */
  actions?: Array<'cancel' | 'ok'>;

  /**
   * 【确定】按钮的文本
   *
   * @defaultValue `确定`
   */
  okText?: string;

  /**
   * 【取消】按钮的文本
   *
   * @defaultValue `取消`
   */
  cancelText?: string;

  /**
   * 对话框主体内容
   *
   * @description 适用于作为提示框，显示简单的文本
   */
  content?: string;

  /**
   * 渲染对话框头部
   *
   * @description 渲染对话框头部，用于自定义对话框头部内容
   * @remarks 优先级高于使用 portal-vue 指定的内容 `${uid}-el-dialog-header`
   *
   * @param resolve 成功关闭对话框方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭对话框方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 对话框头部内容
   */
  renderHeader?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild;

  /**
   * 渲染对话框主体内容
   *
   * @description 渲染对话框主体内容，用于自定义对话框主体内容
   * @remarks 优先级高于使用 portal-vue 指定的内容 `${uid}-el-dialog-content`
   *
   * @param resolve 成功关闭对话框方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭对话框方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 对话框主体内容
   */
  render?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild;

  /**
   * 渲染对话框底部
   *
   * @description 渲染对话框底部，用于自定义对话框底部内容
   * @remarks 优先级高于使用 portal-vue 指定的内容 `${uid}-el-dialog-footer`
   *
   * @param resolve 成功关闭对话框方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭对话框方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 对话框底部内容
   */
  renderFooter?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild;

  /**
   * 对话框关闭前的拦截函数
   *
   * @param resolve 成功关闭对话框方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭对话框方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 返回 `false` 阻止关闭，返回 `true`、`undefined` 或 `Promise<void>` 允许关闭。也可以通过 `resolve`/`reject` 手动控制关闭
   */
  beforeClose?: (
    resolve: (v: EllOverlayResult) => void,
    reject: (v: EllOverlayResult) => void,
  ) => boolean | Promise<boolean | undefined> | Promise<void> | undefined;

  /**
   * 【确认】按钮的回调函数
   *
   * @param resolve 成功关闭对话框方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭对话框方法（`reject({ reason: 'cancel', data: '...'})`）
   */
  okHandler?: (
    resolve: (v: EllOverlayResult) => void,
    reject: (v: EllOverlayResult) => void,
  ) => Promise<void> | void;

  /**
   * 【取消】按钮的回调函数
   *
   * @param resolve 成功关闭对话框方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭对话框方法（`reject({ reason: 'cancel', data: '...'})`）
   */
  cancelHandler?: (
    resolve: (v: EllOverlayResult) => void,
    reject: (v: EllOverlayResult) => void,
  ) => Promise<void> | void;
}

/**
 * 对话框关闭原因及传递的参数
 *
 * @description 对话框关闭原因及传递的参数，用于在对话框关闭时传递参数
 *
 * - `data`：对话框关闭时传递的参数
 * - `reason`：关闭原因
 */
export interface EllDialogResult extends EllOverlayResult {}
```

:::

---
title: useDrawer 抽屉封装
---

# useDrawer 抽屉封装

`useDrawer` 钩子函数主要基于 Vue Use 提供的 `createTemplatePromise()` 函数以及 portal-vue 来封装 `<el-drawer>` 功能。

1. **基于 Element Plus 的 `<el-drawer>`**：直接使用 `<el-drawer>` 组件，通过 `drawerConfig` 可以访问原组件的全部功能和属性，与 Element Plus 生态完美融合。
2. **Promise 化的 API**：使用 `async/await` 或 Promise 方式处理抽屉的确认/取消操作，代码更简洁直观，无需额外的状态管理。
3. **支持嵌套抽屉**：可以在抽屉内部打开新的抽屉，支持复杂的交互场景。
4. **灵活的内容设置方式**：支持三种方式设置内容（文本、渲染函数、portal-vue），优先级清晰，可以灵活组合使用。
5. **Portal-vue 集成**：借助 portal-vue 的强大功能，可以将来自不同组件的内容同时渲染到同一抽屉中，实现跨组件的组合。
6. **自动清理机制**：抽屉关闭时自动清理 portal 状态，无需手动管理，避免状态残留问题。

::: info 注意

要使用 `useDrawer`，请确保在全局中（通常在设置 `RouterView` 的位置）设置好 portal-vue 的目标位置 `<PortalTarget name="ell-drawer" multiple />`。

:::

## 基础用法

最简单的使用方式就是设置 `content` 属性，同时我们可以在调用 `openDrawer` 时通过 `async/await` 结合 `try...catch` 或者 Promise 方式来实现**确认/取消**功能。

::: code-group

```ts [使用 async/await 结合 try...catch]
import { ElMessage } from 'element-plus';
import { useDrawer } from 'element-plus-lab';

const { openDrawer } = useDrawer();

async function open() {
  try {
    await openDrawer({ content: '确定要执行此操作吗？' });
    ElMessage.success('已确认');
  } catch (error) {
    console.error(error);
    ElMessage.info('已取消');
  }
}
```

```ts [使用 Promise]
import { ElMessage } from 'element-plus';
import { useDrawer } from 'element-plus-lab';

const { openDrawer } = useDrawer();

function open() {
  openDrawer({ content: '确定要执行此操作吗？' })
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

抽屉的**关闭**是通过 VueUse 的 `createTemplatePromise` 函数提供的 `resolve` 和 `reject` 函数实现的，只有在主动点击【确认】时才 `resolve`，主动【取消】或【关闭】操作都将调用 `reject` 函数，可以通过其参数来获取关闭的原因 `reason` 和关闭时传递的参数 `data`。

:::

<preview path="@/components/basic/drawer/basic/index.vue" />

## variant 展示变体

通过 `variant` 可以控制抽屉的整体布局与展示形态，适用于不同业务场景。

| 取值 | 说明 |
| --- | --- |
| **`default`** | 带标题和关闭按钮 + 主体内容（需用户通过 `content` / `render` / portal 指定） + 底部操作按钮（取消、确定）。适合需要用户确认或提交的表单、详情等场景。 |
| **`blank`** | 仅显示空白内容区，不包含标题和关闭按钮；支持点击遮罩或按 <kbd>Esc</kbd> 关闭。适合纯内容展示、临时浮层等无需头部与底部按钮的场景。 |
| **`simple`** | 带标题和关闭按钮，不包含底部操作按钮；仅能通过右上角关闭按钮关闭（不响应遮罩与 Esc）。适合仅需标题与关闭、内容完全自定义的场景。 |

三者区别简要归纳：

- **default**：标题 + 关闭 + 内容（需指定）+ 取消/确定按钮。
- **blank**：仅内容区，无标题无关闭按钮，支持遮罩关闭。
- **simple**：标题 + 关闭，无底部按钮，仅能通过关闭按钮关闭。

::: tip 样式说明

本封装不会修改 `<el-drawer>` 的默认样式，头部和底部区域的外观（如标题字体、关闭图标、按钮间距等）均沿用 Element Plus 的默认表现。如需与项目设计风格统一，请自行通过 `drawerConfig` 传入的类名、或使用 `renderHeader` / `renderFooter` 完全自定义头部与底部内容并施加样式。

:::

<preview path="@/components/basic/drawer/variant/index.vue" />

## 设置抽屉内容

抽屉的内容设置主要是头部、主体内容和底部区域。通常在头部放置抽屉标题和【关闭】按钮，在底部放置【确认】和【取消】按钮，而主体区域是主要设置内容的地方。由于我们基于 ElDrawer 进行二次封装，因此在头部可以通过 `title` 属性来设置简单的文本（即抽屉标题），如果需要进行复杂的设置可以使用 `renderHeader()` 函数以及 portal-vue 对应的目标位置（组件提供 `headerPortalName` 作为 `<portal />` 的 `to` 值）来指定内容。

::: info 注意

- 三种设置内容的方式优先级为：渲染函数 > portal-vue 方式 > `title` 属性。
- 使用 portal-vue 方式可以向同一个目标位置指定多个来源，可以指定 `order` 值来明确渲染的先后顺序，同时指定 `name` 值，以避免重复渲染。

:::

对于主体区域，我们同样有三种方式来设置内容，只不过名称不一样（这里为 `content` 属性、 `render()` 函数和 `contentPortalName` 值）。

底部区域我们默认提供【取消】和【确定】两个操作按钮，可以通过 `actionConfig.actions` 属性来控制显示，如果其值为空数组则不会显示任何按钮。通过 `actionConfig.placement` 可指定操作按钮在**头部**（`'top'`）或**底部**（`'bottom'`，默认）展示。当然底部也有对应的 `renderFooter()` 函数和 `footerPortalName` 值。

**头部关闭按钮**：使用 ElDrawer 自带的关闭按钮，不额外渲染自定义关闭图标。通过 `headerConfig.closePlacement` 可控制其显示在标题的**左侧**（`'left'`）或**右侧**（`'right'`，默认）：设为 `'left'` 时，会为抽屉根节点添加类名 `ell-drawer-close-left`，需配合样式使 `.el-drawer__close-btn` 排在左侧（见下方说明）。关闭按钮仅允许出现在头部的最左或最右位置。

**操作按钮位置**：通过 `actionConfig.placement` 可指定取消/确定按钮在**头部**（`'top'`）或**底部**（`'bottom'`，默认）展示。

下方示例演示关闭按钮在左/右侧、以及操作按钮在头部/底部的效果。

::: tip 关闭按钮在左侧时的样式

当 `headerConfig.closePlacement === 'left'` 时，抽屉根节点会带上类名 `ell-drawer-close-left`。若需将 ElDrawer 自带的关闭按钮显示在左侧，可引入组件包提供的样式，或在项目中自行添加相同规则：

```css
.el-drawer.ell-drawer-close-left .el-drawer__header { display: flex; flex-direction: row; }
.el-drawer.ell-drawer-close-left .el-drawer__close-btn { order: -1; }
```

通过 npm 使用时可按需引用：`import 'element-plus-lab/drawer-close-placement.css'`。
:::

<preview path="@/components/basic/drawer/header-actions-layout/index.vue" />

::: code-group

```vue [设置头部]
<script lang="tsx" setup>
import { useDrawer } from 'element-plus-lab'

const { openDrawer: open1 } = useDrawer()
const { openDrawer: open2, headerPortalName } = useDrawer()
const { openDrawer: open3 } = useDrawer()

function openWithTitle() {
  open1({ title: '抽屉标题', content: '内容' })
}

function openWithPortal() {
  // 不传参数，头部在模板中通过 portal 指定
  open2()
}

function openWithRender() {
  open3({ renderHeader: () => '抽屉标题', content: '内容' })
}
</script>

<template>
  <portal :to="headerPortalName" name="header">
    <div>抽屉标题</div>
  </portal>
</template>
```

```vue [设置主体内容]
<script lang="tsx" setup>
import { useDrawer } from 'element-plus-lab'

const { openDrawer: open1 } = useDrawer()
const { openDrawer: open2, contentPortalName } = useDrawer()
const { openDrawer: open3 } = useDrawer()

function openWithContent() {
  open1({ title: '标题', content: '抽屉主体内容' })
}

function openWithPortal() {
  // 不传参数，主体内容在模板中通过 portal 指定
  open2()
}

function openWithRender() {
  open3({ title: '标题', render: () => '抽屉主体内容' })
}
</script>

<template>
  <portal :to="contentPortalName" name="content">
    <div>抽屉主体内容</div>
  </portal>
</template>
```

```vue [设置底部内容]
<script lang="tsx" setup>
import { useDrawer } from 'element-plus-lab'

const { openDrawer: open1 } = useDrawer()
const { openDrawer: open2, footerPortalName } = useDrawer()
const { openDrawer: open3 } = useDrawer()

function openWithActions() {
  // 只显示一个【确认】按钮，通过 actionConfig 配置
  open1({
    title: '标题',
    content: '内容',
    actionConfig: {
      actions: ['ok'],
      okText: 'Ok',
      okHandler: (resolve) => {
        resolve({ reason: 'ok', data: '关闭时传递的参数' })
      },
    },
  })
}

function openWithPortal() {
  open2() // 底部在模板中通过 portal 指定
}

function openWithRender() {
  open3({
    title: '标题',
    content: '内容',
    renderFooter: (resolve, reject) => (
      <>
        <ElButton onClick={() => reject({ reason: 'cancel' })}>退出</ElButton>
        <ElButton onClick={() => resolve({ reason: 'ok' })} type="primary">下一步</ElButton>
      </>
    ),
  })
}
</script>

<template>
  <portal v-slot="{ resolve, reject }" :to="footerPortalName" name="footer">
    <ElButton @click="() => reject({ reason: 'cancel' })">
      取消
    </ElButton>
    <ElButton type="primary" @click="() => resolve({ reason: 'ok', data: '额外内容' })">
      确认
    </ElButton>
  </portal>
</template>
```

:::

<preview path="@/components/basic/drawer/set-content/index.vue" />

## beforeClose() 函数

组件提供了底部区域点击【取消】和【确定】的事件处理器 `cancelHandler` 和 `okHandler`，通过参数 `resolve` 和 `reject` 可以控制是否要关闭抽屉，但如果通过点击头部的【关闭】按钮、点击遮罩或按 <kbd>Esc</kbd> 关闭抽屉时希望进行拦截，就需要使用 `beforeClose()` 函数。

`beforeClose` 支持两种方式来控制抽屉的关闭：

1. **通过返回值控制**：
   - 返回 `false`：阻止抽屉关闭
   - 返回 `true`、`undefined` 或不返回值：允许关闭抽屉

2. **通过 `resolve`/`reject` 参数手动控制**：
   - 调用 `resolve({ reason: 'ok', data: '...' })` 手动关闭抽屉
   - 调用 `reject({ reason: 'cancel', data: '...' })` 取消关闭（但这种方式在 `beforeClose` 中较少使用）

两种方式可以结合使用，如果手动调用了 `resolve`/`reject`，则不再检查返回值。

<preview path="@/components/basic/drawer/before-close/index.vue" />

## 保留 ElDrawer 实例不被销毁

默认情况下 `useDrawer` 会在关闭时自动销毁 `<el-drawer>` 组件实例，并默认设置了属性 `destroyOnClose` 为 `true`。如果想要保留 `<el-drawer>` 的实例不被销毁，请按以下方式来设置：

1. 将 `useDrawer()` 的第一个参数 `keepInstance` 设置为 `true`。
2. 建议同时通过 `useDrawer()` 第二个参数 `targetName`（例如：`ell-drawer-keep`） 添加自己的 portal-target 目标名称来挂载 `<el-drawer>` 的实例，并在当前页面放置 `<portal-target name="ell-drawer-keep" multiple />`，这样 `<el-drawer>` 实例跟随页面一同销毁。

<preview path="@/components/basic/drawer/keep-instance/index.vue" />

## 如何二次封装

组件只提供了最基础的功能，基于当前组件可以扩展出很多的业务组件，这里给出一个典型场景示例：在打开抽屉前显示加载状态，避免用户长时间等待。

下面是实现的参考代码片段（仅作参考，并非最佳实践）：

```tsx
import { useDrawer } from 'element-plus-lab';

type XxxProps = {};

export function useEllXxx() {
  // `useRequestMask()` 需要自行实现
  const { openMask, closeMask } = useRequestMask();
  const { openDrawer, ...others } = useDrawer();

  return {
    openDrawer: async (args: XxxProps) => {
      await openMask('组件加载中...');
      return new Promise(outerResolve => {
        // 使用 `setTimeout` 用于确保遮罩优先于抽屉显示，避免长时间等待
        setTimeout(() => {
          outerResolve(
            openDrawer({
              title: args.title, // 可以自行选择在当前组件中暴露出哪些 `useDrawer` 的属性
              drawerConfig: {
                ...args.drawerConfig,
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
import { useDrawer } from 'element-plus-lab';

const { openDrawer, /* 导出参数 */ } = useDrawer(keepInstance?, targetName?);

const res = openDrawer({
  // 配置
});
```

### useDrawer 参数

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| keepInstance | 是否保持实例（不销毁 `<el-drawer>` 组件，可以多次打开同一个抽屉） | `boolean` | `false` |
| targetName | `<el-drawer>` 组件放置位置 `portal-vue` 目标名称 | `string` | `'ell-drawer'` |

### openDrawer 参数

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| args | 抽屉配置参数 | `EllDrawerProps \| undefined` | `undefined` |

### Props

所有属性都可作为 `openDrawer()` 的参数。**不传任何参数**时，会显示一个无头部、仅主体区域的抽屉，点击遮罩或按 <kbd>Esc</kbd> 即可关闭。

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 抽屉标题（便捷入口，可被 `headerConfig.title` 覆盖） | `string` | `'编辑'` |
| variant | 抽屉展示变体（整体外观与布局） | `'blank' \| 'default' \| 'simple'` | - |
| size | 抽屉宽度（数字）或尺寸（字符串） | `number \| string` | `400` |
| content | 抽屉主体内容 | `string \| VNodeChild` | - |
| drawerConfig | ElDrawer 组件的属性配置 | `Partial<DrawerProps>` | - |
| headerConfig | 头部配置（标题、是否显示关闭按钮、关闭按钮位置等） | `EllDrawerHeaderConfig` | - |
| actionConfig | 操作按钮配置（按钮组、文案、放置位置、回调等） | `EllDrawerActionConfig` | - |
| renderHeader | 抽屉头部渲染器 | `(resolve, reject) => JSX.Element \| string \| VNodeChild` | - |
| render | 抽屉主体内容渲染器 | `(resolve, reject) => JSX.Element \| string \| VNodeChild` | - |
| renderFooter | 抽屉底部渲染器 | `(resolve, reject) => JSX.Element \| string \| VNodeChild` | - |
| beforeClose | 抽屉关闭时的拦截函数 | `(resolve, reject) => boolean \| Promise<boolean \| undefined \| void>` | - |

**常用字段说明：**

- **headerConfig**：`title`（标题）、`closeable`（是否显示关闭按钮，优先级高于 `drawerConfig.showClose`）、`closePlacement`（关闭按钮在标题左侧 `'left'` 或右侧 `'right'`，仅允许头部最左或最右）。
- **actionConfig**：`actions`（`['cancel','ok']`）、`okText`、`cancelText`、`placement`（操作按钮在 `'top'` 头部或 `'bottom'` 底部，默认 `'bottom'`）、`okHandler`、`cancelHandler`。

### Portal

通过组件提供的 Portal 传送目标位置，可以灵活的设置组件的内容。

| 属性名 | 描述 | 支持多个来源 | 参数 | 默认值 |
| --- | --- | --- | --- | --- |
| headerPortalName | 用于指定抽屉头部内容 | 是 | `{ resolve, reject, args }` | `${sender}-el-drawer-header` |
| contentPortalName | 用于指定抽屉主体内容 | 是 | `{ resolve, reject, args }` | `${sender}-el-drawer-content` |
| footerPortalName | 用于指定抽屉底部内容 | 是 | `{ resolve, reject, args }` | `${sender}-el-drawer-footer` |

::: info 说明：

- `resolve()` 和 `reject()` 为关闭抽屉的函数。
- `args` 为 `openDrawer` 传入的配置参数。

:::

## 类型说明

::: details 显示类型声明

```ts
import type { DrawerProps } from 'element-plus';
import type { JSX } from 'vue/jsx-runtime';

import type { VNodeChild } from 'vue';

// 关闭原因使用共享类型 EllOverlayCloseReason（'cancel' | 'close' | 'ok'）
import type { EllOverlayCloseReason, EllOverlayResult } from '@element-plus-lab/utils'

export interface EllDrawerProps {
  /**
   * 抽屉标题
   *
   * @defaultValue `'编辑'`
   */
  title?: string;

  /**
   * 抽屉宽度（数字）或尺寸（字符串）
   *
   * @defaultValue `400`
   */
  size?: number | string;

  /**
   * `<el-drawer>` 的属性
   */
  drawerConfig?: Partial<DrawerProps>;

  /**
   * 抽屉展示变体（整体外观与布局）
   */
  variant?: 'blank' | 'default' | 'simple';

  /**
   * 头部区域配置（标题、是否显示关闭按钮、关闭按钮位置等）
   */
  headerConfig?: {
    title?: string;
    /** 是否显示关闭按钮，优先级高于 drawerConfig.showClose */
    closeable?: boolean;
    /** 关闭区域在标题的左侧或右侧 */
    closePlacement?: 'left' | 'right';
  };

  /**
   * 底部操作区域配置
   *
   * @defaultValue `{ actions: ['cancel', 'ok'], okText: '确定', cancelText: '取消' }`
   */
  actionConfig?: {
    actions?: Array<'cancel' | 'ok'>;
    okText?: string;
    cancelText?: string;
    placement?: 'top' | 'bottom';
    okHandler?: (resolve: (v: EllOverlayResult) => void, reject: (v: EllOverlayResult) => void) => Promise<void> | void;
    cancelHandler?: (resolve: (v: EllOverlayResult) => void, reject: (v: EllOverlayResult) => void) => Promise<void> | void;
  };

  /**
   * 抽屉主体内容（适用于简单文本或 VNode）
   */
  content?: string | VNodeChild;

  /**
   * 渲染抽屉头部
   *
   * @description 渲染抽屉头部，用于自定义抽屉头部内容
   * @remarks 优先级高于使用 portal-vue 指定的内容 `${uid}-el-drawer-header`
   *
   * @param resolve 成功关闭抽屉方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭抽屉方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 抽屉头部内容
   */
  renderHeader?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild;

  /**
   * 渲染抽屉主体内容
   *
   * @description 渲染抽屉主体内容，用于自定义抽屉主体内容
   * @remarks 优先级高于使用 portal-vue 指定的内容 `${uid}-el-drawer-content`
   *
   * @param resolve 成功关闭抽屉方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭抽屉方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 抽屉主体内容
   */
  render?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild;

  /**
   * 渲染抽屉底部
   *
   * @description 渲染抽屉底部，用于自定义抽屉底部内容
   * @remarks 优先级高于使用 portal-vue 指定的内容 `${uid}-el-drawer-footer`
   *
   * @param resolve 成功关闭抽屉方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭抽屉方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 抽屉底部内容
   */
  renderFooter?: (
    resolve: (v: EllOverlayResult | Promise<EllOverlayResult>) => void,
    reject: (value?: any) => void,
  ) => JSX.Element | string | VNodeChild;

  /**
   * 抽屉关闭前的拦截函数
   *
   * @param resolve 成功关闭抽屉方法（`resolve({ reason: 'ok', data: '...'})`）
   * @param reject 取消关闭抽屉方法（`reject({ reason: 'cancel', data: '...'})`）
   * @returns 返回 `false` 阻止关闭，返回 `true`、`undefined` 或 `Promise<void>` 允许关闭。也可以通过 `resolve`/`reject` 手动控制关闭
   */
  beforeClose?: (
    resolve: (v: EllOverlayResult) => void,
    reject: (v: EllOverlayResult) => void,
  ) => boolean | Promise<boolean | undefined> | Promise<void> | undefined;
}

/**
 * 抽屉关闭原因及传递的参数
 *
 * @description 抽屉关闭原因及传递的参数，用于在抽屉关闭时传递参数
 *
 * - `data`：抽屉关闭时传递的参数
 * - `reason`：关闭原因
 */
export interface EllDrawerResult extends EllOverlayResult {}
```

:::

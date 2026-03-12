---
title: 在单元测试中 mock portal-vue
order: 5
---

# 在单元测试中 mock portal-vue

`portal-vue` 的核心行为是：通过 `Wormhole.open()` 把内容「传送」到某个目标名（`to`），再由对应的 `<PortalTarget name="xxx" />` 真实渲染出来。这个机制在真实项目里很好用，但在单元测试里如果直接使用真实实现，`mount()` 得到的组件树里经常看不到对话框本体（如 `ElDialog`），导致无法通过 DOM / 组件树做断言。

本项目为了解决这个问题，采用了一套**有状态的 mock 实现**，既能监听 `Wormhole.open()` 的调用参数，又能让 `<PortalTarget>` 真正渲染出被传送的内容，方便用 `findComponent()`、`findAllComponents()` 等方式做断言。

## 总体方案概览

- 在 `packages/test-utils/src/make-portal.ts` 中实现一个「有状态 portal」：
  - 维护一个基于 `name`（`to`）的内部状态表。
  - `Wormhole.open()` 会把 `{ to, from, content }` 写入对应目标的列表。
  - `PortalTarget` 根据 `props.name` 读取最新一条内容并真正渲染对应组件。
- 在项目根目录的 `__mocks__/portal-vue.ts` 中，统一导出上述实现：
  - 测试中只需要 `vi.mock('portal-vue')` 即可启用 mock。
  - 所有 `import { PortalTarget, Wormhole } from 'portal-vue'` 都会指向测试实现。

这样可以满足两类典型测试需求：

- **行为测试**：通过 `vi.spyOn(Wormhole as any, 'open')` 断言调用参数（`to`、`from`、`content` 等）。
- **渲染测试**：在测试组件模板内渲染 `<PortalTarget name="xxx" />`，然后用 `wrapper.findComponent(ElDialog)`、`findAllComponents(ElButton)` 等做 DOM / 组件断言。

## 有状态 portal 实现（make-portal.ts）

文件：`packages/test-utils/src/make-portal.ts`

核心代码结构如下（省略了部分类型与注释，保留关键逻辑）：

```ts
import { defineComponent, h, shallowRef } from 'vue'

type PortalContent = {
  to: string
  from: string
  content: any // 实际渲染的组件，例如 EllDialog
}

const targetMap = new Map<string, ReturnType<typeof shallowRef<PortalContent[]>>>()

function ensureTarget(name: string): ReturnType<typeof shallowRef<PortalContent[]>> {
  let store = targetMap.get(name)
  if (!store) {
    store = shallowRef<PortalContent[]>([])
    targetMap.set(name, store)
  }
  return store
}

const WormholeImpl = {
  open(payload: PortalContent) {
    const store = ensureTarget(payload.to)
    store.value = [...(store.value ?? []), payload]
  },
  close({ to, from }: { to: string; from: string }) {
    const store = ensureTarget(to)
    store.value = (store.value ?? []).filter((item) => item.from !== from)
  },
  getContentForTarget(name: string) {
    return ensureTarget(name).value
  },
}

export const Wormhole = WormholeImpl

export const PortalTarget = defineComponent({
  name: 'PortalTarget',
  props: {
    name: { type: String, required: true },
    multiple: { type: Boolean, default: false },
    slotProps: { type: Object, required: false },
  },
  setup(props) {
    const store = ensureTarget(props.name)
    return () => {
      const items = store.value || []
      if (!items.length) return null
      const latest = items[items.length - 1]
      const Content = latest.content
      return typeof Content === 'function' ? h(Content) : Content
    }
  },
})
```

要点：

- **用 `Map + shallowRef` 维护每个 `to` 目标的「传送队列」**，保证多次调用 `open()` 时能看到最新内容。
- **`PortalTarget` 按 `name` 订阅目标队列并渲染最新一项**，从而在单元测试渲染树里真正出现 `EllDialog` 等组件。
- 真实项目中 `createTemplatePromise` + `EllDialog` 会把一个组件树塞进 `content` 字段，这里直接 `h(Content)` 即可。

## 全局 mock 入口（__mocks__/portal-vue.ts）

文件：`__mocks__/portal-vue.ts`

```ts
export { PortalTarget, Wormhole } from '../packages/test-utils/src/make-portal'
```

配合 Vitest 的自动 mock 机制：

- 在测试文件中写上：

  ```ts
  vi.mock('portal-vue')
  import { PortalTarget, Wormhole } from 'portal-vue'
  ```

- 这样 `portal-vue` 不会再引用真实依赖，而是使用这里导出的测试实现。
- 如果不调用 `vi.mock('portal-vue')`，仍然会使用真实 `portal-vue`，通常不符合我们在单元测试中的需求。

## 在测试中如何使用

### 1. 行为测试：断言 Wormhole.open 参数

以 `useDialog` 的单元测试为例（`packages/components/dialog/__tests__/dialog.test.tsx`）：

```ts
vi.mock('portal-vue')
import { Wormhole } from 'portal-vue'
import { useDialog } from '../src/use-dialog'

it('调用 openDialog 时会通过 Wormhole.open 打开到指定 targetName', () => {
  let api!: ReturnType<typeof useDialog>

  const Holder = defineComponent({
    setup() {
      api = useDialog(false, 'custom-dialog-target')
      return () => null
    },
  })

  mount(Holder)

  const openSpy = vi.spyOn(Wormhole as any, 'open')

  api.openDialog({ content: 'test' })

  expect(openSpy).toHaveBeenCalled()
  const firstCall = openSpy.mock!.calls[0]![0]! as {
    to: string
    from: string
    content: unknown
  }
  expect(firstCall.to).toBe('custom-dialog-target')
  expect(firstCall.from).toBe('test-sender')
  expect(typeof firstCall.content).toBe('function')
})
```

实践建议：

- 用 `Holder` 组件在 `setup()` 里创建 `useDialog` 实例，并把返回值挂到 `Holder` 上，方便测试中访问。
- 对 `Wormhole` 使用 `as any` + 显式类型断言，可以减少 TypeScript 对 `mock` 属性的干扰。

### 2. 渲染测试：通过 PortalTarget 找到 EllDialog 和按钮

典型的 DOM 断言流程如下：

```ts
vi.mock('portal-vue')
import { PortalTarget, Wormhole } from 'portal-vue'
import { ElDialog, ElButton } from 'element-plus'
import { useDialog } from '../src/use-dialog'

it('在未传入 title/width 时，ElDialog 使用默认标题「提示」和默认宽度 400', async () => {
  const Wrapper = defineComponent({
    setup() {
      const dialog = useDialog(false, 'ell-dialog')
      ;(Wrapper as any).dialog = dialog
      return () => <PortalTarget name="ell-dialog" />
    },
  })

  const wrapper = mount(Wrapper)
  const dialog = (Wrapper as any).dialog as ReturnType<typeof useDialog> | undefined

  dialog?.openDialog()
  await nextTick()
  await nextTick()

  const elDialogWrapper = wrapper.findComponent(ElDialog)
  expect(elDialogWrapper.exists()).toBe(true)
  expect(elDialogWrapper.props('title')).toBe('提示')
  expect(elDialogWrapper.props('width')).toBe(400)
})

it('默认按钮标签为「取消」「确定」', async () => {
  const Wrapper = defineComponent({
    setup() {
      const dialog = useDialog(false, 'ell-dialog')
      ;(Wrapper as any).dialog = dialog
      return () => <PortalTarget name="ell-dialog" />
    },
  })

  const wrapper = mount(Wrapper)
  const dialog = (Wrapper as any).dialog as ReturnType<typeof useDialog> | undefined

  dialog?.openDialog()
  await nextTick()
  await nextTick()

  const buttons = wrapper.findAllComponents(ElButton)
  const texts = buttons.map((btn) => btn.text())

  expect(texts).toContain('取消')
  expect(texts).toContain('确定')
})
```

要点总结：

- `useDialog(false, 'ell-dialog')` 的 `targetName` 必须和 `<PortalTarget name="ell-dialog" />` 保持一致。
- `openDialog()` 会通过 mock 的 `Wormhole.open()` 写入 `{ to: 'ell-dialog', from, content: EllDialog }`。
- `PortalTarget` 从内部状态中读取最新内容并渲染，这样 `ElDialog` / `ElButton` 就真实出现在 `wrapper` 的渲染树中。
- 由于 `createTemplatePromise` 等链路是异步的，推荐在调用 `openDialog()` 后至少等待两次 `nextTick()`。

## 常见坑与排查思路

- **`vi.mock('portal-vue', () => makePortal(vi.fn))` 报 hoisting 错误**
  - 原因：Vitest 会把带工厂函数的 `vi.mock` 提升到文件顶部执行，此时 `makePortal` 等变量还未定义。
  - 解决：改为使用 `__mocks__/portal-vue.ts` 提供的统一 mock，不在测试文件里自己传工厂函数。

- **`wrapper.findComponent(ElDialog)` 找不到组件**
  - 确认是否：
    - 调用了 `vi.mock('portal-vue')`。
    - `useDialog` 使用的 `targetName` 和 `PortalTarget name` 一致。
    - 已正确调用 `openDialog()`，并等待了足够的 `nextTick()`。

- **TypeScript 报错：`mock`、`to`、`from` 类型不匹配**
  - 建议：
    - 对 spy 对象使用 `as any`，或者为 `mock.calls[0][0]` 显式声明一个包含 `to` / `from` / `content` 字段的类型。
    - 只在测试代码中放宽类型限制，业务代码保持严格。

这套「有状态 portal mock + 全局入口 + Wrapper/Holder 测试模式」是后续所有基于 `portal-vue` 的组件测试（例如未来的 `useDrawer`、复杂业务对话框等）的推荐实践，可以直接按以上套路复制粘贴，小范围替换 `targetName` 和行为断言逻辑即可复用。

---

*本文内容由 AI 辅助生成，仅供参考，请以官方文档与项目实践为准。*

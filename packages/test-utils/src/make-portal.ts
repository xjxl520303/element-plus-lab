import { defineComponent, h, shallowRef } from 'vue'

type PortalContent = {
  to: string
  from: string
  // 在我们的用例中，content 通常是一个 Vue 组件（如 EllDialog）
  content: any
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
    name: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    slotProps: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    return () => {
      const store = ensureTarget(props.name)
      const items = store.value || []
      if (!items.length) return null

      // 对于当前用例，我们只关心最后一次打开的内容
      const latest = items[items.length - 1]
      const Content = latest.content

      // createTemplatePromise + EllDialog 的组合最终会返回一个组件树
      // 这里直接渲染该组件即可
      return typeof Content === 'function' ? h(Content) : Content
    }
  },
})


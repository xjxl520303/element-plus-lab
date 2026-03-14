import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

vi.mock('ulid', () => ({
  ulid: () => 'test-drawer-sender',
}))

vi.mock('portal-vue')

import { PortalTarget, Wormhole } from 'portal-vue'
import { ElButton, ElDrawer } from 'element-plus'
import { useDrawer } from '../src/use-drawer'

describe('useDrawer - 基础返回值', () => {
  it('返回的 portal 名称基于 ulid 生成，前缀为 sender+', () => {
    const TestComp = defineComponent({
      setup() {
        const drawer = useDrawer()
        expect(drawer.drawerUid).toBe('test-drawer-sender')
        expect(drawer.headerPortalName).toBe('test-drawer-sender-el-drawer-header')
        expect(drawer.contentPortalName).toBe('test-drawer-sender-el-drawer-content')
        expect(drawer.footerPortalName).toBe('test-drawer-sender-el-drawer-footer')
        return () => null
      },
    })

    mount(TestComp)
  })
})

describe('useDrawer - Wormhole 集成', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('调用 openDrawer 时会通过 Wormhole.open 打开到指定 targetName', () => {
    let api!: ReturnType<typeof useDrawer>
    const Holder = defineComponent({
      setup() {
        api = useDrawer(false, 'custom-drawer-target')
        return () => null
      },
    })

    mount(Holder)

    const openSpy = vi.spyOn(Wormhole as any, 'open')

    api.openDrawer({ content: 'test' })

    expect(openSpy).toHaveBeenCalled()
    const firstCall = openSpy.mock!.calls[0]![0]! as {
      to: string
      from: string
      content: unknown
    }
    expect(firstCall.to).toBe('custom-drawer-target')
    expect(firstCall.from).toBe('test-drawer-sender')
    expect(typeof firstCall.content).toBe('function')
  })

  it('在未显式传入 targetName 时，默认使用 targetName="ell-drawer"', () => {
    const Holder = defineComponent({
      setup() {
        const drawer = useDrawer()
        ;(Holder as any).drawer = drawer
        return () => null
      },
    })

    mount(Holder)
    const drawer = (Holder as any).drawer as ReturnType<typeof useDrawer> | undefined

    const openSpy = vi.spyOn(Wormhole as any, 'open') as any

    drawer?.openDrawer({ content: 'test-content' })

    expect(openSpy).toHaveBeenCalled()
    expect(openSpy.mock!.calls[0]![0]!.to).toBe('ell-drawer')
    expect(openSpy.mock!.calls[0]![0]!.from).toBe('test-drawer-sender')
  })
})

describe('useDrawer - 默认渲染', () => {
  it('在未传入任何参数时，仅显示空抽屉主体，且可通过遮罩关闭', async () => {
    const Wrapper = defineComponent({
      setup() {
        const drawer = useDrawer(false, 'ell-drawer')
        ;(Wrapper as any).drawer = drawer

        return () => <PortalTarget name="ell-drawer" />
      },
    })

    const wrapper = mount(Wrapper)
    const drawer = (Wrapper as any).drawer as ReturnType<typeof useDrawer> | undefined

    drawer?.openDrawer()
    await nextTick()
    await nextTick()

    const elDrawerWrapper = wrapper.findComponent(ElDrawer)
    expect(elDrawerWrapper.exists()).toBe(true)
    expect(elDrawerWrapper.props('withHeader')).toBe(false)
    expect(elDrawerWrapper.props('size')).toBe(400)
    expect(elDrawerWrapper.props('closeOnClickModal')).toBe(true)
  })

  it('在传入空对象 {} 时行为与未传参一致', async () => {
    const Wrapper = defineComponent({
      setup() {
        const drawer = useDrawer(false, 'ell-drawer')
        ;(Wrapper as any).drawer = drawer

        return () => <PortalTarget name="ell-drawer" />
      },
    })

    const wrapper = mount(Wrapper)
    const drawer = (Wrapper as any).drawer as ReturnType<typeof useDrawer> | undefined

    drawer?.openDrawer({})
    await nextTick()
    await nextTick()

    const elDrawerWrapper = wrapper.findComponent(ElDrawer)
    expect(elDrawerWrapper.exists()).toBe(true)
    expect(elDrawerWrapper.props('withHeader')).toBe(false)
    expect(elDrawerWrapper.props('size')).toBe(400)
    expect(elDrawerWrapper.props('closeOnClickModal')).toBe(true)
  })

  it('默认按钮标签为「取消」「确定」', async () => {
    const Wrapper = defineComponent({
      setup() {
        const drawer = useDrawer(false, 'ell-drawer')
        ;(Wrapper as any).drawer = drawer

        return () => <PortalTarget name="ell-drawer" />
      },
    })

    const wrapper = mount(Wrapper)
    const drawer = (Wrapper as any).drawer as ReturnType<typeof useDrawer> | undefined

    drawer?.openDrawer()
    await nextTick()
    await nextTick()

    const buttons = wrapper.findAllComponents(ElButton)
    const texts = buttons.map((btn) => btn.text())

    expect(texts).toContain('取消')
    expect(texts).toContain('确定')
  })
})

describe('useDrawer - variant 与 headerConfig', () => {
  it('variant 为 default 时显示头部，默认标题为「编辑」', async () => {
    const Wrapper = defineComponent({
      setup() {
        const drawer = useDrawer(false, 'ell-drawer')
        ;(Wrapper as any).drawer = drawer
        return () => <PortalTarget name="ell-drawer" />
      },
    })

    const wrapper = mount(Wrapper)
    const drawer = (Wrapper as any).drawer as ReturnType<typeof useDrawer> | undefined

    drawer?.openDrawer({ variant: 'default', content: '内容' })
    await nextTick()
    await nextTick()

    const elDrawerWrapper = wrapper.findComponent(ElDrawer)
    expect(elDrawerWrapper.exists()).toBe(true)
    expect(elDrawerWrapper.props('withHeader')).toBe(true)
    expect(elDrawerWrapper.props('title')).toBe('编辑')
  })

  it('variant 为 simple 时 closeOnPressEscape 为 false', async () => {
    const Wrapper = defineComponent({
      setup() {
        const drawer = useDrawer(false, 'ell-drawer')
        ;(Wrapper as any).drawer = drawer
        return () => <PortalTarget name="ell-drawer" />
      },
    })

    const wrapper = mount(Wrapper)
    const drawer = (Wrapper as any).drawer as ReturnType<typeof useDrawer> | undefined

    drawer?.openDrawer({ variant: 'simple', title: '标题', content: '内容' })
    await nextTick()
    await nextTick()

    const elDrawerWrapper = wrapper.findComponent(ElDrawer)
    expect(elDrawerWrapper.props('closeOnPressEscape')).toBe(false)
  })

  it('headerConfig.closeable 为 false 时 showClose 为 false', async () => {
    const Wrapper = defineComponent({
      setup() {
        const drawer = useDrawer(false, 'ell-drawer')
        ;(Wrapper as any).drawer = drawer
        return () => <PortalTarget name="ell-drawer" />
      },
    })

    const wrapper = mount(Wrapper)
    const drawer = (Wrapper as any).drawer as ReturnType<typeof useDrawer> | undefined

    drawer?.openDrawer({
      title: '标题',
      content: '内容',
      headerConfig: { closeable: false },
    })
    await nextTick()
    await nextTick()

    const elDrawerWrapper = wrapper.findComponent(ElDrawer)
    expect(elDrawerWrapper.props('showClose')).toBe(false)
  })

  // headerConfig.closePlacement 的样式类（ell-drawer-close-left）因 ElDrawer 使用 appendToBody
  // 渲染在 body，当前 wrapper 内无法断言；由文档示例「关闭按钮与操作按钮位置演示」覆盖
})


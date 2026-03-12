import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { useDialog } from '../src/use-dialog'

vi.mock('ulid', () => ({
  ulid: () => 'test-sender',
}))

vi.mock('portal-vue')

import { PortalTarget, Wormhole } from 'portal-vue'
import { ElButton, ElDialog } from 'element-plus'

describe('useDialog - 基础返回值', () => {
  it('返回的 portal 名称基于 ulid 生成，前缀为 sender+', () => {
    const TestComp = defineComponent({
      setup() {
        const dialog = useDialog()
        expect(dialog.dialogUid).toBe('test-sender')
        expect(dialog.headerPortalName).toBe('test-sender-el-dialog-header')
        expect(dialog.contentPortalName).toBe('test-sender-el-dialog-content')
        expect(dialog.footerPortalName).toBe('test-sender-el-dialog-footer')
        return () => null
      },
    })

    mount(TestComp)
  })
})

describe('useDialog - Wormhole 集成', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

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

  it('在 keepInstance=false 时，默认使用 targetName="ell-dialog"', () => {
    const Holder = defineComponent({
      setup() {
        const dialog = useDialog()
        ;(Holder as any).dialog = dialog
        return () => null
      },
    })

    mount(Holder)
    const dialog = (Holder as any).dialog as ReturnType<typeof useDialog> | undefined

    const openSpy = vi.spyOn(Wormhole as any, 'open') as any

    // dialog 在正常情况下会被赋值，这里为了通过 TS 严格检查做一次防御
    dialog?.openDialog({ content: 'test-content' })

    expect(openSpy).toHaveBeenCalled()
    expect(openSpy.mock!.calls[0]![0]!.to).toBe('ell-dialog')
    expect(openSpy.mock!.calls[0]![0]!.from).toBe('test-sender')
  })
})

describe('useDialog - 默认渲染', () => {
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
})

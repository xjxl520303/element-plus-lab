import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('ulid', () => ({ ulid: () => 'test-uid' }))
vi.mock('portal-vue')

import ElSimplePageHeader from '../src/index.vue'

describe('ElSimplePageHeader', () => {
  it('未提供 title 时显示选项卡，点击返回触发 back', async () => {
    const wrapper = mount(ElSimplePageHeader, {
      props: {},
      global: { stubs: { ElIcon: true, PortalTarget: true, Portal: true } },
    })
    const backBtn = wrapper.find('button[aria-label="返回"]')
    await backBtn.trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it('backText 显示为传入值', () => {
    const wrapper = mount(ElSimplePageHeader, {
      props: { backText: '取消' },
      global: { stubs: { ElIcon: true, PortalTarget: true, Portal: true } },
    })
    expect(wrapper.find('button[aria-label="返回"]').text()).toContain('取消')
  })

  it('提供 title 时显示标题不显示选项卡', () => {
    const wrapper = mount(ElSimplePageHeader, {
      props: { title: '页面标题' },
      global: { stubs: { ElIcon: true, PortalTarget: true, Portal: true } },
    })
    expect(wrapper.text()).toContain('页面标题')
    expect(wrapper.find('[role="tablist"]').exists()).toBe(false)
  })

  it('切换选项卡时触发 tabChange', async () => {
    const wrapper = mount(ElSimplePageHeader, {
      props: { tabConfig: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] },
      global: { stubs: { ElIcon: true, PortalTarget: true, Portal: true } },
    })
    const tabs = wrapper.findAll('button[role="tab"]')
    await tabs[1]!.trigger('click')
    expect(wrapper.emitted('tabChange')).toEqual([['b']])
  })

  it('beforeChange 抛出错误时触发 tabChangeError', async () => {
    const wrapper = mount(ElSimplePageHeader, {
      props: {
        tabConfig: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }],
        beforeChange: () => Promise.reject(new Error('test error')),
      },
      global: { stubs: { ElIcon: true, PortalTarget: true, Portal: true } },
    })
    const tabs = wrapper.findAll('button[role="tab"]')
    await tabs[1]!.trigger('click')
    expect(wrapper.emitted('tabChangeError')).toHaveLength(1)
    expect((wrapper.emitted('tabChangeError')![0]![0] as Error).message).toBe('test error')
  })
})

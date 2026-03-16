import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ElFormGroup from '../src/index.vue'

describe('ElFormGroup', () => {
  it('默认不折叠，内容区可见', () => {
    const wrapper = mount(ElFormGroup, {
      props: { title: '测试分组' },
      slots: { default: '<div class="content">内容</div>' },
    })
    expect(wrapper.find('.expand').exists()).toBe(true)
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('defaultFolded 为 true 时初始折叠', () => {
    const wrapper = mount(ElFormGroup, {
      props: { title: '测试', defaultFolded: true },
      slots: { default: '<div class="content">内容</div>' },
    })
    expect(wrapper.find('.expand').exists()).toBe(false)
  })

  it('点击折叠按钮可切换展开/折叠', async () => {
    const wrapper = mount(ElFormGroup, {
      props: { title: '测试' },
      slots: { default: '<div class="content">内容</div>' },
    })
    const btn = wrapper.find('button[aria-controls]')
    expect(btn.attributes('aria-expanded')).toBe('true')
    await btn.trigger('click')
    expect(wrapper.find('.expand').exists()).toBe(false)
    expect(btn.attributes('aria-expanded')).toBe('false')
    await btn.trigger('click')
    expect(wrapper.find('.expand').exists()).toBe(true)
  })

  it('v-model:folded 受控时，点击会 emit update:folded', async () => {
    const wrapper = mount(ElFormGroup, {
      props: { title: '测试', folded: false },
      slots: { default: '<div>内容</div>' },
    })
    await wrapper.find('button[aria-controls]').trigger('click')
    expect(wrapper.emitted('update:folded')).toEqual([[true]])
  })

  it('beforeExpand 返回 false 时阻止展开', async () => {
    const wrapper = mount(ElFormGroup, {
      props: {
        title: '测试',
        defaultFolded: true,
        beforeExpand: () => false,
      },
      slots: { default: '<div class="content">内容</div>' },
    })
    await wrapper.find('button[aria-controls]').trigger('click')
    expect(wrapper.find('.expand').exists()).toBe(false)
  })

  it('beforeCollapse 返回 false 时阻止折叠', async () => {
    const wrapper = mount(ElFormGroup, {
      props: {
        title: '测试',
        beforeCollapse: () => false,
      },
      slots: { default: '<div class="content">内容</div>' },
    })
    await wrapper.find('button[aria-controls]').trigger('click')
    expect(wrapper.find('.expand').exists()).toBe(true)
  })

  it('展开时调用 afterExpand，折叠时调用 afterCollapse', async () => {
    const afterExpand = vi.fn()
    const afterCollapse = vi.fn()
    const wrapper = mount(ElFormGroup, {
      props: {
        title: '测试',
        afterExpand,
        afterCollapse,
      },
      slots: { default: '<div>内容</div>' },
    })
    await wrapper.find('button[aria-controls]').trigger('click')
    expect(afterCollapse).toHaveBeenCalledTimes(1)
    await wrapper.find('button[aria-controls]').trigger('click')
    expect(afterExpand).toHaveBeenCalledTimes(1)
  })
})

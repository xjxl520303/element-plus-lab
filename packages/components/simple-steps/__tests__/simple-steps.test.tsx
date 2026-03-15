import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ElSimpleSteps from '../src/index.vue'

const defaultOptions = [
  { label: '步骤一', value: 1 },
  { label: '步骤二', value: 2 },
  { label: '步骤三', value: 3 },
]

describe('ElSimpleSteps', () => {
  it('默认 v-model 为 1 时，第一步为 process 状态', () => {
    const wrapper = mount(ElSimpleSteps, {
      props: { options: defaultOptions },
      global: { stubs: { ElDivider: true, ElIcon: true } },
    })
    const firstStep = wrapper.findAll('[role="listitem"]')[0]
    expect(firstStep?.attributes('aria-current')).toBe('step')
    expect(firstStep?.element.innerHTML).toContain('1') // 未完成显示数字
  })

  it('v-model 为 2 时，第一步为 finish、第二步为 process', async () => {
    const wrapper = mount(ElSimpleSteps, {
      props: { options: defaultOptions, modelValue: 2 },
      global: { stubs: { ElDivider: true, ElIcon: true } },
    })
    await wrapper.vm.$nextTick()
    const items = wrapper.findAll('[role="listitem"]')
    expect(items[0]?.attributes('aria-current')).toBeUndefined()
    expect(items[1]?.attributes('aria-current')).toBe('step')
  })

  it('setStep 更新后 v-model 同步', async () => {
    const wrapper = mount(ElSimpleSteps, {
      props: { options: defaultOptions, modelValue: 1 },
      global: { stubs: { ElDivider: true, ElIcon: true } },
    })
    const vm = wrapper.vm as InstanceType<typeof ElSimpleSteps> & { setStep: (n: number) => void }
    vm.setStep(3)
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('不传入 options 时渲染空列表', () => {
    const wrapper = mount(ElSimpleSteps, {
      props: { options: [] },
      global: { stubs: { ElDivider: true } },
    })
    expect(wrapper.findAll('[role="listitem"]')).toHaveLength(0)
  })
})

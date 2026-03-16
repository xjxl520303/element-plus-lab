<script setup lang="ts">
import type { EllSimpleStepsProps } from './types'
import { Select } from '@element-plus/icons-vue'

defineOptions({
  name: 'ElSimpleSteps',
})

const { space = 16, ...props } = defineProps<EllSimpleStepsProps>()
const model = defineModel<number>({ type: Number, default: 1 })

/** 根据当前步骤推导每步的展示状态，不修改 props.options */
function stepStatus(optionValue: number): 'finish' | 'process' | 'wait' {
  const current = model.value ?? 1
  if (current > optionValue)
    return 'finish'
  if (current === optionValue)
    return 'process'
  return 'wait'
}

function setStep(step: number) {
  if (step < 0 || step > props.options.length + 1)
    return
  model.value = step
}

defineExpose<{
  /** 设置当前步骤 */
  setStep(step: number): void
}>({
  setStep,
})
</script>

<template>
  <div
    class="mx-auto my-0 flex w-fit items-center justify-between"
    role="list"
    aria-label="步骤条"
  >
    <template v-for="(option, index) in props.options" :key="option.value">
      <div
        class="inline-flex items-center leading-6"
        role="listitem"
        :aria-current="(model ?? 1) === option.value ? 'step' : undefined"
      >
        <div
          class="inline-flex h-6 w-6 select-none items-center justify-center divide-x-[1px] divide-y-[1px] rounded-[4px]"
          :class="{
            'bg-[var(--el-color-primary)] text-[var(--el-color-white)]':
              stepStatus(option.value) === 'process',
            'bg-[var(--el-color-success)] text-[var(--el-color-white)]':
              stepStatus(option.value) === 'finish',
            'bg-[var(--el-color-info)] text-[var(--el-color-white)]':
              stepStatus(option.value) === 'wait',
          }"
        >
          <template v-if="stepStatus(option.value) === 'finish'">
            <el-icon class="text-white">
              <Select />
            </el-icon>
          </template>
          <template v-else>
            {{ index + 1 }}
          </template>
        </div>
        <div
          class="ml-3 min-w-max text-[16px] font-bold text-[var(--el-text-color-primary)]"
        >
          {{ option.label }}
        </div>
      </div>
      <template v-if="index >= 0 && index < props.options.length - 1">
        <el-divider :style="{ minWidth: `${space}px` }" />
      </template>
    </template>
  </div>
</template>

<style scoped>
.el-divider--horizontal {
  margin: 0 12px;
  flex: 1;
}
</style>

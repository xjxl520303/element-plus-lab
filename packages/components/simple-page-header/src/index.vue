<script setup lang="ts">
import type { VNodeChild } from 'vue'
import type { EllSimplePageHeaderProps } from './types'
import { ArrowLeft } from '@element-plus/icons-vue'
import { Portal, PortalTarget } from 'portal-vue'
import { ulid } from 'ulid'
import { computed, ref, useSlots } from 'vue'

defineOptions({
  name: 'ElSimplePageHeader',
})

const props = withDefaults(defineProps<EllSimplePageHeaderProps>(), {
  backText: '返回',
})
const emit = defineEmits<{
  /** 标签页改变 */
  (e: 'tabChange', value: string): void
  /** 返回按钮点击 */
  (e: 'back'): void
  /** 选项卡切换时 beforeChange 抛出错误 */
  (e: 'tabChangeError', error: unknown): void
}>()
const slots = useSlots()
const uid = ulid()
const activeTab = ref(props.defaultTab || props.tabConfig?.[0]?.value || '0')

const tabConfig = computed(() => {
  return (
    props.tabConfig || [
      { label: props.firstTabLabel || '申请信息', value: '0' },
      { label: '流程图', value: '1' },
    ]
  )
})

function handleBack() {
  emit('back')
}

async function handleTabClick(value: string) {
  try {
    let canChange = true
    if (props.beforeChange) {
      canChange = await props.beforeChange(value)
    }

    if (canChange) {
      activeTab.value = value
      emit('tabChange', value)

      if (props.afterChange) {
        const result = props.afterChange(value)
        if (result && typeof result.then === 'function') {
          await result
        }
      }
    }
  }
  catch (err) {
    emit('tabChangeError', err)
  }
}

function VNode(props: { content: string | VNodeChild }): VNodeChild {
  return props.content
}
</script>

<template>
  <div class="flex h-10 w-full items-center justify-between">
    <div class="flex">
      <template v-if="slots.back">
        <div
          class="flex cursor-pointer items-center text-[var(--el-color-primary)]"
          @click="handleBack"
        >
          <slot name="back" />
        </div>
      </template>
      <template v-else>
        <button
          type="button"
          class="flex cursor-pointer items-center border-0 bg-transparent p-0 text-[var(--el-color-primary)]"
          aria-label="返回"
          @click="handleBack"
        >
          <el-icon class="h-4 w-4">
            <ArrowLeft />
          </el-icon>
          <span class="ml-[6px] font-bold">{{ props.backText }}</span>
        </button>
      </template>

      <template v-if="props.title">
        <div class="flex items-center">
          <span
            class="mx-[6px] inline-block h-[14px] w-[1px] bg-[var(--el-border-color)]"
          />
          <span class="font-bold">{{ props.title }}</span>
        </div>
      </template>

      <template v-else>
        <div
          role="tablist"
          aria-label="选项卡"
          class="flex h-10 items-center px-[6px] leading-10 text-[var(--el-text-color-regular)]"
        >
          <template v-for="tab in tabConfig" :key="tab.value">
            <button
              type="button"
              role="tab"
              class="relative h-full cursor-pointer border-0 bg-transparent px-[6px]"
              :class="{ 'active-tab': activeTab === tab.value }"
              :aria-selected="activeTab === tab.value"
              :aria-current="activeTab === tab.value ? 'page' : undefined"
              @click="() => handleTabClick(tab.value)"
            >
              {{ tab.label }}
            </button>
          </template>
        </div>
      </template>
    </div>

    <div class="flex flex-1 justify-end overflow-hidden">
      <template v-if="!slots.title">
        <PortalTarget :name="`${uid}-${activeTab}-extra`" multiple />
      </template>

      <template v-else>
        <slot name="extra" />
      </template>
    </div>
  </div>

  <div v-if="slots.extra">
    <Portal :to="`${uid}-${activeTab}-extra`" :order="5">
      <VNode :content="slots.extra()" />
    </Portal>
  </div>

  <slot :uid="uid" />
</template>

<style scoped>
.active-tab {
  color: var(--el-color-primary);
  font-weight: bold;
}
.active-tab:hover {
  color: var(--el-color-primary-light-3);
}
.active-tab:hover::after {
  background-color: var(--el-color-primary-light-3);
}
.active-tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 23%;
  width: 54%;
  height: 2px;
  border-radius: 3px;
  background-color: var(--el-color-primary);
}
</style>

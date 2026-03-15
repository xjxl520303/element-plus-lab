<script setup lang="ts">
import type { EllFormGroupProps } from './types'
import { computed, ref } from 'vue'

defineOptions({
  name: 'ElFormGroup',
})

const props = withDefaults(defineProps<EllFormGroupProps>(), {
  defaultFolded: false,
  animated: false,
})

const foldedModel = defineModel<boolean>('folded', { type: Boolean, default: undefined })
const internalFolded = ref(props.defaultFolded)

const isFold = computed({
  get() {
    return foldedModel.value !== undefined ? foldedModel.value : internalFolded.value
  },
  set(v: boolean) {
    if (foldedModel.value !== undefined)
      foldedModel.value = v
    else
      internalFolded.value = v
  },
})

async function toggle() {
  const nextFolded = !isFold.value

  if (nextFolded) {
    const allow = props.beforeCollapse ? await resolveAllow(props.beforeCollapse()) : true
    if (!allow) return
    isFold.value = true
    props.afterCollapse?.()
  }
  else {
    const allow = props.beforeExpand ? await resolveAllow(props.beforeExpand()) : true
    if (!allow) return
    isFold.value = false
    props.afterExpand?.()
  }
}

function resolveAllow(result: boolean | Promise<boolean | void>): Promise<boolean> {
  return Promise.resolve(result).then(v => v !== false)
}

const contentId = `ell-form-group-${Math.random().toString(36).slice(2, 9)}`
</script>

<template>
  <div class="ell-form-group" :class="{ 'mb-4': isFold }">
    <div class="header flex h-10 w-full items-center px-2">
      <button
        type="button"
        class="flex h-8 w-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
        :aria-expanded="!isFold"
        :aria-controls="contentId"
        :title="isFold ? '展开' : '折叠'"
        @click="toggle"
      >
        <div
          class="flex h-3 w-3 items-center justify-center text-[var(--el-text-color-regular)] hover:text-[var(--el-color-primary)]"
        >
          <!-- 折叠状态：显示 + 号 -->
          <svg
            v-if="isFold"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="14"
              rx="2"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
            <line
              x1="5"
              y1="8"
              x2="11"
              y2="8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <line
              x1="8"
              y1="5"
              x2="8"
              y2="11"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <!-- 展开状态：显示 - 号 -->
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="14"
              rx="2"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
            />
            <line
              x1="5"
              y1="8"
              x2="11"
              y2="8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </button>
      <div
        class="shrink-0 font-bold text-[var(--el-text-color-primary)]"
        :id="`${contentId}-label`"
      >
        {{ title }}
      </div>
      <slot name="desc">
        <div
          class="ml-3 truncate text-xs text-[var(--el-text-color-regular)]"
          :title="description"
        >
          {{ description }}
        </div>
      </slot>
      <div class="flex-1">
        <div class="flex items-center justify-end">
          <slot name="extra" />
        </div>
      </div>
    </div>
    <Transition
      v-if="animated"
      name="ell-form-group-expand"
    >
      <div
        v-show="!isFold"
        :id="contentId"
        class="expand"
        role="region"
        :aria-labelledby="`${contentId}-label`"
      >
        <slot />
      </div>
    </Transition>
    <template v-else>
      <div
        v-if="!isFold"
        :id="contentId"
        class="expand"
        role="region"
        :aria-labelledby="`${contentId}-label`"
      >
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>
.ell-form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-radius: 4px;
}
.ell-form-group > .header {
  background-color: var(--el-bg-color-page);
  background-image: linear-gradient(
    270deg,
    var(--el-fill-color-lighter) 0%,
    var(--el-bg-color-page) 100%
  );
}
.expand {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  padding: 12px 8px;
}
/* 折叠动画 */
.ell-form-group-expand-enter-active,
.ell-form-group-expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.ell-form-group-expand-enter-from,
.ell-form-group-expand-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElFormGroup } from 'element-plus-lab'

const loading = ref(false)
const loaded = ref(false)
const items = ref<string[]>([])

async function onAfterExpand() {
  if (loaded.value) return
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1200))
    items.value = ['项目 A', '项目 B', '项目 C']
    loaded.value = true
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <ElFormGroup
    title="异步加载内容"
    description="展开后通过 afterExpand 拉取数据并显示加载状态"
    :default-folded="true"
    :after-expand="onAfterExpand"
  >
    <div v-if="loading" class="flex items-center gap-2 py-2 text-[var(--el-text-color-secondary)]">
      <el-icon class="animate-spin" :size="18">
        <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="currentColor"
            d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.248L692.992 376.32a32 32 0 0 1-45.248-45.248L783.552 195.2a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.744-135.744a32 32 0 0 1 45.248 0z"
          />
        </svg>
      </el-icon>
      <span>加载中...</span>
    </div>
    <ul v-else-if="items.length" class="list-inside list-disc text-sm text-[var(--el-text-color-regular)]">
      <li v-for="(item, i) in items" :key="i">{{ item }}</li>
    </ul>
    <p v-else class="py-2 text-sm text-[var(--el-text-color-secondary)]">
      点击展开后将通过 afterExpand 异步加载内容
    </p>
  </ElFormGroup>
</template>

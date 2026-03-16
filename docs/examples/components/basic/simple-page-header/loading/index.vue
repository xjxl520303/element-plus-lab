<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import { ElSimplePageHeader } from 'element-plus-lab'
import { ref } from 'vue'

const loadingInstance = ref<{ close: () => void } | undefined>()

async function openLoading() {
  loadingInstance.value = ElLoading.service({
    text: '选项卡切换中...',
  }) as unknown as { close: () => void }
  await new Promise(resolve => setTimeout(resolve, 2000))
  return true
}

function closeLoading() {
  loadingInstance.value?.close()
}
</script>

<template>
  <ElSimplePageHeader
    :before-change="openLoading"
    :after-change="closeLoading"
  >
    <template #extra>
      <el-button type="default" size="small">
        保存
      </el-button>
      <el-button type="primary" size="small">
        提交
      </el-button>
    </template>
  </ElSimplePageHeader>
</template>

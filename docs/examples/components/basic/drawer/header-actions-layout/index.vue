<script lang="tsx" setup>
import { ElMessage } from 'element-plus'
import { useDrawer } from 'element-plus-lab'

const { openDrawer } = useDrawer()

const content = '可通过下方不同按钮体验：关闭按钮在左/右侧、操作按钮在头部或底部。'

/** 关闭按钮在右侧（默认），操作按钮在底部（默认） */
async function openCloseRightActionsBottom() {
  try {
    await openDrawer({
      title: '关闭在右、操作在底部',
      headerConfig: { closePlacement: 'right' },
      actionConfig: { placement: 'bottom' },
      content,
    })
    ElMessage.success('已确认')
  }
  catch {
    ElMessage.info('已取消')
  }
}

/** 关闭按钮在左侧，操作按钮在底部 */
async function openCloseLeftActionsBottom() {
  try {
    await openDrawer({
      title: '关闭在左、操作在底部',
      headerConfig: { closePlacement: 'left' },
      actionConfig: { placement: 'bottom' },
      content,
    })
    ElMessage.success('已确认')
  }
  catch {
    ElMessage.info('已取消')
  }
}

/** 关闭按钮在右侧，操作按钮在头部 */
async function openCloseRightActionsTop() {
  try {
    await openDrawer({
      title: '关闭在右、操作在头部',
      headerConfig: { closePlacement: 'right' },
      actionConfig: { placement: 'top' },
      content,
    })
    ElMessage.success('已确认')
  }
  catch {
    ElMessage.info('已取消')
  }
}

/** 关闭按钮在左侧，操作按钮在头部 */
async function openCloseLeftActionsTop() {
  try {
    await openDrawer({
      title: '关闭在左、操作在头部',
      headerConfig: { closePlacement: 'left' },
      actionConfig: { placement: 'top' },
      content,
    })
    ElMessage.success('已确认')
  }
  catch {
    ElMessage.info('已取消')
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <ElButton type="primary" @click="openCloseRightActionsBottom">
      关闭在右、操作在底部（默认）
    </ElButton>
    <ElButton @click="openCloseLeftActionsBottom">
      关闭在左、操作在底部
    </ElButton>
    <ElButton @click="openCloseRightActionsTop">
      关闭在右、操作在头部
    </ElButton>
    <ElButton @click="openCloseLeftActionsTop">
      关闭在左、操作在头部
    </ElButton>
  </div>
</template>

<script lang="ts" setup>
import type { EllOverlayResult } from 'element-plus-lab'
import { ElButton, ElMessage } from 'element-plus'
import { useDrawer } from 'element-plus-lab'

import Count from './count.vue'

// 不保持实例（默认）：每次关闭抽屉时，ElDrawer 组件会被销毁
const { openDrawer: openWithDestroy, contentPortalName: contentPortalName1 }
  = useDrawer(false)

// 保持实例：ElDrawer 组件不会被销毁，只是隐藏，再次打开时复用同一个实例
const { openDrawer: openWithKeep, contentPortalName: contentPortalName2 }
  = useDrawer(true, 'ell-drawer-keep')

// 打开会销毁实例的抽屉
async function handleOpenWithDestroy() {
  try {
    const result = await openWithDestroy({
      title: '编辑用户（销毁实例）',
      size: 500,
    })
    if (result?.reason === 'ok') {
      ElMessage.success('保存成功！')
    }
  }
  catch (error) {
    const result = error as unknown as EllOverlayResult
    if (result?.reason === 'cancel') {
      ElMessage.info('已取消')
    }
  }
}

// 打开保持实例的抽屉
async function handleOpenWithKeep() {
  try {
    const result = await openWithKeep({
      title: '编辑用户（保持实例）',
      size: 500,
    })
    if (result?.reason === 'ok') {
      ElMessage.success('保存成功！')
    }
  }
  catch (error) {
    const result = error as unknown as EllOverlayResult
    if (result?.reason === 'cancel') {
      ElMessage.info('已取消')
    }
  }
}
</script>

<template>
  <div style="display: flex; gap: 12px">
    <ElButton @click="handleOpenWithDestroy">
      打开抽屉（销毁实例）
    </ElButton>
    <ElButton @click="handleOpenWithKeep">
      打开抽屉（保持实例）
    </ElButton>
  </div>

  <portal-target name="ell-drawer-keep" multiple />

  <!-- 销毁实例的抽屉内容 -->
  <portal :to="contentPortalName1" name="content">
    <Count />
  </portal>

  <!-- 保持实例的抽屉内容 -->
  <portal :to="contentPortalName2" name="content">
    <Count />
  </portal>
</template>

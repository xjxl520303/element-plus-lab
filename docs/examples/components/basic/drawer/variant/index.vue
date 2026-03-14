<script lang="tsx" setup>
import { ElMessage } from 'element-plus'
import { useDrawer } from 'element-plus-lab'

const { openDrawer } = useDrawer()

/** default：标题 + 关闭 + 内容 + 取消/确定按钮 */
async function openDefault() {
  try {
    await openDrawer({
      variant: 'default',
      title: '默认变体',
      content: '带标题、关闭按钮、主体内容和底部取消/确定按钮。',
    })
    ElMessage.success('已确认')
  }
  catch {
    ElMessage.info('已取消')
  }
}

/** blank：仅内容区，无标题无关闭按钮，点击遮罩或 Esc 关闭 */
async function openBlank() {
  try {
    await openDrawer({
      variant: 'blank',
      content: '仅内容区，无标题无关闭按钮。点击遮罩或按 Esc 可关闭。',
    })
    ElMessage.success('已关闭')
  }
  catch {
    ElMessage.info('已取消')
  }
}

/** simple：标题 + 关闭，无底部内容，仅能通过关闭按钮关闭 */
async function openSimple() {
  try {
    await openDrawer({
      variant: 'simple',
      title: '简洁变体',
      content: '带标题和关闭按钮，无底部操作区。仅展示主体内容，关闭请点击右上角关闭按钮。',
    })
    ElMessage.success('已关闭')
  }
  catch {
    ElMessage.info('已取消')
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <ElButton type="primary" @click="openDefault">
      default（标题+内容+底部按钮）
    </ElButton>
    <ElButton @click="openBlank">
      blank（仅内容，遮罩/Esc 关闭）
    </ElButton>
    <ElButton @click="openSimple">
      simple（标题+关闭，无底部）
    </ElButton>
  </div>
</template>

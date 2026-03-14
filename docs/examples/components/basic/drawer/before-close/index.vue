<script lang="tsx" setup>
import { ElButton, ElMessage } from 'element-plus'
import { useDrawer } from 'element-plus-lab'
import { ref } from 'vue'

const { openDrawer } = useDrawer()
const { openDrawer: openDrawer2 } = useDrawer()

const count = ref(0)

async function openWithCountCheck() {
  try {
    await openDrawer({
      title: 'beforeClose 示例（数量判断）',
      render: () => (
        <div>
          <div class="mb-2">
            数量超过 3 时，点击关闭按钮/遮罩/ESC 会阻止关闭并提示：
            <strong>{count.value}</strong>
          </div>
          <div class="flex gap-2">
            <ElButton onClick={() => count.value++}>增加</ElButton>
            <ElButton onClick={() => count.value--}>减少</ElButton>
          </div>
        </div>
      ),
      beforeClose: (resolve) => {
        if (count.value >= 3) {
          ElMessage.warning('阻止关闭，数量不能超过 3')
          return false
        }
        resolve({ reason: 'ok' })
      },
    })
  }
  catch {
    // 用户取消
  }
}

async function openWithNestedDrawer() {
  try {
    await openDrawer({
      title: 'beforeClose 示例（嵌套确认）',
      content: '点击关闭时将先弹出二次确认抽屉。',
      beforeClose: async (resolve, reject) => {
        try {
          await openDrawer2({
            title: '确认关闭？',
            content: '确定要关闭当前抽屉吗？',
          })
          resolve({ reason: 'ok' })
        }
        catch {
          reject({ reason: 'cancel' })
        }
      },
    })
  }
  catch {
    // 用户取消
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <ElButton type="primary" @click="openWithCountCheck">
      打开（数量超过 3 阻止关闭）
    </ElButton>
    <ElButton @click="openWithNestedDrawer">
      打开（嵌套 beforeClose 拦截）
    </ElButton>
  </div>
</template>

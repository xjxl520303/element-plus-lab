<script lang="ts" setup>
import type { EllOverlayResult } from 'element-plus-lab'
import { ElMessage } from 'element-plus'
import { useDialog } from 'element-plus-lab'

const { openDialog } = useDialog()

async function openWithAsyncAwait() {
  try {
    await openDialog({ content: '确定要执行此操作吗？' })
    ElMessage.success('已确认')
  }
  catch (error: unknown) {
    // 明确 error 是 EllOverlayResult 类型
    const result = error as unknown as EllOverlayResult
    console.error(result)
    if (result.reason === 'cancel') {
      ElMessage.info('已取消')
    }
    else if (result.reason === 'close') {
      ElMessage.info('关闭对话框')
    }
    else {
      ElMessage.info('其他原因关闭对话框')
    }
  }
}

function openWithPromise() {
  openDialog({ content: '确定要执行此操作吗？' })
    .then(() => {
      ElMessage.success('已确认')
    })
    .catch((error) => {
      // 这里参考上面的 async/await 方式来处理错误，不再赘述
      console.error(error)
      ElMessage.info('已取消')
    })
}
</script>

<template>
  <div>
    <el-button @click="openWithAsyncAwait">
      async/await 打开
    </el-button>
    <el-button @click="openWithPromise">
      Promise 打开
    </el-button>
  </div>
</template>

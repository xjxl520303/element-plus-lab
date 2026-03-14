<script lang="tsx" setup>
import { useDrawer } from 'element-plus-lab'

const { openDrawer: open1 } = useDrawer()
const { openDrawer: open2, contentPortalName } = useDrawer()
const { openDrawer: open3 } = useDrawer()

async function openWithContent() {
  try {
    await open1({
      title: '设置 content',
      content: '抽屉主体内容',
    })
  }
  catch {
    // 用户取消
  }
}

async function openWithPortal() {
  try {
    await open2({ title: '通过 Portal 设置内容' })
  }
  catch {
    // 用户取消
  }
}

async function openWithRender() {
  try {
    await open3({
      title: '通过 render',
      render: () => '抽屉主体内容',
    })
  }
  catch {
    // 用户取消
  }
}
</script>

<template>
  <div>
    <ElButton type="primary" @click="openWithContent">
      设置 content 属性
    </ElButton>
    <ElButton style="margin-left: 10px" @click="openWithPortal">
      通过 Portal 设置内容
    </ElButton>
    <ElButton style="margin-left: 10px" @click="openWithRender">
      通过渲染函数设置内容
    </ElButton>
    <!-- 该 portal 为 open2 提供主体内容，点击「通过 Portal 设置内容」时显示 -->
    <portal :to="contentPortalName" name="content">
      <div>通过 Portal 传入的抽屉主体内容</div>
    </portal>
  </div>
</template>

<script setup lang="ts">
import { useBusDialog } from 'element-plus-lab'
import HelloWorld from '@/components/hello-world.vine'
import { PortalTarget } from 'portal-vue'

const dialog = useBusDialog()

async function openTestDialog() {
  const result = await dialog.openDialog({
    title: '测试对话框',
    content: '这是从 element-plus-lab 引入的 useBusDialog 打开的对话框。',
    actions: ['cancel', 'ok'],
    okText: '确定',
    cancelText: '取消',
  })
  console.log('对话框关闭:', result)
  if (result?.reason === 'ok') {
    alert('你点击了确定')
  } else if (result?.reason === 'cancel') {
    alert('你点击了取消')
  }
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo">
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo">
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <!-- portal-vue 目标，供 useBusDialog 渲染对话框 -->
  <PortalTarget name="bus-dialog" />
  <button
    type="button"
    class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    @click="openTestDialog"
  >
    打开对话框
  </button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

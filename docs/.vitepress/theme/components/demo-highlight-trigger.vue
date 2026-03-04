<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { observeAndHighlight } from '../demo-highlight';

let disconnect: (() => void) | undefined;

onMounted(() => {
  // 监听 DOM 变化（含首次展开 demo、路由切换后新内容），对 demo 源码块做 Shiki 高亮
  disconnect = observeAndHighlight(document.body);
});
onUnmounted(() => {
  disconnect?.();
});
</script>

<template>
  <span style="display: none" />
</template>

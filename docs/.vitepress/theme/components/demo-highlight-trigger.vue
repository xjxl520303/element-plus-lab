<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { observeAndHighlight } from '../demo-highlight'

/** @type {(() => void) | undefined} */
let disconnect

onMounted(() => {
  disconnect = observeAndHighlight(document.body)
})
onUnmounted(() => {
  disconnect?.()
})
</script>

<template>
  <span style="display: none" />
</template>

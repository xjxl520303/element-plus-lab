<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import IconAccessibility from '~icons/carbon/accessibility'
import IconAccountBox from '~icons/mdi/account-box'
import IconAudioTapeFill from '~icons/mingcute/audio-tape-fill'

function handleClick() {
  console.warn('test turbo console')
}
</script>

<template>
  <div>
    <h1 class="px-4 bg-amber-400">
      Demo
    </h1>
    <el-button type="primary" @click="handleClick">
      primary
    </el-button>
    <el-icon><Search /></el-icon>
    <IconAccessibility />
    <IconAccountBox style="font-size: 2em; color: red" />
    <IconAudioTapeFill />
  </div>
</template>

<style scoped>
</style>

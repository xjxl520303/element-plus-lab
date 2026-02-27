<script lang="ts" setup>
import { Search } from "@element-plus/icons-vue";
import IconAccessibility from '~icons/carbon/accessibility'
import IconAccountBox from '~icons/mdi/account-box'
import IconAudioTapeFill from '~icons/mingcute/audio-tape-fill'

const handleClick = () => {
  console.log('test turbo console')
}
</script>

<template>
  <div>
    <h1 class="px-4 bg-amber-400">Demo</h1>
    <el-button type="primary" @click="handleClick">primary</el-button>
    <el-icon><Search /></el-icon>
    <icon-accessibility />
    <icon-account-box style="font-size: 2em; color: red" />
    <icon-audio-tape-fill />
  </div>
</template>

<style scoped>
</style>
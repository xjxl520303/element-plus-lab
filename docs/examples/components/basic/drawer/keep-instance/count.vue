<script setup lang="ts">
import { ElButton } from 'element-plus'

import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="mb-2">
    数量：{{ count }}
  </div>
  <ElButton size="small" @click="count++">
    增加
  </ElButton>
  <ElButton size="small" @click="count--">
    减少
  </ElButton>
</template>

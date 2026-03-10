<script setup lang="ts">
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'
import DefaultTheme from 'vitepress/theme'
import DemoHighlightTrigger from './demo-highlight-trigger.vue'
import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <NolebaseEnhancedReadabilitiesMenu />
    </template>
    <template #nav-screen-content-after>
      <NolebaseEnhancedReadabilitiesScreenMenu />
    </template>
  </Layout>
  <portal-target name="ell-dialog" multiple />
  <DemoHighlightTrigger />
</template>

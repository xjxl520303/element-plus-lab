<script lang="ts" setup>
import { ElSimplePageHeader } from 'element-plus-lab'
import { ref } from 'vue'

const customTabConfig = ref([
  { label: '二次比选采购信息', value: '01' },
  { label: '供应商信息', value: '02' },
  { label: '项目流程图', value: '03' },
])
</script>

<template>
  <ElSimplePageHeader first-tab-label="二次比选采购信息" />
  <hr>
  <ElSimplePageHeader :tab-config="customTabConfig">
    <template #default="{ uid }">
      <portal :to="`${uid}-03-extra`">
        <el-button type="primary" size="small">
          下载
        </el-button>
      </portal>
    </template>
    <template #extra>
      <el-button type="default" size="small">
        保存
      </el-button>
      <el-button type="primary" size="small">
        提交
      </el-button>
    </template>
  </ElSimplePageHeader>
</template>

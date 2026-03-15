<script lang="ts" setup>
import { ElSimplePageHeader } from 'element-plus-lab'
</script>

<template>
  <ElSimplePageHeader>
    <template #extra>
      <el-button type="default" size="small">保存</el-button>
      <el-button type="primary" size="small">提交</el-button>
    </template>
  </ElSimplePageHeader>
  <hr />
  <ElSimplePageHeader>
    <template #default="{ uid }">
      <portal :to="`${uid}-0-extra`">
        <el-button type="default" size="small">保存</el-button>
        <el-button type="primary" size="small">提交</el-button>
      </portal>
    </template>
  </ElSimplePageHeader>
  <hr />
  <ElSimplePageHeader>
    <template #default="{ uid }">
      <portal :to="`${uid}-0-extra`">
        <el-button type="primary" size="small">提交</el-button>
      </portal>
      <portal :to="`${uid}-1-extra`">
        <el-button type="primary" size="small">下载</el-button>
      </portal>
    </template>
    <template #extra>
      <el-button type="default" size="small">保存</el-button>
    </template>
  </ElSimplePageHeader>
</template>

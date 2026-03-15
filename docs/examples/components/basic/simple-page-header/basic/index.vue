<script lang="ts" setup>
import { ElSimplePageHeader } from 'element-plus-lab'
</script>

<template>
  <ElSimplePageHeader title="供应商入库申请" />
  <hr />
  <ElSimplePageHeader @tab-change="(val) => console.log(val)" />
  <hr />
  <ElSimplePageHeader title="供应商入库申请">
    <template #extra>
      <el-button type="default" size="small">保存</el-button>
      <el-button type="primary" size="small">提交</el-button>
    </template>
  </ElSimplePageHeader>
  <hr />
  <ElSimplePageHeader>
    <template #extra>
      <el-button type="default" size="small">保存</el-button>
      <el-button type="primary" size="small">提交</el-button>
    </template>
  </ElSimplePageHeader>
</template>

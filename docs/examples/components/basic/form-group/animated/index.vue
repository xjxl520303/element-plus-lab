<script lang="ts" setup>
import { reactive } from 'vue'
import { ElFormGroup } from 'element-plus-lab'

const form = reactive({
  name: '',
  email: '',
  phone: '',
})
</script>

<template>
  <ElFormGroup
    title="带折叠动画的分组"
    description="设置 animated 为 true，展开/收起时有过渡动画"
    :animated="true"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="姓名">
        <el-input v-model="form.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" placeholder="请输入电话" />
      </el-form-item>
    </el-form>
  </ElFormGroup>
</template>

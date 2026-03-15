<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElFormGroup } from 'element-plus-lab'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  remark: '',
})

const group1Folded = ref(false)
const group2Folded = ref(true)

function expandAll() {
  group1Folded.value = false
  group2Folded.value = false
}

function collapseAll() {
  group1Folded.value = true
  group2Folded.value = true
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <el-button size="small" @click="expandAll">全部展开</el-button>
    <el-button size="small" @click="collapseAll">全部折叠</el-button>
  </div>
  <br />

  <ElFormGroup
    v-model:folded="group1Folded"
    title="基本信息"
    description="受控：由上方按钮或左侧图标控制"
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

  <ElFormGroup
    v-model:folded="group2Folded"
    title="附加信息"
    description="受控：与第一个分组同步由按钮控制"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="地址">
        <el-input v-model="form.address" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
  </ElFormGroup>
</template>

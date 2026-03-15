<script setup lang="ts">
import { ElSimpleSteps } from 'element-plus-lab'
import { ref } from 'vue'

const step = ref(1)
const stepsRef = ref<InstanceType<typeof ElSimpleSteps>>()

const stepOptions = [
  { label: '选择产品', value: 1 },
  { label: '校验产品信息', value: 2 },
  { label: '选择机构', value: 3 },
  { label: '校验账户信息', value: 4 },
]

function preStep() {
  step.value = step.value === 1 ? 1 : step.value - 1
}

function nextStep() {
  step.value = step.value === stepOptions.length ? 5 : step.value + 1
}

function preStep2(current: number) {
  stepsRef.value?.setStep(current - 1)
}

function nextStep2(current: number) {
  stepsRef.value?.setStep(current + 1)
}
</script>

<template>
  <h5>控制 step 来完成步骤跳转：</h5>
  <hr>
  <ElSimpleSteps v-model="step" :options="stepOptions" />
  <hr>
  <el-button-group>
    <el-button @click="preStep">
      上一步
    </el-button>
    <el-button @click="nextStep">
      下一步
    </el-button>
  </el-button-group>
  <br>
  <br>
  <h5>使用组件 ref 的 setStep 完成步骤跳转：</h5>
  <hr>
  <ElSimpleSteps ref="stepsRef" v-model="step" :options="stepOptions" />
  <hr>
  <el-button-group>
    <el-button @click="() => preStep2(step)">
      上一步
    </el-button>
    <el-button @click="() => nextStep2(step)">
      下一步
    </el-button>
  </el-button-group>
</template>

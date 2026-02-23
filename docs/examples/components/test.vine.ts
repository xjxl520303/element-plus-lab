import { ref } from 'vue'

export default function MyComponent() {
  const testId = 'picker'
  const num = ref(0)
  const randomPick = () => {
    num.value = Math.floor(Math.random() * 10)
  }

  return vine`
    <div :data-test-id="testId">
      <el-button @click="randomPick">Pick</el-button>
      <div>{{ num }}</div>
    </div>
  `
}
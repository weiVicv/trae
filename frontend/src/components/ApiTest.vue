<template>
  <div class="api-test">
    <h2>API 测试</h2>
    <button @click="testConnection">测试连接</button>
    <p v-if="response">服务器响应: {{ response }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const response = ref('')

const testConnection = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/ping/')
    const data = await res.json()
    response.value = data.message
  } catch (error) {
    response.value = '连接失败: ' + error
  }
}
</script>

<style scoped>
.api-test {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 20px;
}
</style>
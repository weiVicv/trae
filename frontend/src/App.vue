<script setup lang="ts">
import { computed, onMounted } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import { useAuthStore } from './stores/auth'
import ApiTest from './components/ApiTest.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Check if current route needs the three-column layout
const needsThreeColumnLayout = computed(() => {
  return route.path === '/' || route.path === '/knowledge-base' || route.path === '/discussion'
})

// Computed to check if user is authenticated
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Auto-login for development
onMounted(async () => {
  if (!isAuthenticated.value) {
    await authStore.login('demo@example.com', 'password')
    if (route.path === '/login' || route.path === '/register') {
      router.push('/')
    }
  }
})
</script>

<template>
  <div class="app-container">
    <Navbar v-if="isAuthenticated" />
    <main class="main-content">
      <!-- <ApiTest /> -->
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
:root {
  --color-primary-rgb: 15, 82, 186;
  --color-error-rgb: 231, 76, 60;
}

.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: var(--color-neutral-100);
}

.main-content {
  flex: 1;
  overflow: hidden;
  padding-top: var(--spacing-2);
}
</style>
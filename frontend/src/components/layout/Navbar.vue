<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const isMobileMenuOpen = ref(false)

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Navigation items
const navItems = [
  { name: 'Agent', path: '/' },
  { name: '讨论区', path: '/discussion' }
]

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo and app name -->
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          KnowledgeChat
        </router-link>
      </div>
      
      <!-- Desktop navigation -->
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="navbar-item"
            active-class="is-active"
          >
            {{ item.name }}
          </router-link>
        </div>
        
        <div class="navbar-end">
          <div class="user-menu">
            <button class="theme-toggle" @click="themeStore.toggleTheme">
              {{ themeStore.isDark ? '🌞' : '🌙' }}
            </button>
            <span class="username">{{ authStore.user?.username }}</span>
            <button class="text" @click="handleLogout">退出</button>
          </div>
        </div>
      </div>
      
      <!-- Mobile menu toggle -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    
    <!-- Mobile menu -->
    <div class="mobile-menu" :class="{ 'is-active': isMobileMenuOpen }">
      <div class="mobile-menu-items">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.path"
          class="mobile-menu-item"
          active-class="is-active"
          @click="isMobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
        <button class="mobile-menu-item" @click="themeStore.toggleTheme">
          {{ themeStore.isDark ? '切换到亮色模式' : '切换到暗色模式' }}
        </button>
        <button class="mobile-menu-item" @click="handleLogout">退出</button>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  background-color: var(--color-background);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 20;
  border-bottom: 1px solid var(--color-border);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.navbar-brand {
  .logo {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    
    &:hover {
      color: var(--color-primary-dark);
    }
  }
}

.navbar-menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: var(--spacing-6);
  
  @media (max-width: 768px) {
    display: none;
  }
}

.navbar-start, .navbar-end {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.navbar-item {
  padding: var(--spacing-2) var(--spacing-3);
  color: var(--color-text-secondary);
  font-weight: 500;
  position: relative;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-base);
  
  &:hover {
    color: var(--color-primary);
    background-color: var(--color-surface);
  }
  
  &.is-active {
    color: var(--color-primary);
    background-color: var(--color-surface);
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  
  .username {
    font-weight: 500;
    color: var(--color-text);
  }
}

.theme-toggle {
  padding: var(--spacing-1);
  font-size: 1.25rem;
  border-radius: 50%;
  
  &:hover {
    background-color: var(--color-surface);
  }
}

// Mobile menu toggle button
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
  }
  
  span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: var(--color-text);
    transition: all 0.3s ease;
  }
}

// Mobile menu
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--color-background);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-2);
  transform: translateY(-10px);
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
  
  &.is-active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
    display: block;
  }
  
  @media (max-width: 768px) {
    display: block;
  }
}

.mobile-menu-items {
  display: flex;
  flex-direction: column;
}

.mobile-menu-item {
  padding: var(--spacing-2);
  color: var(--color-text-secondary);
  font-weight: 500;
  text-align: left;
  
  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary);
  }
  
  &.is-active {
    color: var(--color-primary);
    background-color: var(--color-surface);
  }
}
</style>
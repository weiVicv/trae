import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true) // Set default theme to dark
  
  // Initialize theme from localStorage
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem('theme')
    isDark.value = storedTheme === 'dark'
    
    // Apply theme class immediately
    updateThemeClass()
  }
  
  // Watch for theme changes
  watch(isDark, () => {
    updateThemeClass()
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  })
  
  // Update theme class on document root
  function updateThemeClass() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    isDark.value = !isDark.value
  }
  
  return {
    isDark,
    toggleTheme
  }
})
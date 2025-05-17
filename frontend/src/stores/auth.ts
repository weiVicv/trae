import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { User } from '../types/user'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Get auth status
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Initialize state from localStorage
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
    if (storedToken) {
      token.value = storedToken
    }
  }
  
  // Login
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const userData: User = {
        id: '1',
        email,
        username: email.split('@')[0]
      }
      
      // Set user data
      user.value = userData
      token.value = 'mock-jwt-token'
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', 'mock-jwt-token')
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to login'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Register
  async function register(email: string, password: string, username: string) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const userData: User = {
        id: '1',
        email,
        username
      }
      
      // Set user data
      user.value = userData
      token.value = 'mock-jwt-token'
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', 'mock-jwt-token')
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to register'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Logout
  async function logout() {
    // Clear state
    user.value = null
    token.value = null
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
  
  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout
  }
})
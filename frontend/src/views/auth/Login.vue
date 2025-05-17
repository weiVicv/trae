<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (isSubmitting.value) return
  
  // Simple validation
  if (!email.value.trim() || !password.value) {
    error.value = 'Please enter both email and password'
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    const success = await authStore.login(email.value, password.value)
    
    if (success) {
      router.push('/')
    } else {
      error.value = authStore.error || 'Login failed. Please check your credentials.'
    }
  } catch (err: any) {
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">Sign In</h1>
          <p class="auth-subtitle">Welcome back! Please sign in to continue.</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- Error message -->
          <div class="error-message" v-if="error">
            {{ error }}
          </div>
          
          <!-- Email field -->
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              v-model="email"
              placeholder="Enter your email"
              required
              autocomplete="email"
            />
          </div>
          
          <!-- Password field -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              v-model="password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
          </div>
          
          <!-- Remember me and forgot password -->
          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password">Forgot password?</a>
          </div>
          
          <!-- Submit button -->
          <button
            type="submit"
            class="primary w-full"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
          </button>
          
          <!-- Register link -->
          <div class="auth-footer">
            <p>
              Don't have an account? 
              <router-link to="/register">Sign up</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-neutral-100);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-2);
}

.auth-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-4);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-3);
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-1);
}

.auth-subtitle {
  color: var(--color-neutral-600);
}

.auth-form {
  .form-group {
    margin-bottom: var(--spacing-3);
    
    label {
      display: block;
      margin-bottom: var(--spacing-1);
      font-weight: 500;
      color: var(--color-neutral-700);
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-3);
    font-size: 0.875rem;
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: var(--spacing-1);
    
    input {
      width: auto;
    }
  }
  
  .forgot-password {
    color: var(--color-primary);
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.auth-footer {
  margin-top: var(--spacing-3);
  text-align: center;
  font-size: 0.875rem;
  
  a {
    color: var(--color-primary);
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.error-message {
  background-color: rgba(var(--color-error-rgb), 0.1);
  color: var(--color-error);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-3);
  font-size: 0.875rem;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const isSubmitting = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (isSubmitting.value) return
  
  // Simple validation
  if (!username.value.trim() || !email.value.trim() || !password.value) {
    error.value = 'Please fill in all required fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (!agreeTerms.value) {
    error.value = 'You must agree to the terms and conditions'
    return
  }
  
  isSubmitting.value = true
  error.value = ''
  
  try {
    const success = await authStore.register(email.value, password.value, username.value)
    
    if (success) {
      router.push('/')
    } else {
      error.value = authStore.error || 'Registration failed. Please try again.'
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
          <h1 class="auth-title">Create Account</h1>
          <p class="auth-subtitle">Join our platform and start exploring</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <!-- Error message -->
          <div class="error-message" v-if="error">
            {{ error }}
          </div>
          
          <!-- Username field -->
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              v-model="username"
              placeholder="Choose a username"
              required
              autocomplete="username"
            />
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
              placeholder="Create a password"
              required
              autocomplete="new-password"
            />
          </div>
          
          <!-- Confirm Password field -->
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              v-model="confirmPassword"
              placeholder="Confirm your password"
              required
              autocomplete="new-password"
            />
          </div>
          
          <!-- Terms and conditions -->
          <div class="form-group">
            <label class="terms-checkbox">
              <input type="checkbox" v-model="agreeTerms" required />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
          </div>
          
          <!-- Submit button -->
          <button
            type="submit"
            class="primary w-full"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Creating account...' : 'Create Account' }}
          </button>
          
          <!-- Login link -->
          <div class="auth-footer">
            <p>
              Already have an account? 
              <router-link to="/login">Sign in</router-link>
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
  
  .terms-checkbox {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-1);
    font-size: 0.875rem;
    
    input {
      width: auto;
      margin-top: 4px;
    }
    
    a {
      color: var(--color-primary);
      
      &:hover {
        text-decoration: underline;
      }
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
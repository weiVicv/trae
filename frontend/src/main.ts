import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/styles/main.scss'
import App from './App.vue'
import routes from './router'

// Create Pinia store
const pinia = createPinia()

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create and mount the app
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
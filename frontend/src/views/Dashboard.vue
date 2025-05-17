<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Knowledge bases
const knowledgeBases = ref([
  {
    id: '1',
    title: 'The Perils of Free Advice',
    description: '关于免费建议的思考和见解',
    sources: 2,
    createdAt: '2025年5月2日',
    icon: '💡'
  },
  {
    id: '2',
    title: '机器学习笔记',
    description: '学习机器学习过程中的重要概念和实践经验',
    sources: 5,
    createdAt: '2025年5月1日',
    icon: '🤖'
  }
])

// Create new knowledge base
const createNewKnowledgeBase = () => {
  const newId = Date.now().toString()
  const newKnowledgeBase = {
    id: newId,
    title: '新知识库',
    description: '开始记录你的想法和见解',
    sources: 0,
    createdAt: new Date().toLocaleDateString('zh-CN'),
    icon: '📚'
  }
  knowledgeBases.value.unshift(newKnowledgeBase)
}

// Open knowledge base
const openKnowledgeBase = (id: string) => {
  router.push(`/knowledge-base/${id}`)
}
</script>

<template>
  <div class="dashboard">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Welcome to NotebookLM</h1>
        <button class="primary create-button" @click="createNewKnowledgeBase">
          + Create new
        </button>
      </div>
      
      <!-- Knowledge bases grid -->
      <div class="knowledge-bases">
        <div 
          v-for="kb in knowledgeBases" 
          :key="kb.id"
          class="knowledge-base-card"
          @click="openKnowledgeBase(kb.id)"
        >
          <div class="card-icon">{{ kb.icon }}</div>
          <div class="card-content">
            <h3 class="card-title">{{ kb.title }}</h3>
            <p class="card-description">{{ kb.description }}</p>
            <div class="card-meta">
              <span>{{ kb.sources }} 个来源</span>
              <span>{{ kb.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  min-height: 100%;
  padding: var(--spacing-4);
  background-color: var(--color-background);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }
}

.create-button {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: 1rem;
}

.knowledge-bases {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-4);
}

.knowledge-base-card {
  background-color: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  cursor: pointer;
  transition: all var(--transition-base);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
  }
}

.card-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-3);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.card-description {
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-top: var(--spacing-2);
}
</style>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DocumentCard from './DocumentCard.vue'
import FileUploader from './FileUploader.vue'
import { useKnowledgeStore } from '../../stores/knowledge'
import { Document } from '../../types/knowledge'

const knowledgeStore = useKnowledgeStore()
const showUploader = ref(false)
const searchQuery = ref('')

// Get documents and selected documents from store
const documents = computed(() => knowledgeStore.documents)
const selectedDocuments = computed(() => knowledgeStore.selectedDocuments)

// Filter documents based on search query
const filteredDocuments = computed(() => {
  if (!searchQuery.value.trim()) {
    return documents.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return documents.value.filter(doc => 
    doc.name.toLowerCase().includes(query)
  )
})

// Check if a document is selected
const isDocumentSelected = (document: Document) => {
  return selectedDocuments.value.some(doc => doc.id === document.id)
}

// Toggle file uploader
const toggleUploader = () => {
  showUploader.value = !showUploader.value
}

// Delete document
const deleteDocument = async (documentId: string) => {
  await knowledgeStore.deleteDocument(documentId)
}

// Rename document
const renameDocument = async (documentId: string, newName: string) => {
  await knowledgeStore.renameDocument(documentId, newName)
}

// Initial data load
onMounted(async () => {
  await knowledgeStore.fetchDocuments()
})
</script>

<template>
  <div class="knowledge-list">
    <!-- Header with search and actions -->
    <div class="list-header">
      <div class="header-actions">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索"
            class="search-input"
          />
        </div>
        
        <button 
          class="add-button" 
          @click="toggleUploader"
        >
          + 添加
        </button>
      </div>
    </div>
    
    <!-- File uploader -->
    <div class="uploader-container" v-if="showUploader">
      <FileUploader @upload-complete="toggleUploader" />
    </div>
    
    <!-- Documents list -->
    <div class="documents-container">
      <div class="documents-list" v-if="filteredDocuments.length > 0">
        <DocumentCard 
          v-for="document in filteredDocuments" 
          :key="document.id" 
          :document="document"
          :isSelected="isDocumentSelected(document)"
          @delete="deleteDocument"
          @rename="renameDocument"
        />
      </div>
      
      <div class="empty-state" v-else>
        <div class="empty-icon">
          📄
        </div>
        <p class="empty-text">
          {{ searchQuery ? '没有找到匹配的文档' : '没有文档' }}
        </p>
        <button class="primary" @click="toggleUploader" v-if="!showUploader && !searchQuery">
          上传文档
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

.list-header {
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
}

.search-container {
  flex: 1;
  
  .search-input {
    width: 100%;
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-input-background);
    color: var(--color-text);
    
    &::placeholder {
      color: var(--color-text-secondary);
    }
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}

.add-button {
  padding: var(--spacing-1) var(--spacing-2);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-card-background);
  
  &:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
}

.documents-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4);
  text-align: center;
  color: var(--color-text-secondary);
}

.empty-icon {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
  font-size: 2rem;
}

.empty-text {
  margin-bottom: var(--spacing-3);
}
</style>
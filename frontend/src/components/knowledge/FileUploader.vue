<script setup lang="ts">
import { ref } from 'vue'
import { useKnowledgeStore } from '../../stores/knowledge'

const knowledgeStore = useKnowledgeStore()

const isUploading = ref(false)
const uploadProgress = ref(0)
const files = ref<File[]>([])
const dragOver = ref(false)

// Handle file selection from input
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    addFiles(Array.from(input.files))
  }
}

// Handle drag and drop
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  dragOver.value = false
  
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

// Add files to the list
const addFiles = (newFiles: File[]) => {
  // Filter for PDF files
  const pdfFiles = newFiles.filter(file => file.type === 'application/pdf')
  files.value = [...files.value, ...pdfFiles]
}

// Remove file from list
const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

// Upload files
const uploadFiles = async () => {
  if (files.value.length === 0) return
  
  isUploading.value = true
  uploadProgress.value = 0
  
  try {
    // Simulate upload process with progress
    const totalFiles = files.value.length
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files.value[i]
      
      // Upload each file
      await knowledgeStore.uploadDocument(file)
      
      // Update progress
      uploadProgress.value = Math.round(((i + 1) / totalFiles) * 100)
    }
    
    // Clear the files array after successful upload
    files.value = []
  } catch (error) {
    console.error('Error uploading files:', error)
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="file-uploader">
    <!-- Drag and drop area -->
    <div 
      class="dropzone"
      :class="{ 'active': dragOver }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div class="dropzone-content">
        <div class="upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <p class="upload-text">Drag & drop PDF files here</p>
        <p class="upload-text-small">or</p>
        <label class="file-input-label">
          Browse Files
          <input 
            type="file" 
            accept=".pdf" 
            multiple 
            @change="handleFileSelect" 
            class="file-input"
          />
        </label>
      </div>
    </div>
    
    <!-- File list -->
    <div class="file-list" v-if="files.length > 0">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="file-item"
      >
        <div class="file-info">
          <div class="file-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div class="file-details">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-size">{{ (file.size / 1024).toFixed(1) }} KB</div>
          </div>
        </div>
        <button class="text" @click="removeFile(index)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Upload progress -->
    <div class="upload-progress" v-if="isUploading">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <div class="progress-text">Uploading: {{ uploadProgress }}%</div>
    </div>
    
    <!-- Upload button -->
    <button 
      class="primary w-full mt-2" 
      @click="uploadFiles" 
      :disabled="files.length === 0 || isUploading"
    >
      Upload Files
    </button>
  </div>
</template>

<style lang="scss" scoped>
.file-uploader {
  width: 100%;
}

.dropzone {
  border: 2px dashed var(--color-neutral-400);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3);
  background-color: var(--color-neutral-100);
  transition: all var(--transition-base);
  margin-bottom: var(--spacing-2);
  
  &.active {
    border-color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  &:hover {
    border-color: var(--color-primary);
  }
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.upload-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-2);
}

.upload-text {
  margin-bottom: var(--spacing-1);
  font-weight: 500;
}

.upload-text-small {
  font-size: 0.875rem;
  color: var(--color-neutral-600);
  margin-bottom: var(--spacing-1);
}

.file-input-label {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color var(--transition-base);
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
}

.file-input {
  display: none;
}

.file-list {
  margin-bottom: var(--spacing-2);
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-1) var(--spacing-2);
  background-color: white;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-1);
  border: 1px solid var(--color-neutral-300);
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.file-icon {
  margin-right: var(--spacing-1);
  color: var(--color-primary);
}

.file-details {
  min-width: 0;
}

.file-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.75rem;
  color: var(--color-neutral-600);
}

.upload-progress {
  margin: var(--spacing-2) 0;
}

.progress-bar {
  height: 6px;
  background-color: var(--color-neutral-300);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--spacing-1);
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--color-neutral-600);
  text-align: right;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  show: boolean
  knowledgeBases: any[]
}>()

const emit = defineEmits<{
  close: []
  select: [folderId: string]
}>()

const selectedFolder = ref('')

const handleSelect = () => {
  if (selectedFolder.value) {
    emit('select', selectedFolder.value)
  }
  emit('close')
}
</script>

<template>
  <div v-if="show" class="dialog-overlay" @click="emit('close')">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h3>选择知识库</h3>
        <button class="text" @click="emit('close')">×</button>
      </div>
      
      <div class="dialog-body">
        <div class="folders-list">
          <label 
            v-for="folder in knowledgeBases" 
            :key="folder.id"
            class="folder-option"
          >
            <input
              type="radio"
              :value="folder.id"
              v-model="selectedFolder"
              name="folder"
            />
            <div class="folder-info">
              <span class="folder-icon">📁</span>
              <span class="folder-name">{{ folder.name }}</span>
            </div>
          </label>
        </div>
      </div>
      
      <div class="dialog-footer">
        <button class="secondary" @click="emit('close')">取消</button>
        <button 
          class="primary" 
          @click="handleSelect"
          :disabled="!selectedFolder"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.dialog-content {
  background-color: var(--color-card-background);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: var(--color-text);
  }
}

.dialog-body {
  padding: var(--spacing-3);
  overflow-y: auto;
  flex: 1;
}

.folders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.folder-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-background-hover);
  }
  
  input {
    width: 20px;
    height: 20px;
  }
}

.folder-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.folder-name {
  color: var(--color-text);
}

.dialog-footer {
  padding: var(--spacing-3);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
}
</style>
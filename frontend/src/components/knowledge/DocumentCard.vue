<script setup lang="ts">
import { ref } from 'vue'
import { Document } from '../../types/knowledge'
import { useKnowledgeStore } from '../../stores/knowledge'

const props = defineProps<{
  document: Document
  isSelected: boolean
}>()

const emit = defineEmits<{
  delete: [documentId: string]
  rename: [documentId: string, newName: string]
}>()

const knowledgeStore = useKnowledgeStore()
const isRenaming = ref(false)
const newName = ref(props.document.name)

// Handle document selection
const toggleSelection = (event: Event) => {
  event.stopPropagation()
  knowledgeStore.toggleDocumentSelection(props.document)
}

// Start renaming
const startRename = (event: Event) => {
  event.stopPropagation()
  isRenaming.value = true
}

// Cancel renaming
const cancelRename = () => {
  isRenaming.value = false
  newName.value = props.document.name
}

// Save new name
const saveRename = (event: Event) => {
  event.stopPropagation()
  if (newName.value.trim() !== '') {
    emit('rename', props.document.id, newName.value.trim())
    isRenaming.value = false
  }
}

// Delete document
const deleteDocument = (event: Event) => {
  event.stopPropagation()
  if (confirm(`Are you sure you want to delete "${props.document.name}"?`)) {
    emit('delete', props.document.id)
  }
}
</script>

<template>
  <div 
    class="document-card" 
    :class="{ selected: isSelected }"
  >
    <div class="document-select">
      <input 
        type="checkbox"
        :checked="isSelected"
        @click="toggleSelection"
      />
    </div>
    
    <div class="document-icon">
      📄
    </div>
    
    <div class="document-info">
      <!-- Display document name or rename input -->
      <div v-if="!isRenaming" class="document-name">
        {{ document.name }}
      </div>
      <div v-else class="document-rename">
        <input 
          type="text" 
          v-model="newName" 
          @click.stop 
          @keyup.enter="saveRename"
          @keyup.esc="cancelRename"
          ref="renameInput"
          autofocus
        />
        <div class="rename-actions">
          <button @click.stop="saveRename" class="text">Save</button>
          <button @click.stop="cancelRename" class="text">Cancel</button>
        </div>
      </div>
      
      <!-- Document date -->
      <div class="document-date" v-if="!isRenaming">
        {{ new Date(document.uploaded_at).toLocaleDateString() }}
      </div>
    </div>
    
    <!-- Actions (only show when not renaming) -->
    <div class="document-actions" v-if="!isRenaming">
      <button class="text" @click="startRename">
        ✎
      </button>
      <button class="text" @click="deleteDocument">
        ×
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.document-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-1);
  cursor: pointer;
  transition: all var(--transition-base);
  background-color: var(--color-background);
  
  &:hover {
    background-color: var(--color-background-hover);
  }
  
  &.selected {
    background-color: var(--color-background-selected);
    border-left: 3px solid var(--color-primary);
  }
}

.document-select {
  margin-right: var(--spacing-2);
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}

.document-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: var(--spacing-2);
  color: var(--color-primary);
  font-size: 1.5rem;
}

.document-info {
  flex: 1;
  min-width: 0;
}

.document-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  color: var(--color-text);
}

.document-date {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.document-rename {
  input {
    width: 100%;
    margin-bottom: var(--spacing-1);
    background-color: var(--color-background);
    color: var(--color-text);
  }
  
  .rename-actions {
    display: flex;
    gap: var(--spacing-1);
  }
}

.document-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  opacity: 0;
  transition: opacity var(--transition-base);
  
  .document-card:hover & {
    opacity: 1;
  }
  
  button {
    padding: 4px;
    color: var(--color-text-light);
    font-size: 1rem;
    
    &:hover {
      color: var(--color-text);
    }
    
    &:last-child:hover {
      color: var(--color-error);
    }
  }
}
</style>
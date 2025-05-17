<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudioStore } from '../../stores/audio'
import { useKnowledgeStore } from '../../stores/knowledge'
import { AudioRequest } from '../../types/audio'

const audioStore = useAudioStore()
const knowledgeStore = useKnowledgeStore()

// State
const isGenerating = ref(false)
const generationProgress = ref(0)
const selectedDocuments = computed(() => knowledgeStore.selectedDocuments)
const generatedAudios = computed(() => audioStore.generations)

// Generate audio
const generateAudio = async () => {
  if (!selectedDocuments.value.length) {
    alert('Please select at least one document from the Knowledge Base first')
    return
  }
  
  isGenerating.value = true
  generationProgress.value = 0
  
  const request: AudioRequest = {
    documentIds: selectedDocuments.value.map(doc => doc.id),
    style: 'conversation',
    name: '深入探究对话'
  }
  
  try {
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      if (generationProgress.value < 95) {
        generationProgress.value += Math.floor(Math.random() * 10) + 1
      }
    }, 1000)
    
    // Simulate API call with a delay
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Complete the generation
    clearInterval(progressInterval)
    generationProgress.value = 100
    
    // Add the generated audio to the store
    await audioStore.generateAudio(request)
    
    // Reset form after completion
    setTimeout(() => {
      isGenerating.value = false
      generationProgress.value = 0
    }, 1000)
  } catch (error) {
    console.error('Error generating audio:', error)
    isGenerating.value = false
    generationProgress.value = 0
  }
}

// Download audio
const downloadAudio = (audio: AudioGeneration) => {
  // In a real app, this would download the actual audio file
  alert(`Downloading audio: ${audio.name}`)
}

// Delete audio
const deleteAudio = (audioId: string) => {
  if (confirm('Are you sure you want to delete this audio?')) {
    audioStore.deleteAudio(audioId)
  }
}
</script>

<template>
  <div class="audio-generator">
    <!-- Audio generation section -->
    <div class="generation-section">
      <div class="generation-card">
        <div class="icon-container">
          <div class="icon">👥</div>
        </div>
        <div class="title">深入探究对话</div>
        <div class="subtitle">两位主持人</div>
        <div class="button-group">
          <button class="secondary">自定义</button>
          <button class="primary" @click="generateAudio" :disabled="isGenerating">生成</button>
        </div>
      </div>
      
      <!-- Generation progress -->
      <div class="generation-progress" v-if="isGenerating">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${generationProgress}%` }"></div>
        </div>
        <p class="progress-text">
          生成中... {{ generationProgress }}%
        </p>
      </div>
    </div>
    
    <!-- Notes section -->
    <div class="notes-section">
      <h3 class="section-title">备注</h3>
      <button class="add-note-button">
        <span>+ 添加笔记</span>
      </button>
      
      <div class="quick-links">
        <button class="quick-link">
          <span class="icon">📚</span>
          <span>学习指南</span>
        </button>
        <button class="quick-link">
          <span class="icon">📄</span>
          <span>简报文档</span>
        </button>
        <button class="quick-link">
          <span class="icon">❓</span>
          <span>常见问题解答</span>
        </button>
        <button class="quick-link">
          <span class="icon">📊</span>
          <span>时间轴</span>
        </button>
      </div>
    </div>
    
    <!-- Generated audios list -->
    <div class="audios-section">
      <div class="audio-list" v-if="generatedAudios.length > 0">
        <div class="audio-item" v-for="audio in generatedAudios" :key="audio.id">
          <div class="audio-info">
            <h4 class="audio-name">{{ audio.name }}</h4>
            <p class="audio-meta">
              <span>{{ audio.style }}</span> • 
              <span>{{ new Date(audio.createdAt).toLocaleDateString() }}</span>
            </p>
          </div>
          
          <div class="audio-controls">
            <button class="audio-play-button" title="播放">
              ▶
            </button>
            <button class="text" title="下载" @click="downloadAudio(audio)">
              ↓
            </button>
            <button class="text" title="删除" @click="deleteAudio(audio.id)">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.audio-generator {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.generation-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.generation-card {
  background-color: var(--color-card-background);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  text-align: center;
  border: 1px solid var(--color-border);
}

.icon-container {
  margin-bottom: var(--spacing-2);
}

.icon {
  font-size: 2rem;
  color: var(--color-primary);
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--spacing-1);
}

.subtitle {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-3);
}

.button-group {
  display: flex;
  gap: var(--spacing-2);
  justify-content: center;
  
  button {
    min-width: 100px;
  }
}

.generation-progress {
  background-color: var(--color-card-background);
  padding: var(--spacing-3);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.progress-bar {
  height: 6px;
  background-color: var(--color-neutral-200);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--spacing-2);
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.notes-section {
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--spacing-2);
    color: var(--color-text);
  }
}

.add-note-button {
  width: 100%;
  padding: var(--spacing-2);
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  background-color: var(--color-card-background);
  margin-bottom: var(--spacing-3);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-2);
}

.quick-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
  background-color: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  
  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  
  .icon {
    font-size: 1.25rem;
  }
}

.audio-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.audio-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3);
  background-color: var(--color-card-background);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.audio-info {
  flex: 1;
  min-width: 0;
}

.audio-name {
  font-weight: 500;
  margin: 0 0 4px 0;
  color: var(--color-text);
}

.audio-meta {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.audio-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.audio-play-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
}
</style>
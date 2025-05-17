<script setup lang="ts">
import { onMounted } from 'vue'
import ThreeColumnLayout from '../components/layout/ThreeColumnLayout.vue'
import KnowledgeList from '../components/knowledge/KnowledgeList.vue'
import ChatInterface from '../components/chat/ChatInterface.vue'
import AudioGenerator from '../components/audio/AudioGenerator.vue'
import { useKnowledgeStore } from '../stores/knowledge'
import { useAudioStore } from '../stores/audio'

const knowledgeStore = useKnowledgeStore()
const audioStore = useAudioStore()

onMounted(async () => {
  // Fetch initial data
  await knowledgeStore.fetchDocuments()
  await audioStore.fetchGenerations()
})
</script>

<template>
  <div class="knowledge-base-page">
    <ThreeColumnLayout 
      leftTitle="Knowledge Base" 
      middleTitle="AI Chat" 
      rightTitle="Audio Generator"
    >
      <!-- Left column: Knowledge Base -->
      <template #left>
        <KnowledgeList />
      </template>
      
      <!-- Middle column: Chat -->
      <template #middle>
        <ChatInterface />
      </template>
      
      <!-- Right column: Audio Generator -->
      <template #right>
        <AudioGenerator />
      </template>
    </ThreeColumnLayout>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-base-page {
  height: 100%;
  width: 100%;
}
</style>
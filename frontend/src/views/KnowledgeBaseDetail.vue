<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ThreeColumnLayout from '../components/layout/ThreeColumnLayout.vue'
import KnowledgeList from '../components/knowledge/KnowledgeList.vue'
import ChatInterface from '../components/chat/ChatInterface.vue'
import AudioGenerator from '../components/audio/AudioGenerator.vue'
import { useKnowledgeStore } from '../stores/knowledge'
import { useAudioStore } from '../stores/audio'

const route = useRoute()
const knowledgeStore = useKnowledgeStore()
const audioStore = useAudioStore()

onMounted(async () => {
  // Fetch initial data
  await knowledgeStore.fetchDocuments()
  await audioStore.fetchGenerations()
})
</script>

<template>
  <div class="knowledge-base-detail">
    <ThreeColumnLayout 
      leftTitle="知识库" 
      middleTitle="AI 对话" 
      rightTitle="音频生成"
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
.knowledge-base-detail {
  height: 100%;
  width: 100%;
}
</style>
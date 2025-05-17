import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AudioGeneration, AudioRequest } from '../types/audio'

export const useAudioStore = defineStore('audio', () => {
  // State
  const generations = ref<AudioGeneration[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Get generated audios
  async function fetchGenerations() {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate fetching generations
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // If no generations, we could add sample ones here
      if (generations.value.length === 0) {
        generations.value = [
          {
            id: '1',
            name: 'ML Introduction Audio',
            documentId: '1',
            style: 'conversation',
            status: 'completed',
            audioUrl: '/audio/ml-intro.mp3',
            createdAt: new Date('2023-12-12').toISOString(),
            duration: 325 // seconds
          },
          {
            id: '2',
            name: 'Data Science Overview',
            documentId: '2',
            style: 'narration',
            status: 'completed',
            audioUrl: '/audio/data-science.mp3',
            createdAt: new Date('2023-12-18').toISOString(),
            duration: 412 // seconds
          }
        ]
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch audio generations'
    } finally {
      loading.value = false
    }
  }
  
  // Generate audio
  async function generateAudio(request: AudioRequest) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would trigger audio generation on the server
      // For demo purposes, we'll simulate a successful generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a new audio generation
      const newGeneration: AudioGeneration = {
        id: Date.now().toString(),
        name: request.name,
        documentId: request.documentId,
        style: request.style,
        status: 'completed',
        audioUrl: `/audio/${request.name.replace(/\s+/g, '-').toLowerCase()}.mp3`,
        createdAt: new Date().toISOString(),
        duration: Math.floor(Math.random() * 300) + 120 // Random duration between 2-7 minutes
      }
      
      // Add to generations array
      generations.value.push(newGeneration)
      
      return newGeneration
    } catch (err: any) {
      error.value = err.message || 'Failed to generate audio'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Delete audio
  async function deleteAudio(audioId: string) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would delete the audio file from the server
      // For demo purposes, we'll simulate a successful deletion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Remove from generations array
      generations.value = generations.value.filter(gen => gen.id !== audioId)
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete audio'
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    generations,
    loading,
    error,
    fetchGenerations,
    generateAudio,
    deleteAudio
  }
})
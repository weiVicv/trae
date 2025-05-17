import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Message } from '../types/chat'

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Add a new message
  function addMessage(message: Message) {
    messages.value.push(message)
  }
  
  // Send message to AI and get response
  async function sendMessageToAI(content: string, documentId: string | null = null) {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call to the backend
      // For demo purposes, we'll simulate an AI response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let responseContent = ''
      
      // Generate different responses based on the query
      if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
        responseContent = 'Hello! How can I assist you with your documents today?'
      } else if (content.toLowerCase().includes('document') || content.toLowerCase().includes('pdf')) {
        responseContent = documentId 
          ? 'I see you\'re interested in this document. What specific information would you like to know about it?'
          : 'You can upload PDF documents in the Knowledge Base section on the left. Is there something specific you\'re looking for?'
      } else if (content.toLowerCase().includes('audio')) {
        responseContent = 'You can generate audio versions of your documents in the Audio section. Would you like me to help you with that?'
      } else {
        // Generic response
        const responses = [
          'I understand your question. Based on the knowledge base, I can provide information on various topics related to your documents.',
          'That\'s an interesting question. Let me analyze the relevant documents to give you a comprehensive answer.',
          'I can help you with that. The documents in your knowledge base contain information that might be useful for this query.',
          'Great question! I\'ll reference the documents in your knowledge base to provide you with accurate information.'
        ]
        responseContent = responses[Math.floor(Math.random() * responses.length)]
      }
      
      // Add AI response
      addMessage({
        id: Date.now().toString(),
        content: responseContent,
        sender: 'ai',
        timestamp: new Date()
      })
      
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to get AI response'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Clear chat
  function clearChat() {
    messages.value = []
  }
  
  return {
    messages,
    loading,
    error,
    addMessage,
    sendMessageToAI,
    clearChat
  }
})
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import { useChatStore } from '../../stores/chat'
import { Message } from '../../types/chat'

const chatStore = useChatStore()
const messages = ref<Message[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const isTyping = ref(false)
const selectedDocument = ref<string | null>(null)

// Listen for messages changes
onMounted(() => {
  // Initialize with welcome message if no messages
  if (chatStore.messages.length === 0) {
    chatStore.addMessage({
      id: Date.now().toString(),
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    })
  }
  
  messages.value = chatStore.messages
  scrollToBottom()
})

// Watch for changes to the messages array
chatStore.$subscribe((_, state) => {
  messages.value = state.messages
  nextTick(() => {
    scrollToBottom()
  })
})

// Send a new message
const sendMessage = async () => {
  if (newMessage.value.trim() === '') return
  
  const userMessage = newMessage.value.trim()
  newMessage.value = ''
  
  // Add user message
  chatStore.addMessage({
    id: Date.now().toString(),
    content: userMessage,
    sender: 'user',
    timestamp: new Date()
  })
  
  // Show typing indicator
  isTyping.value = true
  
  try {
    // Simulate AI response after a short delay
    setTimeout(async () => {
      // AI response
      await chatStore.sendMessageToAI(userMessage, selectedDocument.value)
      isTyping.value = false
    }, 1000)
  } catch (error) {
    console.error('Error sending message:', error)
    isTyping.value = false
    
    // Add error message
    chatStore.addMessage({
      id: Date.now().toString(),
      content: 'Sorry, there was an error processing your message. Please try again.',
      sender: 'system',
      timestamp: new Date()
    })
  }
}

// Scroll to bottom of chat
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<template>
  <div class="chat-interface">
    <!-- Messages container -->
    <div class="messages-container" ref="messagesContainer">
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id" 
        :message="message" 
      />
      
      <!-- Typing indicator -->
      <div class="typing-indicator" v-if="isTyping">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
    
    <!-- Message input -->
    <div class="message-input-container">
      <textarea
        v-model="newMessage"
        placeholder="Type your message here..."
        @keydown.enter.prevent="sendMessage"
        class="message-input"
        rows="1"
      ></textarea>
      <button 
        class="send-button" 
        @click="sendMessage"
        :disabled="newMessage.trim() === ''"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
  display: flex;
  flex-direction: column;
}

.typing-indicator {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-3);
  margin-left: 48px;
  
  .typing-dot {
    width: 8px;
    height: 8px;
    background-color: var(--color-neutral-500);
    border-radius: 50%;
    margin-right: 4px;
    animation: typing 1.5s infinite ease-in-out;
    
    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
      margin-right: 0;
    }
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}

.message-input-container {
  display: flex;
  align-items: center;
  padding: var(--spacing-2);
  background-color: white;
  border-top: 1px solid var(--color-neutral-300);
}

.message-input {
  flex: 1;
  padding: var(--spacing-2);
  border: 1px solid var(--color-neutral-400);
  border-radius: var(--border-radius-md);
  resize: none;
  max-height: 120px;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
}

.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  margin-left: var(--spacing-2);
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: var(--color-neutral-400);
    cursor: not-allowed;
  }
}
</style>
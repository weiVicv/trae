<script setup lang="ts">
import { Message } from '../../types/chat'

defineProps<{
  message: Message
}>()
</script>

<template>
  <div class="chat-message" :class="message.sender">
    <div class="message-avatar" v-if="message.sender === 'ai'">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2a8 8 0 0 1 8 8v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a8 8 0 0 1 8-8z"></path>
        <path d="M20 10a8 8 0 0 0-16 0"></path>
        <path d="M12 6v4"></path>
        <path d="M16 14v.8"></path>
        <path d="M8 14v.8"></path>
      </svg>
    </div>
    <div class="message-avatar" v-else-if="message.sender === 'user'">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <div class="message-bubble">
      <div class="message-content">{{ message.content }}</div>
      <div class="message-time">{{ formatTime(message.timestamp) }}</div>
    </div>
  </div>
</template>

<script lang="ts">
function formatTime(timestamp: Date): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
</script>

<style lang="scss" scoped>
.chat-message {
  display: flex;
  margin-bottom: var(--spacing-3);
  
  &.user {
    flex-direction: row-reverse;
    
    .message-bubble {
      background-color: var(--color-primary);
      color: white;
      border-radius: 18px 18px 4px 18px;
      margin-left: 0;
      margin-right: var(--spacing-2);
      
      .message-time {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
  
  &.ai {
    .message-bubble {
      background-color: var(--color-neutral-200);
      border-radius: 18px 18px 18px 4px;
    }
  }
  
  &.system {
    justify-content: center;
    
    .message-bubble {
      background-color: var(--color-neutral-100);
      border-radius: var(--border-radius-md);
      color: var(--color-neutral-600);
      font-style: italic;
      max-width: 80%;
    }
  }
}

.message-avatar {
  display: flex;
  align-items: flex-end;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-neutral-200);
  padding: 6px;
  
  svg {
    width: 100%;
    height: 100%;
    color: var(--color-neutral-700);
  }
  
  .user & {
    background-color: var(--color-primary-light);
    
    svg {
      color: white;
    }
  }
}

.message-bubble {
  max-width: 70%;
  padding: var(--spacing-2);
  margin-left: var(--spacing-2);
  box-shadow: var(--shadow-sm);
}

.message-content {
  white-space: pre-wrap;
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-time {
  font-size: 0.75rem;
  color: var(--color-neutral-500);
  text-align: right;
}
</style>
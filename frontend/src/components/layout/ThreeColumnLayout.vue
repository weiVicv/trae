<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  leftTitle?: string;
  middleTitle?: string;
  rightTitle?: string;
}>();

// For mobile/tablet view, we'll toggle columns visibility
const activeColumn = ref<'left' | 'middle' | 'right'>('middle');

// Column resize state
const isResizing = ref(false);
const startX = ref(0);
const leftWidth = ref(25);
const rightWidth = ref(25);
const minWidth = 20;
const maxWidth = 40;

// Start resizing
const startResize = (e: MouseEvent, side: 'left' | 'right') => {
  isResizing.value = true;
  startX.value = e.pageX;
  document.body.style.cursor = 'col-resize';
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.value) return;
    
    const diff = ((e.pageX - startX.value) / window.innerWidth) * 100;
    
    if (side === 'left') {
      const newWidth = leftWidth.value + diff;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        leftWidth.value = newWidth;
        startX.value = e.pageX;
      }
    } else {
      const newWidth = rightWidth.value - diff;
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        rightWidth.value = newWidth;
        startX.value = e.pageX;
      }
    }
  };
  
  const stopResize = () => {
    isResizing.value = false;
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResize);
};

// Toggle column visibility on mobile/tablet
const showColumn = (column: 'left' | 'middle' | 'right') => {
  activeColumn.value = column;
};

// Check if we're on mobile view
const isMobile = ref(window.innerWidth < 768);

// Handle window resize
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="three-column-layout">
    <!-- Mobile column selector -->
    <div class="column-selector" v-if="isMobile">
      <button 
        @click="showColumn('left')" 
        :class="{ active: activeColumn === 'left' }"
      >
        {{ leftTitle || 'Knowledge Base' }}
      </button>
      <button 
        @click="showColumn('middle')" 
        :class="{ active: activeColumn === 'middle' }"
      >
        {{ middleTitle || 'Chat' }}
      </button>
      <button 
        @click="showColumn('right')" 
        :class="{ active: activeColumn === 'right' }"
      >
        {{ rightTitle || 'Audio' }}
      </button>
    </div>
    
    <!-- Three column container -->
    <div class="columns-container" :class="{ 'is-resizing': isResizing }">
      <!-- Left column -->
      <div 
        class="column left-column" 
        :style="{ width: `${leftWidth}%` }"
        :class="{ 
          'mobile-hidden': isMobile && activeColumn !== 'left',
          'mobile-active': isMobile && activeColumn === 'left'
        }"
      >
        <div class="column-header">
          <h2>{{ leftTitle || 'Knowledge Base' }}</h2>
        </div>
        <div class="column-content">
          <slot name="left"></slot>
        </div>
        <!-- Resize handle -->
        <div 
          class="resize-handle"
          @mousedown="(e) => startResize(e, 'left')"
        ></div>
      </div>
      
      <!-- Middle column -->
      <div 
        class="column middle-column" 
        :style="{ width: `${100 - leftWidth - rightWidth}%` }"
        :class="{ 
          'mobile-hidden': isMobile && activeColumn !== 'middle',
          'mobile-active': isMobile && activeColumn === 'middle'
        }"
      >
        <div class="column-header">
          <h2>{{ middleTitle || 'Chat' }}</h2>
        </div>
        <div class="column-content">
          <slot name="middle"></slot>
        </div>
      </div>
      
      <!-- Right column -->
      <div 
        class="column right-column" 
        :style="{ width: `${rightWidth}%` }"
        :class="{ 
          'mobile-hidden': isMobile && activeColumn !== 'right',
          'mobile-active': isMobile && activeColumn === 'right'
        }"
      >
        <div class="column-header">
          <h2>{{ rightTitle || 'Audio' }}</h2>
        </div>
        <div class="column-content">
          <slot name="right"></slot>
        </div>
        <!-- Resize handle -->
        <div 
          class="resize-handle left"
          @mousedown="(e) => startResize(e, 'right')"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.three-column-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.column-selector {
  display: none;
  padding: var(--spacing-1);
  background-color: var(--color-card-background);
  border-bottom: 1px solid var(--color-border);
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
  
  button {
    flex: 1;
    padding: var(--spacing-1);
    font-size: 0.875rem;
    text-align: center;
    color: var(--color-text-secondary);
    border-radius: var(--border-radius-sm);
    
    &.active {
      background-color: var(--color-primary);
      color: white;
    }
  }
}

.columns-container {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  
  &.is-resizing {
    cursor: col-resize;
    user-select: none;
  }
}

.column {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all var(--transition-base);
  position: relative;
  
  &.left-column {
    background-color: var(--color-surface);
  }
  
  &.middle-column {
    background-color: var(--color-background);
  }
  
  &.right-column {
    background-color: var(--color-surface);
  }
  
  @media (max-width: 768px) {
    position: absolute;
    left: 0;
    top: 0;
    width: 100% !important;
    height: 100%;
    
    &.mobile-hidden {
      transform: translateX(-100%);
      opacity: 0;
      pointer-events: none;
    }
    
    &.mobile-active {
      transform: translateX(0);
      opacity: 1;
      z-index: 1;
    }
  }
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  background-color: transparent;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary);
  }
  
  &.left {
    left: 0;
    right: auto;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
}

.column-header {
  padding: var(--spacing-2);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-card-background);
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }
}

.column-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
}
</style>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useKnowledgeStore } from '../stores/knowledge'
import SelectKnowledgeBaseDialog from '../components/dialog/SelectKnowledgeBaseDialog.vue'

const knowledgeStore = useKnowledgeStore()

// Tree structure for knowledge bases
const knowledgeBases = ref([
  {
    id: '1',
    name: '机器学习',
    expanded: true,
    files: [
      { id: '1-1', name: '基础概念.md', type: 'file', date: '2024-02-20' },
      { id: '1-2', name: '神经网络.md', type: 'file', date: '2024-02-21' }
    ]
  },
  {
    id: '2',
    name: 'Python',
    expanded: false,
    files: [
      { id: '2-1', name: '异步编程.md', type: 'file', date: '2024-02-19' },
      { id: '2-2', name: '设计模式.md', type: 'file', date: '2024-02-18' }
    ]
  }
])

// Discussion posts with comments
const posts = ref([
  {
    id: '1',
    title: '机器学习基础概念总结',
    content: '在学习机器学习的过程中，我发现以下几个概念特别重要：\n1. 监督学习与非监督学习的区别\n2. 过拟合与欠拟合的处理\n3. 交叉验证的重要性\n4. 特征工程的基本方法',
    author: '张三',
    date: '2024-02-20',
    likes: 15,
    comments: [
      {
        id: '1-1',
        author: '李四',
        content: '非常好的总结！我觉得特征工程确实是最重要的部分之一。',
        date: '2024-02-20',
        likes: 5
      },
      {
        id: '1-2',
        author: '王五',
        content: '建议可以加入一些实际案例来说明这些概念。',
        date: '2024-02-21',
        likes: 3
      }
    ],
    tags: ['机器学习', '入门指南'],
    showComments: false
  },
  {
    id: '2',
    title: '深度学习框架比较',
    content: '最近我对比了几个主流的深度学习框架，包括TensorFlow和PyTorch。以下是主要的对比点：\n1. 易用性：PyTorch的动态图更直观\n2. 部署：TensorFlow在生产环境更成熟\n3. 调试：PyTorch的调试体验更好\n4. 社区支持：两者都有活跃的社区',
    author: '李四',
    date: '2024-02-19',
    likes: 23,
    comments: [
      {
        id: '2-1',
        author: '张三',
        content: '完全同意关于PyTorch调试体验的观点！',
        date: '2024-02-19',
        likes: 8
      }
    ],
    tags: ['深度学习', '框架对比'],
    showComments: false
  }
])

// Toggle folder expansion
const toggleFolder = (folder: any) => {
  folder.expanded = !folder.expanded
}

// Add new folder
const addFolder = () => {
  const name = prompt('请输入文件夹名称')
  if (name) {
    knowledgeBases.value.push({
      id: Date.now().toString(),
      name,
      expanded: false,
      files: []
    })
  }
}

// Add new file
const addFile = (folder: any) => {
  const name = prompt('请输入文件名')
  if (name) {
    folder.files.push({
      id: Date.now().toString(),
      name: name.endsWith('.md') ? name : `${name}.md`,
      type: 'file',
      date: new Date().toLocaleDateString()
    })
  }
}

// Toggle comments visibility
const toggleComments = (post: any) => {
  post.showComments = !post.showComments
}

// Add new comment
const newComment = ref('')
const addComment = (post: any) => {
  if (!newComment.value.trim()) return
  
  const comment = {
    id: Date.now().toString(),
    author: '当前用户',
    content: newComment.value,
    date: new Date().toLocaleDateString(),
    likes: 0
  }
  
  post.comments.push(comment)
  newComment.value = ''
}

// Dialog state
const showDialog = ref(false)
const currentPost = ref<any>(null)

// Save post to knowledge base
const saveToKnowledgeBase = async (post: any) => {
  currentPost.value = post
  showDialog.value = true
}

// Handle folder selection
const handleFolderSelect = async (folderId: string) => {
  const folder = knowledgeBases.value.find(f => f.id === folderId)
  if (!folder || !currentPost.value) return
  
  try {
    const file = new File(
      [currentPost.value.content],
      `${currentPost.value.title}.md`,
      { type: 'text/markdown' }
    )
    
    // Add file to the folder
    folder.files.push({
      id: Date.now().toString(),
      name: `${currentPost.value.title}.md`,
      type: 'file',
      date: new Date().toLocaleDateString()
    })
    
    await knowledgeStore.uploadDocument(file)
    alert('文章已添加到知识库')
  } catch (error) {
    console.error('Error saving to knowledge base:', error)
    alert('保存失败，请重试')
  }
  
  currentPost.value = null
}

onMounted(async () => {
  await knowledgeStore.fetchDocuments()
})
</script>

<template>
  <div class="discussion-page">
    <div class="two-column-layout">
      <!-- Left column: Knowledge Base Tree -->
      <div class="column left-column">
        <div class="column-header">
          <h2>知识库</h2>
          <button class="text" @click="addFolder" title="新建文件夹">
            +
          </button>
        </div>
        <div class="column-content">
          <div class="tree-view">
            <div v-for="folder in knowledgeBases" :key="folder.id" class="folder">
              <div class="folder-header" @click="toggleFolder(folder)">
                <span class="folder-icon">
                  {{ folder.expanded ? '📂' : '📁' }}
                </span>
                <span class="folder-name">{{ folder.name }}</span>
                <button 
                  class="text add-file-button" 
                  @click.stop="addFile(folder)"
                  title="新建文件"
                >
                  +
                </button>
              </div>
              
              <div class="folder-content" v-show="folder.expanded">
                <div v-for="file in folder.files" :key="file.id" class="file">
                  <span class="file-icon">📄</span>
                  <span class="file-name">{{ file.name }}</span>
                  <span class="file-date">{{ file.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right column: Discussion -->
      <div class="column right-column">
        <div class="column-header">
          <h2>讨论区</h2>
        </div>
        <div class="column-content">
          <div class="discussion-container">
            <!-- Create post button -->
            <button class="create-post-button primary">
              发布新帖子
            </button>
            
            <!-- Posts list -->
            <div class="posts-list">
              <div v-for="post in posts" :key="post.id" class="post-card">
                <h3 class="post-title">{{ post.title }}</h3>
                
                <!-- Tags -->
                <div class="post-tags">
                  <span v-for="tag in post.tags" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                </div>
                
                <p class="post-content">{{ post.content }}</p>
                
                <div class="post-meta">
                  <span class="author">{{ post.author }}</span>
                  <span class="date">{{ post.date }}</span>
                  
                  <div class="interactions">
                    <button class="text" @click="saveToKnowledgeBase(post)" title="保存到知识库">
                      📚
                    </button>
                    <button class="text" title="点赞">
                      👍 {{ post.likes }}
                    </button>
                    <button 
                      class="text" 
                      @click="toggleComments(post)" 
                      title="评论"
                    >
                      💬 {{ post.comments.length }}
                    </button>
                  </div>
                </div>
                
                <!-- Comments section -->
                <div 
                  class="comments-section"
                  :class="{ 'show': post.showComments }"
                  v-show="post.showComments"
                >
                  <!-- Existing comments -->
                  <div class="comments-list">
                    <div 
                      v-for="comment in post.comments" 
                      :key="comment.id" 
                      class="comment"
                    >
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.author }}</span>
                        <span class="comment-date">{{ comment.date }}</span>
                      </div>
                      <p class="comment-content">{{ comment.content }}</p>
                      <div class="comment-actions">
                        <button class="text" title="点赞">
                          👍 {{ comment.likes }}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Add new comment -->
                  <div class="add-comment">
                    <textarea 
                      v-model="newComment"
                      placeholder="写下你的评论..."
                      rows="2"
                    ></textarea>
                    <button 
                      class="primary"
                      @click="addComment(post)"
                      :disabled="!newComment.trim()"
                    >
                      发表评论
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add the dialog component -->
    <SelectKnowledgeBaseDialog
      :show="showDialog"
      :knowledge-bases="knowledgeBases"
      @close="showDialog = false"
      @select="handleFolderSelect"
    />
  </div>
</template>

<style lang="scss" scoped>
.discussion-page {
  height: 100%;
  width: 100%;
}

.two-column-layout {
  display: flex;
  height: 100%;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &.left-column {
    width: 300px;
    background-color: var(--color-surface);
    border-right: 1px solid var(--color-border);
  }
  
  &.right-column {
    flex: 1;
    background-color: var(--color-background);
  }
}

.column-header {
  padding: var(--spacing-3);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-card-background);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
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
}

.tree-view {
  padding: var(--spacing-2);
}

.folder {
  margin-bottom: var(--spacing-2);
}

.folder-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-2);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  
  &:hover {
    background-color: var(--color-background-hover);
  }
}

.folder-icon {
  margin-right: var(--spacing-2);
}

.folder-name {
  flex: 1;
  color: var(--color-text);
}

.add-file-button {
  opacity: 0;
  transition: opacity var(--transition-base);
  
  .folder-header:hover & {
    opacity: 1;
  }
}

.folder-content {
  margin-left: var(--spacing-4);
}

.file {
  display: flex;
  align-items: center;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  
  &:hover {
    background-color: var(--color-background-hover);
  }
}

.file-icon {
  margin-right: var(--spacing-2);
}

.file-name {
  flex: 1;
  color: var(--color-text);
}

.file-date {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.discussion-container {
  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.create-post-button {
  padding: var(--spacing-2) var(--spacing-4);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.post-card {
  background-color: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-3);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--spacing-2);
  color: var(--color-text);
}

.post-tags {
  display: flex;
  gap: var(--spacing-1);
  margin-bottom: var(--spacing-2);
  flex-wrap: wrap;
  
  .tag {
    background-color: var(--color-surface);
    color: var(--color-text-secondary);
    padding: 2px 8px;
    border-radius: var(--border-radius-sm);
    font-size: 0.75rem;
  }
}

.post-content {
  color: var(--color-text);
  margin-bottom: var(--spacing-2);
  line-height: 1.5;
  white-space: pre-line;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  
  .author {
    font-weight: 500;
    color: var(--color-text);
  }
  
  .interactions {
    margin-left: auto;
    display: flex;
    gap: var(--spacing-2);
  }
}

.comments-section {
  margin-top: var(--spacing-3);
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-3);
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 0;
  overflow: hidden;
  
  &.show {
    opacity: 1;
    transform: translateY(0);
    max-height: 2000px; // Large enough to fit content
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.comment {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-2);
  opacity: 0;
  transform: translateY(10px);
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.08}s;
    }
  }
  
  .comments-section:not(.show) & {
    animation: slideOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    
    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{($i - 1) * 0.05}s;
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

.comment-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-1);
  
  .comment-author {
    font-weight: 500;
    color: var(--color-text);
  }
  
  .comment-date {
    font-size: 0.75rem;
    color: var(--color-text-secondary);
  }
}

.comment-content {
  color: var(--color-text);
  margin: 0;
  line-height: 1.4;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-1);
}

.add-comment {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  
  textarea {
    resize: vertical;
    min-height: 60px;
    padding: var(--spacing-2);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-input-background);
    color: var(--color-text);
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
  
  button {
    align-self: flex-end;
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .two-column-layout {
    flex-direction: column;
  }
  
  .column {
    &.left-column {
      width: 100%;
      height: 300px;
      border-right: none;
      border-bottom: 1px solid var(--color-border);
    }
    
    &.right-column {
      flex: 1;
    }
  }
}
</style>
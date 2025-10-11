<template>
  <div class="discuss-view">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">💬 讨论区</h1>
          <p class="page-description">与其他用户交流学习心得，分享题解和经验</p>
        </div>
        <div class="header-actions">
          <button @click="showNewPostModal = true" class="new-post-btn">
            <span class="btn-icon">✏️</span>
            发布新帖
          </button>
        </div>
      </div>
    </div>

    <!-- Filter and Search Section -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button 
          v-for="category in categories" 
          :key="category.key"
          class="filter-tab"
          :class="{ 'active': activeCategory === category.key }"
          @click="activeCategory = category.key"
        >
          <span class="tab-icon">{{ category.icon }}</span>
          {{ category.label }}
          <span class="tab-count">{{ category.count }}</span>
        </button>
      </div>
      
      <div class="search-and-sort">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索帖子..." 
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <select v-model="sortBy" class="sort-select">
          <option value="latest">最新回复</option>
          <option value="hot">热门讨论</option>
          <option value="created">发布时间</option>
          <option value="views">浏览量</option>
        </select>
      </div>
    </div>

    <!-- Posts List -->
    <div class="posts-section">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner">⏳</div>
        <div>加载中...</div>
      </div>
      
      <div v-else-if="filteredPosts.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-title">暂无讨论</div>
        <div class="empty-description">成为第一个发起讨论的人吧！</div>
        <button @click="showNewPostModal = true" class="empty-action-btn">发布新帖</button>
      </div>
      
      <div v-else class="posts-list">
        <div 
          v-for="post in paginatedPosts" 
          :key="post.id"
          class="post-item"
          @click="viewPost(post)"
        >
          <div class="post-avatar">
            <img :src="post.author.avatar" :alt="post.author.username" />
          </div>
          
          <div class="post-content">
            <div class="post-header">
              <div class="post-title-section">
                <h3 class="post-title">{{ post.title }}</h3>
                <div class="post-tags">
                  <span 
                    v-for="tag in post.tags" 
                    :key="tag"
                    class="post-tag"
                    :class="getTagClass(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="post-status">
                <span v-if="post.isPinned" class="pin-badge">📌 置顶</span>
                <span v-if="post.isSolved" class="solved-badge">✅ 已解决</span>
                <span v-if="post.isHot" class="hot-badge">🔥 热门</span>
              </div>
            </div>
            
            <div class="post-preview">{{ post.preview }}</div>
            
            <div class="post-meta">
              <div class="author-info">
                <span class="author-name">{{ post.author.username }}</span>
                <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                <span v-if="post.lastReplyAt" class="last-reply">
                  最后回复：{{ formatTime(post.lastReplyAt) }}
                </span>
              </div>
              
              <div class="post-stats">
                <span class="stat-item">
                  <span class="stat-icon">👁️</span>
                  {{ post.views }}
                </span>
                <span class="stat-item">
                  <span class="stat-icon">💬</span>
                  {{ post.replies }}
                </span>
                <span class="stat-item">
                  <span class="stat-icon">👍</span>
                  {{ post.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ‹ 上一页
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="typeof page === 'number' ? currentPage = page : null"
            class="page-number"
            :class="{ 'active': page === currentPage, 'disabled': typeof page === 'string' }"
            :disabled="typeof page === 'string'"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          下一页 ›
        </button>
      </div>
    </div>

    <!-- New Post Modal -->
    <div v-if="showNewPostModal" class="modal-overlay" @click="closeNewPostModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>发布新帖</h3>
          <button @click="showNewPostModal = false" class="close-btn">✕</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>标题</label>
            <input 
              v-model="newPost.title" 
              type="text" 
              placeholder="请输入帖子标题..." 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>分类</label>
            <select v-model="newPost.category" class="form-select">
              <option value="">选择分类</option>
              <option value="general">综合讨论</option>
              <option value="solution">题解分享</option>
              <option value="question">问题求助</option>
              <option value="algorithm">算法讨论</option>
              <option value="contest">比赛交流</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>标签</label>
            <div class="tags-input">
              <span 
                v-for="tag in newPost.tags" 
                :key="tag"
                class="tag-item"
              >
                {{ tag }}
                <button @click="removeTag(tag)" class="tag-remove">✕</button>
              </span>
              <input 
                v-model="newTagInput"
                @keydown.enter.prevent="addTag"
                @keydown.space.prevent="addTag"
                type="text" 
                placeholder="添加标签..." 
                class="tag-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>内容</label>
            <textarea 
              v-model="newPost.content" 
              placeholder="请输入帖子内容..." 
              class="form-textarea"
              rows="8"
            ></textarea>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showNewPostModal = false" class="cancel-btn">取消</button>
          <button @click="submitNewPost" class="submit-btn" :disabled="!canSubmit">
            {{ isSubmitting ? '发布中...' : '发布帖子' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Author {
  id: number
  username: string
  avatar: string
  level: string
}

interface Post {
  id: number
  title: string
  content: string
  preview: string
  author: Author
  category: string
  tags: string[]
  createdAt: string
  lastReplyAt?: string
  views: number
  replies: number
  likes: number
  isPinned: boolean
  isSolved: boolean
  isHot: boolean
}

interface Category {
  key: string
  label: string
  icon: string
  count: number
}

interface NewPost {
  title: string
  content: string
  category: string
  tags: string[]
}

// 状态管理
const activeCategory = ref('all')
const searchQuery = ref('')
const sortBy = ref('latest')
const currentPage = ref(1)
const pageSize = 10
const isLoading = ref(false)
const showNewPostModal = ref(false)
const isSubmitting = ref(false)
const newTagInput = ref('')

// 新帖表单
const newPost = ref<NewPost>({
  title: '',
  content: '',
  category: '',
  tags: []
})

// 分类数据
const categories: Category[] = [
  { key: 'all', label: '全部', icon: '📋', count: 156 },
  { key: 'general', label: '综合讨论', icon: '💭', count: 45 },
  { key: 'solution', label: '题解分享', icon: '💡', count: 38 },
  { key: 'question', label: '问题求助', icon: '❓', count: 29 },
  { key: 'algorithm', label: '算法讨论', icon: '🧮', count: 32 },
  { key: 'contest', label: '比赛交流', icon: '🏆', count: 12 }
]

// 模拟帖子数据
const allPosts = ref<Post[]>([
  {
    id: 1,
    title: '动态规划入门：从斐波那契数列到背包问题',
    content: '动态规划是算法竞赛中的重要思想...',
    preview: '动态规划是算法竞赛中的重要思想，本文将从最基础的斐波那契数列开始，逐步深入到背包问题的各种变形...',
    author: {
      id: 1,
      username: 'AlgoMaster',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlgoMaster',
      level: 'Expert'
    },
    category: 'algorithm',
    tags: ['动态规划', '背包问题', '入门教程'],
    createdAt: '2024-01-15T10:30:00Z',
    lastReplyAt: '2024-01-15T15:45:00Z',
    views: 1234,
    replies: 23,
    likes: 89,
    isPinned: true,
    isSolved: false,
    isHot: true
  },
  {
    id: 2,
    title: '求助：二叉树的层序遍历问题',
    content: '我在做LeetCode 102题时遇到了困难...',
    preview: '我在做LeetCode 102题时遇到了困难，代码总是在某些测试用例上出错，希望大家能帮忙看看...',
    author: {
      id: 2,
      username: 'CodeNewbie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNewbie',
      level: 'Beginner'
    },
    category: 'question',
    tags: ['二叉树', '层序遍历', '求助'],
    createdAt: '2024-01-14T14:20:00Z',
    lastReplyAt: '2024-01-15T09:15:00Z',
    views: 567,
    replies: 12,
    likes: 34,
    isPinned: false,
    isSolved: true,
    isHot: false
  },
  {
    id: 3,
    title: '分享一道有趣的字符串匹配题解',
    content: '今天遇到一道很有意思的字符串题目...',
    preview: '今天遇到一道很有意思的字符串题目，用KMP算法解决，时间复杂度O(n+m)，分享给大家...',
    author: {
      id: 3,
      username: 'StringExpert',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StringExpert',
      level: 'Advanced'
    },
    category: 'solution',
    tags: ['字符串', 'KMP', '题解'],
    createdAt: '2024-01-13T16:45:00Z',
    lastReplyAt: '2024-01-14T11:30:00Z',
    views: 892,
    replies: 18,
    likes: 67,
    isPinned: false,
    isSolved: false,
    isHot: true
  }
])

// 计算属性
const filteredPosts = computed(() => {
  let posts = [...allPosts.value]
  
  // 分类过滤
  if (activeCategory.value !== 'all') {
    posts = posts.filter(post => post.category === activeCategory.value)
  }
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 排序
  switch (sortBy.value) {
    case 'hot':
      posts.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies))
      break
    case 'created':
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'views':
      posts.sort((a, b) => b.views - a.views)
      break
    default: // latest
      posts.sort((a, b) => {
        const aTime = new Date(a.lastReplyAt || a.createdAt).getTime()
        const bTime = new Date(b.lastReplyAt || b.createdAt).getTime()
        return bTime - aTime
      })
  }
  
  // 置顶帖子排在前面
  posts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })
  
  return posts
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredPosts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

const canSubmit = computed(() => {
  return newPost.value.title.trim() && 
         newPost.value.content.trim() && 
         newPost.value.category &&
         !isSubmitting.value
})

// 方法
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '今天'
  if (diffDays === 2) return '昨天'
  if (diffDays <= 7) return `${diffDays}天前`
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays <= 365) return `${Math.floor(diffDays / 30)}个月前`
  return `${Math.floor(diffDays / 365)}年前`
}

const getTagClass = (tag: string) => {
  const tagClasses: { [key: string]: string } = {
    '动态规划': 'tag-algorithm',
    '背包问题': 'tag-algorithm',
    '入门教程': 'tag-tutorial',
    '二叉树': 'tag-data-structure',
    '层序遍历': 'tag-algorithm',
    '求助': 'tag-help',
    '字符串': 'tag-data-structure',
    'KMP': 'tag-algorithm',
    '题解': 'tag-solution'
  }
  return tagClasses[tag] || 'tag-default'
}

const viewPost = (post: Post) => {
  // 这里可以跳转到帖子详情页
  console.log('查看帖子:', post.title)
}

const addTag = () => {
  const tag = newTagInput.value.trim()
  if (tag && !newPost.value.tags.includes(tag) && newPost.value.tags.length < 5) {
    newPost.value.tags.push(tag)
    newTagInput.value = ''
  }
}

const removeTag = (tag: string) => {
  const index = newPost.value.tags.indexOf(tag)
  if (index > -1) {
    newPost.value.tags.splice(index, 1)
  }
}

const closeNewPostModal = () => {
  showNewPostModal.value = false
  // 重置表单
  newPost.value = {
    title: '',
    content: '',
    category: '',
    tags: []
  }
  newTagInput.value = ''
}

const submitNewPost = async () => {
  if (!canSubmit.value) return
  
  isSubmitting.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 添加新帖子到列表
    const newPostData: Post = {
      id: Date.now(),
      title: newPost.value.title,
      content: newPost.value.content,
      preview: newPost.value.content.substring(0, 100) + '...',
      author: {
        id: 999,
        username: '当前用户',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
        level: 'Intermediate'
      },
      category: newPost.value.category,
      tags: [...newPost.value.tags],
      createdAt: new Date().toISOString(),
      views: 0,
      replies: 0,
      likes: 0,
      isPinned: false,
      isSolved: false,
      isHot: false
    }
    
    allPosts.value.unshift(newPostData)
    closeNewPostModal()
    
    // 显示成功提示
    alert('帖子发布成功！')
  } catch {
    alert('发布失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 生成更多模拟数据
const generateMorePosts = () => {
  const titles = [
    '图论算法总结：从DFS到最短路径',
    '贪心算法的经典应用场景',
    '如何优化递归算法的时间复杂度？',
    '数据结构选择指南：何时用什么？',
    '分治算法在排序中的应用',
    '位运算技巧大全',
    '树形DP的入门与进阶',
    '字符串算法专题讨论',
    '数学在算法中的重要性',
    '如何准备算法面试？'
  ]
  
  const categories = ['general', 'solution', 'question', 'algorithm', 'contest']
  const tagSets = [
    ['图论', 'DFS', 'BFS'],
    ['贪心', '优化', '算法'],
    ['递归', '动态规划', '优化'],
    ['数据结构', '选择', '指南'],
    ['分治', '排序', '算法'],
    ['位运算', '技巧', '优化'],
    ['树形DP', '动态规划', '进阶'],
    ['字符串', '算法', '专题'],
    ['数学', '算法', '基础'],
    ['面试', '算法', '准备']
  ]
  
  for (let i = 0; i < 20; i++) {
    const title = titles[i % titles.length]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const tags = tagSets[i % tagSets.length]
    
    allPosts.value.push({
      id: 100 + i,
      title: `${title} ${i + 1}`,
      content: `这是关于${title}的详细讨论内容...`,
      preview: `这是关于${title}的详细讨论内容，包含了相关的算法思路和实现细节...`,
      author: {
        id: 100 + i,
        username: `User${(100 + i).toString().padStart(3, '0')}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=User${100 + i}`,
        level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'][Math.floor(Math.random() * 4)]
      },
      category,
      tags,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastReplyAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      views: Math.floor(Math.random() * 1000) + 50,
      replies: Math.floor(Math.random() * 50),
      likes: Math.floor(Math.random() * 100),
      isPinned: false,
      isSolved: Math.random() > 0.7,
      isHot: Math.random() > 0.8
    })
  }
}

onMounted(() => {
  generateMorePosts()
})
</script>

<style scoped>
.discuss-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.new-post-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.new-post-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

/* Filter Section */
.filter-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.filter-tab.active {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.tab-icon {
  font-size: 1rem;
}

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.search-and-sort {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-input:focus {
  outline: none;
  border-color: #4facfe;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
}

.sort-select {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sort-select:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.sort-select option {
  background: #2c3e50;
  color: white;
}

/* Posts Section */
.posts-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: white;
}

.empty-description {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-action-btn {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

/* Posts List */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-item {
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.post-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.post-avatar {
  flex-shrink: 0;
}

.post-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.post-title-section {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-tag {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.tag-algorithm {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
}

.tag-tutorial {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
}

.tag-data-structure {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
}

.tag-help {
  background: linear-gradient(135deg, #ff8a80, #ff5722);
}

.tag-solution {
  background: linear-gradient(135deg, #81c784, #4caf50);
}

.tag-default {
  background: linear-gradient(135deg, #90a4ae, #607d8b);
}

.post-status {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.pin-badge, .solved-badge, .hot-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.pin-badge {
  background: linear-gradient(135deg, #ffd54f, #ff8f00);
}

.solved-badge {
  background: linear-gradient(135deg, #81c784, #4caf50);
}

.hot-badge {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.post-preview {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.author-name {
  color: white;
  font-weight: 600;
}

.post-time, .last-reply {
  color: rgba(255, 255, 255, 0.6);
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.stat-icon {
  font-size: 0.9rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.page-btn, .page-number {
  padding: 0.5rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.page-btn:hover:not(:disabled), .page-number:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  border-color: transparent;
}

.page-number.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input::placeholder, .form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #4facfe;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.2);
}

.form-select option {
  background: #2c3e50;
  color: white;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  min-height: 2.5rem;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tag-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.tag-remove:hover {
  opacity: 1;
}

.tag-input {
  flex: 1;
  min-width: 120px;
  background: none;
  border: none;
  color: white;
  font-size: 0.9rem;
  outline: none;
}

.tag-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.submit-btn {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .discuss-view {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .page-title {
    font-size: 2rem;
  }

  .filter-tabs {
    justify-content: center;
  }

  .search-and-sort {
    flex-direction: column;
    gap: 1rem;
  }

  .search-box {
    max-width: none;
  }

  .post-item {
    flex-direction: column;
    gap: 1rem;
  }

  .post-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .post-meta {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .author-info {
    flex-wrap: wrap;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-footer {
    flex-direction: column;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .filter-tabs {
    gap: 0.25rem;
  }

  .filter-tab {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .post-title {
    font-size: 1rem;
  }

  .post-tags {
    gap: 0.25rem;
  }

  .post-tag {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
  }
}
</style>

<style scoped>
.discuss-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.discuss-content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #666;
}
</style>
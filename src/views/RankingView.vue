<template>
  <div class="ranking-view">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">🏆 排行榜</h1>
          <p class="page-description">查看用户排名和积分统计</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-value">{{ totalUsers.toLocaleString() }}</div>
            <div class="stat-label">总用户数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ activeSolvers.toLocaleString() }}</div>
            <div class="stat-label">活跃解题者</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="filter-section">
      <div class="filter-tabs">
        <button 
          v-for="tab in rankingTabs" 
          :key="tab.key"
          class="filter-tab"
          :class="{ 'active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>
      
      <div class="filter-controls">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索用户..." 
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        
        <select v-model="timeRange" class="time-select">
          <option value="all">全部时间</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="year">今年</option>
        </select>
        
        <button @click="refreshRanking" class="refresh-btn" :disabled="isLoading">
          <span class="refresh-icon" :class="{ 'spinning': isLoading }">🔄</span>
          刷新
        </button>
      </div>
    </div>

    <!-- Top 3 Podium -->
    <div v-if="activeTab === 'overall'" class="podium-section">
      <div class="podium">
        <!-- Second Place -->
        <div v-if="topUsers[1]" class="podium-item second">
          <div class="podium-rank">2</div>
          <div class="user-avatar">
            <img :src="topUsers[1].avatar" :alt="topUsers[1].username" />
          </div>
          <div class="user-info">
            <div class="username">{{ topUsers[1].username }}</div>
            <div class="user-score">{{ topUsers[1].score }} 分</div>
          </div>
        </div>
        
        <!-- First Place -->
        <div v-if="topUsers[0]" class="podium-item first">
          <div class="crown">👑</div>
          <div class="podium-rank">1</div>
          <div class="user-avatar">
            <img :src="topUsers[0].avatar" :alt="topUsers[0].username" />
          </div>
          <div class="user-info">
            <div class="username">{{ topUsers[0].username }}</div>
            <div class="user-score">{{ topUsers[0].score }} 分</div>
          </div>
        </div>
        
        <!-- Third Place -->
        <div v-if="topUsers[2]" class="podium-item third">
          <div class="podium-rank">3</div>
          <div class="user-avatar">
            <img :src="topUsers[2].avatar" :alt="topUsers[2].username" />
          </div>
          <div class="user-info">
            <div class="username">{{ topUsers[2].username }}</div>
            <div class="user-score">{{ topUsers[2].score }} 分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ranking Table -->
    <div class="ranking-table-section">
      <div class="table-header">
        <h3>{{ getCurrentTabLabel() }}</h3>
        <div class="table-info">
          共 {{ filteredUsers.length }} 位用户
        </div>
      </div>
      
      <div class="ranking-table">
        <div class="table-header-row">
          <div class="col-rank">排名</div>
          <div class="col-user">用户</div>
          <div class="col-score">{{ getScoreLabel() }}</div>
          <div class="col-solved">解题数</div>
          <div class="col-rate">通过率</div>
          <div class="col-level">等级</div>
          <div class="col-trend">趋势</div>
        </div>
        
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner">⏳</div>
          <div>加载中...</div>
        </div>
        
        <div v-else-if="filteredUsers.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <div>未找到匹配的用户</div>
        </div>
        
        <div v-else class="table-body">
           <div 
             v-for="user in paginatedUsers" 
             :key="user.id"
             class="table-row"
             :class="{ 'highlight': user.isCurrentUser }"
           >
            <div class="col-rank">
              <div class="rank-badge" :class="getRankClass(user.rank)">
                {{ user.rank }}
              </div>
              <div v-if="user.rankChange" class="rank-change" :class="user.rankChange > 0 ? 'up' : 'down'">
                {{ user.rankChange > 0 ? '↗' : '↘' }} {{ Math.abs(user.rankChange) }}
              </div>
            </div>
            
            <div class="col-user">
              <div class="user-card">
                <img :src="user.avatar" :alt="user.username" class="user-avatar-small" />
                <div class="user-details">
                  <div class="username">{{ user.username }}</div>
                  <div class="user-meta">
                    <span class="join-date">{{ formatJoinDate(user.joinDate) }}</span>
                    <span v-if="user.location" class="location">📍 {{ user.location }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-score">
              <div class="score-value">{{ user.score.toLocaleString() }}</div>
              <div v-if="user.scoreChange" class="score-change" :class="user.scoreChange > 0 ? 'positive' : 'negative'">
                {{ user.scoreChange > 0 ? '+' : '' }}{{ user.scoreChange }}
              </div>
            </div>
            
            <div class="col-solved">
              <div class="solved-stats">
                <div class="solved-count">{{ user.solvedCount }}</div>
                <div class="difficulty-breakdown">
                  <span class="easy">{{ user.easySolved }}</span>
                  <span class="medium">{{ user.mediumSolved }}</span>
                  <span class="hard">{{ user.hardSolved }}</span>
                </div>
              </div>
            </div>
            
            <div class="col-rate">
              <div class="rate-value">{{ (user.acceptanceRate * 100).toFixed(1) }}%</div>
              <div class="rate-bar">
                <div class="rate-fill" :style="{ width: (user.acceptanceRate * 100) + '%' }"></div>
              </div>
            </div>
            
            <div class="col-level">
              <div class="level-badge" :class="user.level.toLowerCase()">
                {{ user.level }}
              </div>
            </div>
            
            <div class="col-trend">
              <div class="trend-chart">
                <svg width="60" height="30" viewBox="0 0 60 30">
                  <polyline 
                    :points="generateTrendPoints(user.trendData)" 
                    fill="none" 
                    stroke="#1890ff" 
                    stroke-width="2"
                  />
                </svg>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface User {
  id: number
  username: string
  avatar: string
  score: number
  solvedCount: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  acceptanceRate: number
  level: string
  rank: number
  rankChange?: number
  scoreChange?: number
  joinDate: string
  location?: string
  isCurrentUser?: boolean
  trendData: number[]
}

interface RankingTab {
  key: string
  label: string
  icon: string
}

// 状态管理
const activeTab = ref('overall')
const searchQuery = ref('')
const timeRange = ref('all')
const currentPage = ref(1)
const pageSize = 20
const isLoading = ref(false)

// 排行榜类型
const rankingTabs: RankingTab[] = [
  { key: 'overall', label: '综合排名', icon: '🏆' },
  { key: 'weekly', label: '周榜', icon: '📅' },
  { key: 'monthly', label: '月榜', icon: '📊' },
  { key: 'newbie', label: '新手榜', icon: '🌟' }
]

// 模拟数据
const totalUsers = ref(15420)
const activeSolvers = ref(8932)

const allUsers = ref<User[]>([
  {
    id: 1,
    username: 'CodeMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
    score: 2850,
    solvedCount: 342,
    easySolved: 156,
    mediumSolved: 142,
    hardSolved: 44,
    acceptanceRate: 0.89,
    level: 'Expert',
    rank: 1,
    rankChange: 2,
    scoreChange: 45,
    joinDate: '2023-01-15',
    location: '北京',
    trendData: [20, 35, 45, 40, 55, 60, 65]
  },
  {
    id: 2,
    username: 'AlgoWizard',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlgoWizard',
    score: 2720,
    solvedCount: 298,
    easySolved: 134,
    mediumSolved: 128,
    hardSolved: 36,
    acceptanceRate: 0.92,
    level: 'Expert',
    rank: 2,
    rankChange: -1,
    scoreChange: 23,
    joinDate: '2023-02-20',
    location: '上海',
    trendData: [15, 25, 40, 35, 50, 55, 58]
  },
  {
    id: 3,
    username: 'DataNinja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataNinja',
    score: 2680,
    solvedCount: 276,
    easySolved: 128,
    mediumSolved: 118,
    hardSolved: 30,
    acceptanceRate: 0.87,
    level: 'Advanced',
    rank: 3,
    rankChange: 1,
    scoreChange: 18,
    joinDate: '2023-03-10',
    location: '深圳',
    trendData: [10, 20, 30, 45, 40, 50, 52]
  },
  {
    id: 4,
    username: 'PyThonista',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PyThonista',
    score: 2540,
    solvedCount: 245,
    easySolved: 115,
    mediumSolved: 105,
    hardSolved: 25,
    acceptanceRate: 0.85,
    level: 'Advanced',
    rank: 4,
    scoreChange: 12,
    joinDate: '2023-04-05',
    location: '杭州',
    trendData: [8, 18, 25, 35, 38, 45, 48]
  },
  {
    id: 5,
    username: 'JSGuru',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JSGuru',
    score: 2420,
    solvedCount: 228,
    easySolved: 108,
    mediumSolved: 98,
    hardSolved: 22,
    acceptanceRate: 0.83,
    level: 'Advanced',
    rank: 5,
    rankChange: -2,
    scoreChange: -5,
    joinDate: '2023-05-12',
    trendData: [12, 22, 28, 32, 35, 42, 44]
  }
])

// 计算属性
const topUsers = computed(() => allUsers.value.slice(0, 3))

const filteredUsers = computed(() => {
  let users = [...allUsers.value]
  
  // 搜索过滤
  if (searchQuery.value) {
    users = users.filter(user => 
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  // 根据标签页过滤和排序
  switch (activeTab.value) {
    case 'weekly':
      users = users.filter(user => user.scoreChange && user.scoreChange > 0)
      users.sort((a, b) => (b.scoreChange || 0) - (a.scoreChange || 0))
      break
    case 'monthly':
      users.sort((a, b) => b.score - a.score)
      break
    case 'newbie':
      users = users.filter(user => user.level === 'Beginner' || user.solvedCount < 50)
      break
    default:
      users.sort((a, b) => a.rank - b.rank)
  }
  
  return users
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredUsers.value.slice(start, end)
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

// 方法
const getCurrentTabLabel = () => {
  const tab = rankingTabs.find(t => t.key === activeTab.value)
  return tab ? tab.label : '排行榜'
}

const getScoreLabel = () => {
  switch (activeTab.value) {
    case 'weekly': return '周积分'
    case 'monthly': return '月积分'
    default: return '总积分'
  }
}

const getRankClass = (rank: number) => {
  if (rank === 1) return 'gold'
  if (rank === 2) return 'silver'
  if (rank === 3) return 'bronze'
  if (rank <= 10) return 'top10'
  return ''
}

const formatJoinDate = (date: string) => {
  const joinDate = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - joinDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) return `${diffDays}天前加入`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前加入`
  return `${Math.floor(diffDays / 365)}年前加入`
}

const generateTrendPoints = (data: number[]) => {
  const width = 60
  const height = 30
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - (value / Math.max(...data)) * height
    return `${x},${y}`
  })
  return points.join(' ')
}

const refreshRanking = async () => {
  isLoading.value = true
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
}

// 生成更多模拟数据
const generateMoreUsers = () => {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
  const locations = ['北京', '上海', '深圳', '杭州', '广州', '成都', '武汉', '西安']
  
  for (let i = 6; i <= 100; i++) {
    const username = `User${i.toString().padStart(3, '0')}`
    const level = levels[Math.floor(Math.random() * levels.length)]
    const solvedCount = Math.floor(Math.random() * 200) + 10
    const score = solvedCount * (8 + Math.random() * 12)
    
    allUsers.value.push({
      id: i,
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      score: Math.floor(score),
      solvedCount,
      easySolved: Math.floor(solvedCount * 0.5),
      mediumSolved: Math.floor(solvedCount * 0.35),
      hardSolved: Math.floor(solvedCount * 0.15),
      acceptanceRate: 0.6 + Math.random() * 0.3,
      level,
      rank: i,
      rankChange: Math.random() > 0.5 ? Math.floor(Math.random() * 5) - 2 : undefined,
      scoreChange: Math.random() > 0.3 ? Math.floor(Math.random() * 20) - 5 : undefined,
      joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      location: Math.random() > 0.3 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
      trendData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50) + 10)
    })
  }
}

onMounted(() => {
   generateMoreUsers()
 })
 </script>

<style scoped>
.ranking-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

/* Page Header */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 0 2rem 2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section .page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.title-section .page-description {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

/* Filter Section */
.filter-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  margin: 0 2rem 2rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  background: white;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tab:hover {
  border-color: #3498db;
  color: #3498db;
  transform: translateY(-2px);
}

.filter-tab.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.time-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-select:focus {
  outline: none;
  border-color: #3498db;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Podium Section */
.podium-section {
  margin: 0 2rem 2rem;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s ease;
}

.podium-item:hover {
  transform: translateY(-5px);
}

.podium-item.first {
  order: 2;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  transform: scale(1.1);
}

.podium-item.second {
  order: 1;
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
}

.podium-item.third {
  order: 3;
  background: linear-gradient(135deg, #cd7f32, #daa520);
}

.crown {
  position: absolute;
  top: -1rem;
  font-size: 2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.podium-rank {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.podium-item .user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.podium-item .user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.podium-item .user-info {
  text-align: center;
}

.podium-item .username {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.podium-item .user-score {
  font-size: 1rem;
  color: #7f8c8d;
  font-weight: 500;
}

/* Ranking Table Section */
.ranking-table-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin: 0 2rem;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.table-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.table-info {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* Ranking Table */
.ranking-table {
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.table-header-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 120px 120px 100px 100px;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #e9ecef;
}

.table-body {
  background: white;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 120px 120px 100px 100px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  transition: all 0.3s ease;
  align-items: center;
}

.table-row:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.table-row.highlight {
  background: linear-gradient(90deg, rgba(52, 152, 219, 0.1), rgba(52, 152, 219, 0.05));
  border-left: 4px solid #3498db;
}

/* Column Styles */
.col-rank {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  background: #6c757d;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #2c3e50;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

.rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
  color: #2c3e50;
  box-shadow: 0 4px 15px rgba(192, 192, 192, 0.4);
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #daa520);
  color: white;
  box-shadow: 0 4px 15px rgba(205, 127, 50, 0.4);
}

.rank-badge.top10 {
  background: linear-gradient(135deg, #3498db, #2980b9);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.rank-change {
  font-size: 0.75rem;
  font-weight: 500;
}

.rank-change.up {
  color: #28a745;
}

.rank-change.down {
  color: #dc3545;
}

.col-user {
  min-width: 0;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-details {
  min-width: 0;
  flex: 1;
}

.username {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.col-score {
  text-align: center;
}

.score-value {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.score-change {
  font-size: 0.8rem;
  font-weight: 500;
}

.score-change.positive {
  color: #28a745;
}

.score-change.negative {
  color: #dc3545;
}

.col-solved {
  text-align: center;
}

.solved-count {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.difficulty-breakdown {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  font-size: 0.8rem;
}

.difficulty-breakdown .easy {
  color: #28a745;
  font-weight: 500;
}

.difficulty-breakdown .medium {
  color: #ffc107;
  font-weight: 500;
}

.difficulty-breakdown .hard {
  color: #dc3545;
  font-weight: 500;
}

.col-rate {
  text-align: center;
}

.rate-value {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.rate-bar {
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  transition: width 0.3s ease;
}

.col-level {
  text-align: center;
}

.level-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.level-badge.beginner {
  background: #e3f2fd;
  color: #1976d2;
}

.level-badge.intermediate {
  background: #fff3e0;
  color: #f57c00;
}

.level-badge.advanced {
  background: #f3e5f5;
  color: #7b1fa2;
}

.level-badge.expert {
  background: #ffebee;
  color: #c62828;
}

.col-trend {
  text-align: center;
}

.trend-chart svg {
  border-radius: 5px;
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #7f8c8d;
}

.loading-spinner,
.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
}

.page-btn,
.page-number {
  padding: 0.5rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled),
.page-number:hover:not(:disabled):not(.disabled) {
  border-color: #3498db;
  color: #3498db;
  transform: translateY(-2px);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background: #3498db;
  border-color: #3498db;
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.page-number.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .header-stats {
    justify-content: center;
  }
  
  .table-header-row,
  .table-row {
    grid-template-columns: 60px 1fr 100px 100px 80px 80px 80px;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  
  .podium {
    flex-direction: column;
    align-items: center;
  }
  
  .podium-item.first {
    order: 1;
  }
  
  .podium-item.second {
    order: 2;
  }
  
  .podium-item.third {
    order: 3;
  }
}

@media (max-width: 768px) {
  .ranking-view {
    padding: 1rem 0;
  }
  
  .page-header,
  .filter-section,
  .ranking-table-section {
    margin: 0 1rem 1rem;
    padding: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .table-header-row,
  .table-row {
    grid-template-columns: 50px 1fr 80px 60px;
    gap: 0.5rem;
  }
  
  .col-rate,
  .col-level,
  .col-trend {
    display: none;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .page-numbers {
    order: 2;
    width: 100%;
    justify-content: center;
    margin: 0.5rem 0;
  }
}
</style>

<style scoped>
.ranking-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

.ranking-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.coming-soon {
  padding: 60px 40px;
  text-align: center;
}

.icon {
  font-size: 64px;
  margin-bottom: 24px;
  display: block;
}

.coming-soon h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.coming-soon p {
  color: #666;
  font-size: 16px;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.feature-text {
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  text-align: center;
}

/* Enhanced Responsive Design */
/* Large Desktop */
@media (min-width: 1400px) {
  .ranking-view {
    max-width: 1400px;
    padding: 0 40px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-description {
    font-size: 18px;
  }
  
  .coming-soon {
    padding: 80px 60px;
  }
  
  .icon {
    font-size: 80px;
  }
  
  .coming-soon h3 {
    font-size: 28px;
  }
  
  .coming-soon p {
    font-size: 18px;
  }
  
  .features {
    gap: 32px;
  }
  
  .feature-item {
    padding: 24px;
  }
}

/* Desktop */
@media (max-width: 1200px) {
  .ranking-view {
    padding: 0 24px;
  }
  
  .coming-soon {
    padding: 50px 32px;
  }
  
  .features {
    gap: 20px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .ranking-view {
    padding: 0 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-description {
    font-size: 14px;
  }
  
  .coming-soon {
    padding: 40px 24px;
  }
  
  .icon {
    font-size: 56px;
  }
  
  .coming-soon h3 {
    font-size: 22px;
  }
  
  .coming-soon p {
    font-size: 15px;
  }
  
  .features {
    gap: 16px;
  }
  
  .feature-item {
    padding: 16px;
  }
}

/* Mobile Large */
@media (max-width: 768px) {
  .ranking-view {
    padding: 0 16px;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .coming-soon {
    padding: 32px 20px;
  }
  
  .icon {
    font-size: 48px;
    margin-bottom: 20px;
  }
  
  .coming-soon h3 {
    font-size: 20px;
  }
  
  .coming-soon p {
    font-size: 14px;
    margin-bottom: 32px;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 400px;
  }
  
  .feature-item {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    padding: 12px 16px;
  }
  
  .feature-text {
    font-size: 13px;
  }
}

/* Mobile Small */
@media (max-width: 480px) {
  .ranking-view {
    padding: 0 12px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-description {
    font-size: 13px;
  }
  
  .coming-soon {
    padding: 24px 16px;
  }
  
  .icon {
    font-size: 40px;
    margin-bottom: 16px;
  }
  
  .coming-soon h3 {
    font-size: 18px;
  }
  
  .coming-soon p {
    font-size: 13px;
    margin-bottom: 24px;
  }
  
  .features {
    gap: 8px;
  }
  
  .feature-item {
    padding: 10px 12px;
  }
  
  .feature-text {
    font-size: 12px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .ranking-view {
    padding: 0 8px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .coming-soon {
    padding: 20px 12px;
  }
  
  .icon {
    font-size: 36px;
  }
  
  .coming-soon h3 {
    font-size: 16px;
  }
  
  .coming-soon p {
    font-size: 12px;
  }
}
</style>
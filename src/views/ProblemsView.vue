<template>
  <div class="problems-view">
    <div class="page-header">
      <h1 class="page-title">题库</h1>
      <p class="page-description">在这里你可以浏览和练习各种算法题目</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filters-section">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索题目标题或标签..."
          class="search-input"
        />
        <button class="search-btn">🔍</button>
      </div>
      
      <div class="filter-tags">
        <span class="filter-label">难度:</span>
        <button 
          v-for="difficulty in difficulties" 
          :key="difficulty.value"
          :class="['tag-btn', { 'active': selectedDifficulty === difficulty.value }]"
          @click="selectedDifficulty = difficulty.value"
        >
          {{ difficulty.label }}
        </button>
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="problems-list">
      <div class="list-header">
        <div class="col-status">状态</div>
        <div class="col-title">题目</div>
        <div class="col-difficulty">难度</div>
        <div class="col-acceptance">通过率</div>
        <div class="col-tags">标签</div>
      </div>
      
      <div 
        v-for="problem in filteredProblems" 
        :key="problem.id"
        class="problem-item"
        @click="goToProblem(problem.id)"
      >
        <div class="col-status">
          <span :class="['status-icon', problem.status]">{{ getStatusIcon(problem.status) }}</span>
        </div>
        <div class="col-title">
          <span class="problem-id">#{{ problem.id }}</span>
          <span class="problem-title">{{ problem.title }}</span>
        </div>
        <div class="col-difficulty">
          <span :class="['difficulty-tag', problem.difficulty]">{{ problem.difficulty }}</span>
        </div>
        <div class="col-acceptance">
          {{ problem.acceptanceRate }}%
        </div>
        <div class="col-tags">
          <span 
            v-for="tag in problem.tags.slice(0, 3)" 
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
          <span v-if="problem.tags.length > 3" class="tag-more">+{{ problem.tags.length - 3 }}</span>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button class="page-btn" :disabled="currentPage === 1">上一页</button>
      <span class="page-info">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
      <button class="page-btn" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'solved' | 'attempted' | 'unsolved'
  acceptanceRate: number
  tags: string[]
}

const router = useRouter()

// 搜索和筛选状态
const searchQuery = ref('')
const selectedDifficulty = ref('all')
const currentPage = ref(1)
const pageSize = 20

// 难度选项
const difficulties = [
  { label: '全部', value: 'all' },
  { label: '简单', value: 'easy' },
  { label: '中等', value: 'medium' },
  { label: '困难', value: 'hard' }
]

// 模拟题目数据
const problems = ref<Problem[]>([
  {
    id: 1,
    title: '两数之和',
    difficulty: 'easy',
    status: 'solved',
    acceptanceRate: 85.2,
    tags: ['数组', '哈希表']
  },
  {
    id: 2,
    title: '链表反转',
    difficulty: 'medium',
    status: 'attempted',
    acceptanceRate: 67.8,
    tags: ['链表', '递归']
  },
  {
    id: 3,
    title: '最长公共子序列',
    difficulty: 'hard',
    status: 'unsolved',
    acceptanceRate: 45.3,
    tags: ['动态规划', '字符串']
  },
  // 更多模拟数据...
])

// 筛选后的题目
const filteredProblems = computed(() => {
  let filtered = problems.value
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 按难度筛选
  if (selectedDifficulty.value !== 'all') {
    filtered = filtered.filter(p => p.difficulty === selectedDifficulty.value)
  }
  
  return filtered
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredProblems.value.length / pageSize)
})

// 获取状态图标
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'solved': return '✅'
    case 'attempted': return '❌'
    default: return '⭕'
  }
}

// 跳转到题目详情
const goToProblem = (id: number) => {
  router.push(`/problems/${id}`)
}
</script>

<style scoped>
.problems-view {
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

.filters-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.search-box {
  display: flex;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}

.search-btn {
  padding: 10px 16px;
  background: #1890ff;
  color: white;
  border: 1px solid #1890ff;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.filter-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 500;
  color: #666;
}

.tag-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-btn:hover,
.tag-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.problems-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.list-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 200px;
  gap: 16px;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  color: #666;
}

.problem-item {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 200px;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.problem-item:hover {
  background-color: #f8f9fa;
}

.problem-item:last-child {
  border-bottom: none;
}

.col-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon {
  font-size: 18px;
}

.col-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.problem-id {
  color: #999;
  font-weight: 500;
}

.problem-title {
  color: #333;
  font-weight: 500;
}

.col-difficulty {
  display: flex;
  align-items: center;
}

.difficulty-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.difficulty-tag.easy {
  background: #f6ffed;
  color: #52c41a;
}

.difficulty-tag.medium {
  background: #fff7e6;
  color: #fa8c16;
}

.difficulty-tag.hard {
  background: #fff2f0;
  color: #ff4d4f;
}

.col-acceptance {
  display: flex;
  align-items: center;
  color: #666;
}

.col-tags {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 6px;
  background: #f0f0f0;
  border-radius: 3px;
  font-size: 12px;
  color: #666;
}

.tag-more {
  color: #999;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

@media (max-width: 768px) {
  .list-header,
  .problem-item {
    grid-template-columns: 60px 1fr 80px;
    gap: 8px;
  }
  
  .col-acceptance,
  .col-tags {
    display: none;
  }
}
</style>
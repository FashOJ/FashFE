<template>
  <div class="contest-detail-view">
    <!-- 比赛头部信息 -->
    <div class="contest-header">
      <div class="contest-info">
        <div class="contest-title-section">
          <h1 class="contest-title">{{ contest.title }}</h1>
          <div class="contest-badges">
            <span class="contest-type" :class="contest.type">{{ getTypeText(contest.type) }}</span>
            <span class="contest-status" :class="contest.status">{{ getStatusText(contest.status) }}</span>
            <span class="difficulty-badge" :class="contest.difficulty">{{ contest.difficulty }}</span>
          </div>
        </div>
        
        <div class="contest-meta">
          <div class="meta-item">
            <span class="meta-icon">⏰</span>
            <div class="meta-content">
              <div class="meta-label">比赛时间</div>
              <div class="meta-value">{{ formatDateTime(contest.startTime) }} - {{ formatDateTime(contest.endTime) }}</div>
            </div>
          </div>
          <div class="meta-item">
            <span class="meta-icon">⏱️</span>
            <div class="meta-content">
              <div class="meta-label">比赛时长</div>
              <div class="meta-value">{{ contest.duration }}</div>
            </div>
          </div>
          <div class="meta-item">
            <span class="meta-icon">👥</span>
            <div class="meta-content">
              <div class="meta-label">参赛人数</div>
              <div class="meta-value">{{ contest.participants }}</div>
            </div>
          </div>
          <div class="meta-item">
            <span class="meta-icon">🏆</span>
            <div class="meta-content">
              <div class="meta-label">奖励积分</div>
              <div class="meta-value">{{ contest.reward }}</div>
            </div>
          </div>
        </div>

        <div class="contest-description">
          <h3>比赛说明</h3>
          <p>{{ contest.description }}</p>
        </div>

        <div class="contest-actions">
          <button 
            v-if="contest.status === 'upcoming'"
            @click="registerContest"
            class="action-btn register-btn"
            :disabled="isRegistered"
          >
            {{ isRegistered ? '已报名' : '报名参赛' }}
          </button>
          <button 
            v-if="contest.status === 'ongoing'"
            @click="enterContest"
            class="action-btn enter-btn"
          >
            进入比赛
          </button>
          <button 
            v-if="contest.status === 'ended'"
            @click="viewResults"
            class="action-btn results-btn"
          >
            查看结果
          </button>
          <RouterLink to="/contests" class="action-btn back-btn">返回列表</RouterLink>
        </div>
      </div>

      <!-- 倒计时 -->
      <div v-if="contest.status !== 'ended'" class="countdown-section">
        <div class="countdown-title">
          {{ contest.status === 'upcoming' ? '距离开始' : '距离结束' }}
        </div>
        <div class="countdown-timer">
          <div class="time-unit">
            <span class="time-value">{{ countdown.days }}</span>
            <span class="time-label">天</span>
          </div>
          <div class="time-unit">
            <span class="time-value">{{ countdown.hours }}</span>
            <span class="time-label">时</span>
          </div>
          <div class="time-unit">
            <span class="time-value">{{ countdown.minutes }}</span>
            <span class="time-label">分</span>
          </div>
          <div class="time-unit">
            <span class="time-value">{{ countdown.seconds }}</span>
            <span class="time-label">秒</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tab-navigation">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="activeTab = tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
      </button>
    </div>

    <!-- 标签页内容 -->
    <div class="tab-content">
      <!-- 题目列表 -->
      <div v-if="activeTab === 'problems'" class="problems-tab">
        <div class="problems-header">
          <h3>题目列表 ({{ problems.length }})</h3>
          <div class="problems-stats">
            <span class="stat-item">
              <span class="stat-icon">✅</span>
              已解决: {{ solvedCount }}
            </span>
            <span class="stat-item">
              <span class="stat-icon">⏳</span>
              尝试中: {{ attemptedCount }}
            </span>
          </div>
        </div>

        <div class="problems-list">
          <div 
            v-for="problem in problems" 
            :key="problem.id"
            class="problem-item"
            :class="{ 
              solved: problem.status === 'solved',
              attempted: problem.status === 'attempted'
            }"
          >
            <div class="problem-info">
              <div class="problem-header">
                <span class="problem-id">{{ problem.id }}</span>
                <h4 class="problem-title">{{ problem.title }}</h4>
                <span class="problem-difficulty" :class="problem.difficulty">
                  {{ problem.difficulty }}
                </span>
              </div>
              <div class="problem-meta">
                <span class="problem-score">{{ problem.score }}分</span>
                <span class="problem-solved">{{ problem.solvedCount }}人解决</span>
                <span class="problem-rate">通过率: {{ problem.acceptanceRate }}%</span>
              </div>
            </div>
            <div class="problem-status">
              <span v-if="problem.status === 'solved'" class="status-icon solved">✅</span>
              <span v-else-if="problem.status === 'attempted'" class="status-icon attempted">⏳</span>
              <span v-else class="status-icon unsolved">⭕</span>
            </div>
            <div class="problem-actions">
              <button 
                @click="solveProblem(problem.id)"
                class="solve-btn"
                :disabled="contest.status !== 'ongoing'"
              >
                {{ problem.status === 'solved' ? '查看' : '解题' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 实时排名 -->
      <div v-if="activeTab === 'ranking'" class="ranking-tab">
        <div class="ranking-header">
          <h3>实时排名</h3>
          <div class="ranking-controls">
            <button @click="refreshRanking" class="refresh-btn">
              <span class="refresh-icon">🔄</span>
              刷新
            </button>
            <div class="ranking-filter">
              <select v-model="rankingFilter" class="filter-select">
                <option value="all">全部参赛者</option>
                <option value="friends">好友</option>
                <option value="school">同校</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 前三名颁奖台 -->
        <div class="podium-section" v-if="ranking.length >= 3">
          <div class="podium">
            <div class="podium-place second">
              <div class="podium-user">
                <img :src="ranking[1].avatar" :alt="ranking[1].username" class="podium-avatar">
                <div class="podium-info">
                  <div class="podium-name">{{ ranking[1].username }}</div>
                  <div class="podium-score">{{ ranking[1].score }}分</div>
                </div>
              </div>
              <div class="podium-rank">2</div>
            </div>
            <div class="podium-place first">
              <div class="podium-crown">👑</div>
              <div class="podium-user">
                <img :src="ranking[0].avatar" :alt="ranking[0].username" class="podium-avatar">
                <div class="podium-info">
                  <div class="podium-name">{{ ranking[0].username }}</div>
                  <div class="podium-score">{{ ranking[0].score }}分</div>
                </div>
              </div>
              <div class="podium-rank">1</div>
            </div>
            <div class="podium-place third">
              <div class="podium-user">
                <img :src="ranking[2].avatar" :alt="ranking[2].username" class="podium-avatar">
                <div class="podium-info">
                  <div class="podium-name">{{ ranking[2].username }}</div>
                  <div class="podium-score">{{ ranking[2].score }}分</div>
                </div>
              </div>
              <div class="podium-rank">3</div>
            </div>
          </div>
        </div>

        <!-- 排名表格 -->
        <div class="ranking-table">
          <div class="table-header">
            <div class="col-rank">排名</div>
            <div class="col-user">用户</div>
            <div class="col-score">总分</div>
            <div class="col-solved">解题数</div>
            <div class="col-penalty">罚时</div>
            <div class="col-last">最后提交</div>
          </div>
          <div class="table-body">
            <div 
              v-for="(user, index) in ranking" 
              :key="user.id"
              class="table-row"
              :class="{ 
                'current-user': user.id === currentUserId,
                'top-three': index < 3
              }"
            >
              <div class="col-rank">
                <span class="rank-number">{{ index + 1 }}</span>
                <span v-if="user.rankChange" class="rank-change" :class="user.rankChange > 0 ? 'up' : 'down'">
                  {{ user.rankChange > 0 ? '↗' : '↘' }}
                </span>
              </div>
              <div class="col-user">
                <img :src="user.avatar" :alt="user.username" class="user-avatar">
                <div class="user-info">
                  <div class="username">{{ user.username }}</div>
                  <div class="user-level">{{ user.level }}</div>
                </div>
              </div>
              <div class="col-score">
                <span class="score-value">{{ user.score }}</span>
              </div>
              <div class="col-solved">
                <span class="solved-count">{{ user.solvedCount }}</span>
                <span class="total-problems">/ {{ problems.length }}</span>
              </div>
              <div class="col-penalty">{{ formatTime(user.penalty) }}</div>
              <div class="col-last">{{ formatTime(user.lastSubmission) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提交记录 -->
      <div v-if="activeTab === 'submissions'" class="submissions-tab">
        <div class="submissions-header">
          <h3>提交记录</h3>
          <div class="submissions-filter">
            <select v-model="submissionFilter.status" class="filter-select">
              <option value="">全部状态</option>
              <option value="accepted">通过</option>
              <option value="wrong_answer">答案错误</option>
              <option value="time_limit_exceeded">超时</option>
              <option value="runtime_error">运行错误</option>
            </select>
            <select v-model="submissionFilter.problem" class="filter-select">
              <option value="">全部题目</option>
              <option v-for="problem in problems" :key="problem.id" :value="problem.id">
                {{ problem.id }}. {{ problem.title }}
              </option>
            </select>
          </div>
        </div>

        <div class="submissions-list">
          <div 
            v-for="submission in filteredSubmissions" 
            :key="submission.id"
            class="submission-item"
          >
            <div class="submission-info">
              <div class="submission-problem">
                <span class="problem-id">{{ submission.problemId }}</span>
                <span class="problem-title">{{ submission.problemTitle }}</span>
              </div>
              <div class="submission-meta">
                <span class="submission-time">{{ formatDateTime(submission.submitTime) }}</span>
                <span class="submission-language">{{ submission.language }}</span>
              </div>
            </div>
            <div class="submission-result">
              <span class="result-status" :class="submission.status">
                {{ getSubmissionStatusText(submission.status) }}
              </span>
              <div class="result-details">
                <span v-if="submission.score" class="result-score">{{ submission.score }}分</span>
                <span v-if="submission.runtime" class="result-runtime">{{ submission.runtime }}ms</span>
                <span v-if="submission.memory" class="result-memory">{{ submission.memory }}KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// 接口定义
interface Contest {
  id: string
  title: string
  description: string
  type: 'individual' | 'team' | 'official'
  status: 'upcoming' | 'ongoing' | 'ended'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  startTime: string
  endTime: string
  duration: string
  participants: number
  reward: number
}

interface Problem {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  score: number
  solvedCount: number
  acceptanceRate: number
  status?: 'solved' | 'attempted' | 'unsolved'
}

interface RankingUser {
  id: string
  username: string
  avatar: string
  level: string
  score: number
  solvedCount: number
  penalty: number
  lastSubmission: number
  rankChange?: number
}

interface Submission {
  id: string
  problemId: string
  problemTitle: string
  status: string
  score?: number
  runtime?: number
  memory?: number
  language: string
  submitTime: string
}

interface Tab {
  key: string
  label: string
  icon: string
}

// 路由
const route = useRoute()
const contestId = route.params.id as string

// 响应式数据
const activeTab = ref('problems')
const isRegistered = ref(false)
const currentUserId = ref('current-user-id')
const rankingFilter = ref('all')

// 倒计时
const countdown = reactive({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

// 提交筛选
const submissionFilter = reactive({
  status: '',
  problem: ''
})

// 比赛信息
const contest = reactive<Contest>({
  id: contestId,
  title: '2024春季算法竞赛',
  description: '本次比赛旨在提升参赛者的算法思维和编程能力，涵盖数据结构、动态规划、图论等多个领域。比赛采用ACM赛制，实时排名，欢迎各位算法爱好者踊跃参与！',
  type: 'official',
  status: 'ongoing',
  difficulty: 'Medium',
  startTime: '2024-01-15T09:00:00',
  endTime: '2024-01-15T14:00:00',
  duration: '5小时',
  participants: 1247,
  reward: 500
})

// 标签页配置
const tabs: Tab[] = [
  { key: 'problems', label: '题目列表', icon: '📝' },
  { key: 'ranking', label: '实时排名', icon: '🏆' },
  { key: 'submissions', label: '提交记录', icon: '📊' }
]

// 题目列表
const problems = ref<Problem[]>([
  {
    id: 'A',
    title: '数组去重',
    difficulty: 'Easy',
    score: 100,
    solvedCount: 856,
    acceptanceRate: 78,
    status: 'solved'
  },
  {
    id: 'B',
    title: '最长公共子序列',
    difficulty: 'Medium',
    score: 200,
    solvedCount: 423,
    acceptanceRate: 45,
    status: 'attempted'
  },
  {
    id: 'C',
    title: '二叉树的最大路径和',
    difficulty: 'Hard',
    score: 300,
    solvedCount: 187,
    acceptanceRate: 32,
    status: 'unsolved'
  },
  {
    id: 'D',
    title: '图的最短路径',
    difficulty: 'Hard',
    score: 400,
    solvedCount: 95,
    acceptanceRate: 28,
    status: 'unsolved'
  }
])

// 排名数据
const ranking = ref<RankingUser[]>([
  {
    id: '1',
    username: 'AlgoMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlgoMaster',
    level: 'Expert',
    score: 1000,
    solvedCount: 4,
    penalty: 3600,
    lastSubmission: 1800,
    rankChange: 2
  },
  {
    id: '2',
    username: 'CodeNinja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeNinja',
    level: 'Advanced',
    score: 900,
    solvedCount: 4,
    penalty: 4200,
    lastSubmission: 2400,
    rankChange: -1
  },
  {
    id: '3',
    username: 'DataStructure',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DataStructure',
    level: 'Expert',
    score: 800,
    solvedCount: 3,
    penalty: 2700,
    lastSubmission: 3000,
    rankChange: 1
  }
])

// 提交记录
const submissions = ref<Submission[]>([
  {
    id: '1',
    problemId: 'A',
    problemTitle: '数组去重',
    status: 'accepted',
    score: 100,
    runtime: 45,
    memory: 1024,
    language: 'Python',
    submitTime: '2024-01-15T10:30:00'
  },
  {
    id: '2',
    problemId: 'B',
    problemTitle: '最长公共子序列',
    status: 'wrong_answer',
    runtime: 120,
    memory: 2048,
    language: 'C++',
    submitTime: '2024-01-15T11:15:00'
  }
])

// 计算属性
const solvedCount = computed(() => 
  problems.value.filter(p => p.status === 'solved').length
)

const attemptedCount = computed(() => 
  problems.value.filter(p => p.status === 'attempted').length
)

const filteredSubmissions = computed(() => {
  return submissions.value.filter(submission => {
    const statusMatch = !submissionFilter.status || submission.status === submissionFilter.status
    const problemMatch = !submissionFilter.problem || submission.problemId === submissionFilter.problem
    return statusMatch && problemMatch
  })
})

// 方法
const getTypeText = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'individual': '个人赛',
    'team': '团队赛',
    'official': '官方赛'
  }
  return typeMap[type] || type
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'upcoming': '即将开始',
    'ongoing': '进行中',
    'ended': '已结束'
  }
  return statusMap[status] || status
}

const getSubmissionStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'accepted': '通过',
    'wrong_answer': '答案错误',
    'time_limit_exceeded': '超时',
    'runtime_error': '运行错误',
    'compile_error': '编译错误'
  }
  return statusMap[status] || status
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const updateCountdown = () => {
  const now = new Date().getTime()
  const targetTime = contest.status === 'upcoming' 
    ? new Date(contest.startTime).getTime()
    : new Date(contest.endTime).getTime()
  
  const difference = targetTime - now
  
  if (difference > 0) {
    countdown.days = Math.floor(difference / (1000 * 60 * 60 * 24))
    countdown.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    countdown.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    countdown.seconds = Math.floor((difference % (1000 * 60)) / 1000)
  } else {
    countdown.days = 0
    countdown.hours = 0
    countdown.minutes = 0
    countdown.seconds = 0
  }
}

const registerContest = () => {
  isRegistered.value = true
  // 这里可以添加实际的报名逻辑
}

const enterContest = () => {
  // 进入比赛逻辑
  console.log('进入比赛')
}

const viewResults = () => {
  // 查看结果逻辑
  console.log('查看结果')
}

const solveProblem = (problemId: string) => {
  // 跳转到题目详情页
  console.log('解题:', problemId)
}

const refreshRanking = () => {
  // 刷新排名数据
  console.log('刷新排名')
}

// 生命周期
let countdownTimer: number | null = null

onMounted(() => {
  updateCountdown()
  countdownTimer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.contest-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

/* 比赛头部 */
.contest-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.contest-info {
  color: white;
}

.contest-title-section {
  margin-bottom: 1.5rem;
}

.contest-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contest-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.contest-type,
.contest-status,
.difficulty-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contest-type.official {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
}

.contest-type.individual {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  color: white;
}

.contest-type.team {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
}

.contest-status.upcoming {
  background: linear-gradient(45deg, #6366f1, #4f46e5);
  color: white;
}

.contest-status.ongoing {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
  animation: pulse 2s infinite;
}

.contest-status.ended {
  background: linear-gradient(45deg, #6b7280, #4b5563);
  color: white;
}

.difficulty-badge.Easy {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
}

.difficulty-badge.Medium {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
}

.difficulty-badge.Hard {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.contest-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-icon {
  font-size: 1.5rem;
}

.meta-content {
  flex: 1;
}

.meta-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.meta-value {
  font-weight: 600;
  font-size: 1rem;
}

.contest-description {
  margin-bottom: 1.5rem;
}

.contest-description h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contest-description p {
  line-height: 1.6;
  opacity: 0.9;
}

.contest-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.register-btn {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
}

.register-btn:disabled {
  background: linear-gradient(45deg, #6b7280, #4b5563);
  cursor: not-allowed;
}

.enter-btn {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
}

.results-btn {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 倒计时 */
.countdown-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 300px;
}

.countdown-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  text-align: center;
}

.countdown-timer {
  display: flex;
  gap: 1rem;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem 0.75rem;
  min-width: 60px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.time-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.time-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;
}

/* 标签页导航 */
.tab-navigation {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

.tab-btn:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.tab-icon {
  font-size: 1.125rem;
}

/* 标签页内容 */
.tab-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

/* 题目列表 */
.problems-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.problems-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.problems-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.875rem;
}

.stat-icon {
  font-size: 1rem;
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.problem-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.problem-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.problem-item.solved {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.1);
}

.problem-item.attempted {
  border-color: rgba(245, 158, 11, 0.3);
  background: rgba(245, 158, 11, 0.1);
}

.problem-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.problem-id {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
}

.problem-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.problem-difficulty {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.problem-difficulty.Easy {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.problem-difficulty.Medium {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.problem-difficulty.Hard {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.problem-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.problem-status {
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon {
  font-size: 1.5rem;
}

.solve-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(45deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.solve-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.solve-btn:disabled {
  background: rgba(107, 114, 128, 0.5);
  cursor: not-allowed;
}

/* 排名页面 */
.ranking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.ranking-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.ranking-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.filter-select {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  cursor: pointer;
}

.filter-select option {
  background: #1f2937;
  color: white;
}

/* 颁奖台 */
.podium-section {
  margin-bottom: 2rem;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 1rem;
  margin-bottom: 2rem;
}

.podium-place {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.podium-place.first {
  order: 2;
}

.podium-place.second {
  order: 1;
}

.podium-place.third {
  order: 3;
}

.podium-crown {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.podium-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
  min-width: 120px;
}

.podium-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.podium-info {
  text-align: center;
}

.podium-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.podium-score {
  font-size: 0.875rem;
  opacity: 0.8;
}

.podium-rank {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

.podium-place.first .podium-rank {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1f2937;
}

.podium-place.second .podium-rank {
  background: linear-gradient(45deg, #c0c0c0, #e5e7eb);
  color: #1f2937;
}

.podium-place.third .podium-rank {
  background: linear-gradient(45deg, #cd7f32, #d97706);
  color: white;
}

/* 排名表格 */
.ranking-table {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 100px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 100px 120px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  align-items: center;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.table-row.current-user {
  background: rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.3);
}

.table-row.top-three {
  background: rgba(245, 158, 11, 0.1);
}

.col-rank {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rank-number {
  font-weight: 600;
}

.rank-change {
  font-size: 0.875rem;
}

.rank-change.up {
  color: #22c55e;
}

.rank-change.down {
  color: #ef4444;
}

.col-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-info {
  flex: 1;
}

.username {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-level {
  font-size: 0.75rem;
  opacity: 0.7;
}

.score-value {
  font-weight: 700;
  font-size: 1.125rem;
}

.solved-count {
  font-weight: 600;
}

.total-problems {
  opacity: 0.6;
}

/* 提交记录 */
.submissions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.submissions-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.submissions-filter {
  display: flex;
  gap: 1rem;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submission-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.submission-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.submission-problem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.submission-problem .problem-id {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.submission-problem .problem-title {
  font-weight: 600;
}

.submission-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.submission-result {
  text-align: right;
}

.result-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.result-status.accepted {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.result-status.wrong_answer {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.result-status.time_limit_exceeded {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.result-status.runtime_error {
  background: rgba(168, 85, 247, 0.2);
  color: #a855f7;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .contest-header {
    grid-template-columns: 1fr;
  }
  
  .countdown-section {
    min-width: auto;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 80px 80px 80px 100px;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .contest-detail-view {
    padding: 1rem;
  }
  
  .contest-header {
    padding: 1.5rem;
  }
  
  .contest-title {
    font-size: 2rem;
  }
  
  .contest-meta {
    grid-template-columns: 1fr;
  }
  
  .tab-navigation {
    flex-direction: column;
  }
  
  .tab-content {
    padding: 1.5rem;
  }
  
  .problem-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .table-header > *,
  .table-row > * {
    padding: 0.25rem 0;
  }
  
  .podium {
    flex-direction: column;
    align-items: center;
  }
  
  .podium-place {
    order: unset !important;
  }
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 统计数据
const stats = ref({
  totalUsers: 12345,
  totalProblems: 1234,
  totalSubmissions: 567890,
  onlineUsers: 456
})

// 最新题目
const recentProblems = ref([
  { id: 1001, title: '两数之和', difficulty: 'easy', solved: 1234 },
  { id: 1002, title: '链表反转', difficulty: 'medium', solved: 567 },
  { id: 1003, title: '最长公共子序列', difficulty: 'hard', solved: 123 }
])

// 最新比赛
const upcomingContests = ref([
  { id: 1, title: '周赛 #123', startTime: '2024-01-20 20:00', participants: 234 },
  { id: 2, title: '月赛 #45', startTime: '2024-01-25 14:00', participants: 567 }
])

const goToProblems = () => {
  router.push('/problems')
}

const goToContests = () => {
  router.push('/contests')
}
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到 FashOJ</h1>
        <p class="hero-subtitle">专业的在线编程评测平台，提升你的算法能力</p>
        <div class="hero-actions">
          <button @click="goToProblems" class="btn btn-primary">开始刷题</button>
          <button @click="goToContests" class="btn btn-outline">参加比赛</button>
        </div>
      </div>
      <div class="hero-image">
        <div class="code-animation">
          <div class="code-line">function solve(nums) {</div>
          <div class="code-line">  return nums.sort();</div>
          <div class="code-line">}</div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalUsers.toLocaleString() }}</div>
          <div class="stat-label">注册用户</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalProblems.toLocaleString() }}</div>
          <div class="stat-label">题目总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalSubmissions.toLocaleString() }}</div>
          <div class="stat-label">提交总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.onlineUsers.toLocaleString() }}</div>
          <div class="stat-label">在线用户</div>
        </div>
      </div>
    </section>

    <!-- Content Sections -->
    <div class="content-sections">
      <!-- Recent Problems -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">最新题目</h2>
          <RouterLink to="/problems" class="section-link">查看更多 →</RouterLink>
        </div>
        <div class="problems-list">
          <div 
            v-for="problem in recentProblems" 
            :key="problem.id"
            class="problem-card"
            @click="router.push(`/problems/${problem.id}`)"
          >
            <div class="problem-info">
              <span class="problem-id">#{{ problem.id }}</span>
              <span class="problem-title">{{ problem.title }}</span>
            </div>
            <div class="problem-meta">
              <span :class="['difficulty', problem.difficulty]">{{ 
                problem.difficulty === 'easy' ? '简单' : 
                problem.difficulty === 'medium' ? '中等' : '困难' 
              }}</span>
              <span class="solved-count">{{ problem.solved }} 人解决</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Contests -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">即将开始的比赛</h2>
          <RouterLink to="/contests" class="section-link">查看更多 →</RouterLink>
        </div>
        <div class="contests-list">
          <div 
            v-for="contest in upcomingContests" 
            :key="contest.id"
            class="contest-card"
            @click="router.push(`/contests/${contest.id}`)"
          >
            <div class="contest-info">
              <h3 class="contest-title">{{ contest.title }}</h3>
              <div class="contest-time">🕐 {{ contest.startTime }}</div>
            </div>
            <div class="contest-participants">
              👥 {{ contest.participants }} 人参与
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 60px 0;
  margin-bottom: 80px;
}

.hero-content {
  text-align: left;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  color: #666;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.btn-primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.3);
}

.btn-outline {
  background: transparent;
  color: #1890ff;
  border-color: #1890ff;
}

.btn-outline:hover {
  background: #1890ff;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(24, 144, 255, 0.3);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-animation {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 40px;
  border-radius: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  line-height: 1.8;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
}

.code-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(90deg, #ff5f56, #ffbd2e, #27ca3f);
  border-radius: 12px 12px 0 0;
}

.code-line {
  margin-top: 30px;
  animation: typewriter 3s steps(20) infinite;
}

@keyframes typewriter {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.7; }
}

/* Stats Section */
.stats-section {
  margin-bottom: 80px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 32px 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* Content Sections */
.content-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.section-link {
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}

.section-link:hover {
  color: #40a9ff;
}

/* Problems List */
.problems-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-card {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.problem-card:hover {
  border-color: #1890ff;
  background: #f8fcff;
}

.problem-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.problem-id {
  color: #999;
  font-weight: 500;
  font-size: 14px;
}

.problem-title {
  color: #333;
  font-weight: 500;
}

.problem-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.difficulty.easy {
  background: #f6ffed;
  color: #52c41a;
}

.difficulty.medium {
  background: #fff7e6;
  color: #fa8c16;
}

.difficulty.hard {
  background: #fff2f0;
  color: #ff4d4f;
}

.solved-count {
  color: #999;
  font-size: 12px;
}

/* Contests List */
.contests-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contest-card {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contest-card:hover {
  border-color: #1890ff;
  background: #f8fcff;
}

.contest-info {
  margin-bottom: 12px;
}

.contest-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.contest-time {
  color: #666;
  font-size: 14px;
}

.contest-participants {
  color: #999;
  font-size: 14px;
}

/* Enhanced Responsive Design */
/* Large Desktop */
@media (min-width: 1400px) {
  .home-view {
    max-width: 1400px;
    padding: 0 40px;
  }
  
  .hero-title {
    font-size: 56px;
  }
  
  .hero-subtitle {
    font-size: 22px;
  }
  
  .stats-grid {
    gap: 32px;
  }
  
  .content-sections {
    gap: 48px;
  }
}

/* Desktop */
@media (max-width: 1200px) {
  .home-view {
    padding: 0 24px;
  }
  
  .hero-section {
    gap: 40px;
    padding: 40px 0;
  }
  
  .hero-title {
    font-size: 42px;
  }
  
  .stats-grid {
    gap: 20px;
  }
  
  .content-sections {
    gap: 32px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .home-view {
    padding: 0 20px;
  }
  
  .hero-section {
    gap: 32px;
    padding: 32px 0;
    margin-bottom: 60px;
  }
  
  .hero-title {
    font-size: 38px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .code-animation {
    padding: 32px;
    font-size: 14px;
  }
  
  .stats-section {
    margin-bottom: 60px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .stat-card {
    padding: 24px 20px;
  }
  
  .stat-number {
    font-size: 28px;
  }
  
  .content-sections {
    gap: 24px;
  }
  
  .section {
    padding: 24px;
  }
}

/* Mobile Large */
@media (max-width: 768px) {
  .home-view {
    padding: 0 16px;
  }
  
  .hero-section {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px 0;
    text-align: center;
    margin-bottom: 48px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 32px;
  }
  
  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .code-animation {
    max-width: 320px;
    padding: 24px;
    font-size: 12px;
  }
  
  .stats-section {
    margin-bottom: 48px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-card {
    padding: 20px 16px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .content-sections {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .section {
    padding: 20px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .problem-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .problem-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* Mobile Small */
@media (max-width: 480px) {
  .home-view {
    padding: 0 12px;
  }
  
  .hero-section {
    padding: 20px 0;
    margin-bottom: 32px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn {
    width: 100%;
    text-align: center;
    padding: 14px 20px;
  }
  
  .code-animation {
    max-width: 280px;
    padding: 20px;
    font-size: 11px;
  }
  
  .stats-section {
    margin-bottom: 32px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .stat-card {
    padding: 16px 12px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .content-sections {
    gap: 16px;
  }
  
  .section {
    padding: 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .section-link {
    font-size: 12px;
  }
  
  .problem-card,
  .contest-card {
    padding: 12px;
  }
  
  .contest-title {
    font-size: 14px;
  }
  
  .contest-time,
  .contest-participants {
    font-size: 12px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .home-view {
    padding: 0 8px;
  }
  
  .hero-title {
    font-size: 24px;
  }
  
  .code-animation {
    max-width: 240px;
    padding: 16px;
    font-size: 10px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .section {
    padding: 12px;
  }
}
</style>

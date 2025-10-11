<template>
  <div class="profile-view">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="header-background"></div>
      <div class="header-content">
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="userProfile.avatar" :alt="userProfile.username" class="user-avatar" />
            <button class="avatar-edit-btn" @click="showAvatarModal = true">
              <span class="edit-icon">📷</span>
            </button>
          </div>
          <div class="user-info">
            <h1 class="username">{{ userProfile.username }}</h1>
            <p class="user-title">{{ userProfile.title }}</p>
            <div class="user-level">
              <span class="level-badge" :class="getLevelClass(userProfile.level)">
                {{ userProfile.level }}
              </span>
              <span class="level-exp">{{ userProfile.exp }} / {{ userProfile.nextLevelExp }} EXP</span>
            </div>
            <div class="level-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${(userProfile.exp / userProfile.nextLevelExp) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-value">{{ userProfile.ranking }}</div>
            <div class="stat-label">全站排名</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-value">{{ userProfile.solvedProblems }}</div>
            <div class="stat-label">解题总数</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value">{{ userProfile.acceptanceRate }}%</div>
            <div class="stat-label">通过率</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-value">{{ userProfile.streak }}</div>
            <div class="stat-label">连续天数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Navigation Tabs -->
      <div class="content-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-btn"
          :class="{ 'active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Statistics Tab -->
        <div v-if="activeTab === 'stats'" class="stats-tab">
          <div class="stats-grid">
            <!-- Problem Solving Chart -->
            <div class="chart-card">
              <h3 class="card-title">📈 解题趋势</h3>
              <div class="chart-container">
                <div class="chart-placeholder">
                  <div class="chart-bars">
                    <div 
                      v-for="(day, index) in solvingTrend" 
                      :key="index"
                      class="chart-bar"
                      :style="{ height: `${(day.count / 10) * 100}%` }"
                      :title="`${day.date}: ${day.count}题`"
                    ></div>
                  </div>
                  <div class="chart-labels">
                    <span v-for="(day, index) in solvingTrend.slice(-7)" :key="index">
                     {{ day.date.split('-')[2] || '' }}
                   </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Difficulty Distribution -->
            <div class="chart-card">
              <h3 class="card-title">🎯 难度分布</h3>
              <div class="difficulty-stats">
                <div class="difficulty-item">
                  <div class="difficulty-info">
                    <span class="difficulty-label easy">简单</span>
                    <span class="difficulty-count">{{ difficultyStats.easy }}</span>
                  </div>
                  <div class="difficulty-bar">
                    <div 
                      class="difficulty-fill easy" 
                      :style="{ width: `${(difficultyStats.easy / userProfile.solvedProblems) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="difficulty-item">
                  <div class="difficulty-info">
                    <span class="difficulty-label medium">中等</span>
                    <span class="difficulty-count">{{ difficultyStats.medium }}</span>
                  </div>
                  <div class="difficulty-bar">
                    <div 
                      class="difficulty-fill medium" 
                      :style="{ width: `${(difficultyStats.medium / userProfile.solvedProblems) * 100}%` }"
                    ></div>
                  </div>
                </div>
                <div class="difficulty-item">
                  <div class="difficulty-info">
                    <span class="difficulty-label hard">困难</span>
                    <span class="difficulty-count">{{ difficultyStats.hard }}</span>
                  </div>
                  <div class="difficulty-bar">
                    <div 
                      class="difficulty-fill hard" 
                      :style="{ width: `${(difficultyStats.hard / userProfile.solvedProblems) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Submissions -->
            <div class="submissions-card">
              <h3 class="card-title">📝 最近提交</h3>
              <div class="submissions-list">
                <div 
                  v-for="submission in recentSubmissions" 
                  :key="submission.id"
                  class="submission-item"
                >
                  <div class="submission-problem">
                    <span class="problem-title">{{ submission.problemTitle }}</span>
                    <span class="problem-difficulty" :class="submission.difficulty">
                      {{ submission.difficulty }}
                    </span>
                  </div>
                  <div class="submission-result">
                    <span class="result-status" :class="submission.status">
                      {{ getStatusText(submission.status) }}
                    </span>
                    <span class="submission-time">{{ formatTime(submission.submittedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievements Tab -->
        <div v-if="activeTab === 'achievements'" class="achievements-tab">
          <div class="achievements-grid">
            <div 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="achievement-card"
              :class="{ 'unlocked': achievement.unlocked }"
            >
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <h4 class="achievement-title">{{ achievement.title }}</h4>
                <p class="achievement-description">{{ achievement.description }}</p>
                <div class="achievement-progress" v-if="!achievement.unlocked">
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: `${(achievement.progress / achievement.target) * 100}%` }"
                    ></div>
                  </div>
                  <span class="progress-text">{{ achievement.progress }} / {{ achievement.target }}</span>
                </div>
                <div class="achievement-unlocked" v-else>
                  <span class="unlock-date">{{ formatDate(achievement.unlockedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="settings-tab">
          <div class="settings-sections">
            <!-- Profile Settings -->
            <div class="settings-section">
              <h3 class="section-title">👤 个人信息</h3>
              <div class="settings-form">
                <div class="form-group">
                  <label>用户名</label>
                  <input 
                    v-model="editProfile.username" 
                    type="text" 
                    class="form-input"
                    :disabled="!editMode.profile"
                  />
                </div>
                <div class="form-group">
                  <label>邮箱</label>
                  <input 
                    v-model="editProfile.email" 
                    type="email" 
                    class="form-input"
                    :disabled="!editMode.profile"
                  />
                </div>
                <div class="form-group">
                  <label>个人简介</label>
                  <textarea 
                    v-model="editProfile.bio" 
                    class="form-textarea"
                    :disabled="!editMode.profile"
                    rows="3"
                  ></textarea>
                </div>
                <div class="form-actions">
                  <button 
                    v-if="!editMode.profile"
                    @click="editMode.profile = true"
                    class="edit-btn"
                  >
                    编辑
                  </button>
                  <template v-else>
                    <button @click="saveProfile" class="save-btn">保存</button>
                    <button @click="cancelEdit('profile')" class="cancel-btn">取消</button>
                  </template>
                </div>
              </div>
            </div>

            <!-- Notification Settings -->
            <div class="settings-section">
              <h3 class="section-title">🔔 通知设置</h3>
              <div class="settings-form">
                <div class="setting-item">
                  <div class="setting-info">
                    <span class="setting-label">邮件通知</span>
                    <span class="setting-description">接收重要更新和活动通知</span>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.emailNotifications" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="setting-item">
                  <div class="setting-info">
                    <span class="setting-label">比赛提醒</span>
                    <span class="setting-description">比赛开始前15分钟提醒</span>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.contestReminders" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="setting-item">
                  <div class="setting-info">
                    <span class="setting-label">讨论回复</span>
                    <span class="setting-description">有人回复你的帖子时通知</span>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.discussionReplies" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Privacy Settings -->
            <div class="settings-section">
              <h3 class="section-title">🔒 隐私设置</h3>
              <div class="settings-form">
                <div class="setting-item">
                  <div class="setting-info">
                    <span class="setting-label">公开排名</span>
                    <span class="setting-description">在排行榜中显示你的信息</span>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.publicRanking" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="setting-item">
                  <div class="setting-info">
                    <span class="setting-label">公开提交记录</span>
                    <span class="setting-description">允许其他用户查看你的提交历史</span>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="settings.publicSubmissions" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Account Actions -->
            <div class="settings-section">
              <h3 class="section-title">⚙️ 账户操作</h3>
              <div class="account-actions">
                <button @click="showPasswordModal = true" class="action-btn primary">
                  修改密码
                </button>
                <button @click="exportData" class="action-btn secondary">
                  导出数据
                </button>
                <button @click="showDeleteModal = true" class="action-btn danger">
                  删除账户
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Upload Modal -->
    <div v-if="showAvatarModal" class="modal-overlay" @click="showAvatarModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>更换头像</h3>
          <button @click="showAvatarModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="avatar-upload">
            <div class="upload-area">
              <input type="file" ref="avatarInput" @change="handleAvatarUpload" accept="image/*" hidden />
               <button @click="handleAvatarClick" class="upload-btn">
                <span class="upload-icon">📁</span>
                选择图片
              </button>
              <p class="upload-hint">支持 JPG、PNG 格式，建议尺寸 200x200</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="showPasswordModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>修改密码</h3>
          <button @click="showPasswordModal = false" class="close-btn">✕</button>
        </div>
        <div class="modal-body">
          <div class="password-form">
            <div class="form-group">
              <label>当前密码</label>
              <input v-model="passwordForm.current" type="password" class="form-input" />
            </div>
            <div class="form-group">
              <label>新密码</label>
              <input v-model="passwordForm.new" type="password" class="form-input" />
            </div>
            <div class="form-group">
              <label>确认新密码</label>
              <input v-model="passwordForm.confirm" type="password" class="form-input" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showPasswordModal = false" class="cancel-btn">取消</button>
          <button @click="changePassword" class="save-btn">确认修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface UserProfile {
  username: string
  email: string
  bio: string
  avatar: string
  title: string
  level: string
  exp: number
  nextLevelExp: number
  ranking: number
  solvedProblems: number
  acceptanceRate: number
  streak: number
}

interface Tab {
  key: string
  label: string
  icon: string
}

interface Submission {
  id: number
  problemTitle: string
  difficulty: string
  status: string
  submittedAt: string
}

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  target: number
  unlockedAt?: string
}

interface Settings {
  emailNotifications: boolean
  contestReminders: boolean
  discussionReplies: boolean
  publicRanking: boolean
  publicSubmissions: boolean
}

// 状态管理
const activeTab = ref('stats')
const showAvatarModal = ref(false)
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)
const avatarInput = ref<HTMLInputElement>()

const editMode = reactive({
  profile: false
})

// 用户资料
const userProfile = reactive<UserProfile>({
  username: 'CodeMaster',
  email: 'codemaster@example.com',
  bio: '热爱算法，追求完美的代码艺术。专注于数据结构与算法的学习和实践。',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
  title: '算法工程师',
  level: 'Expert',
  exp: 8750,
  nextLevelExp: 10000,
  ranking: 42,
  solvedProblems: 387,
  acceptanceRate: 85,
  streak: 15
})

const editProfile = reactive({ ...userProfile })

// 标签页配置
const tabs: Tab[] = [
  { key: 'stats', label: '统计数据', icon: '📊' },
  { key: 'achievements', label: '成就系统', icon: '🏆' },
  { key: 'settings', label: '设置', icon: '⚙️' }
]

// 解题趋势数据
const solvingTrend = ref([
  { date: '2024-01-08', count: 3 },
  { date: '2024-01-09', count: 5 },
  { date: '2024-01-10', count: 2 },
  { date: '2024-01-11', count: 7 },
  { date: '2024-01-12', count: 4 },
  { date: '2024-01-13', count: 6 },
  { date: '2024-01-14', count: 8 },
  { date: '2024-01-15', count: 3 }
])

// 难度统计
const difficultyStats = reactive({
  easy: 156,
  medium: 187,
  hard: 44
})

// 最近提交
const recentSubmissions = ref<Submission[]>([
  {
    id: 1,
    problemTitle: '两数之和',
    difficulty: 'easy',
    status: 'accepted',
    submittedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    problemTitle: '最长回文子串',
    difficulty: 'medium',
    status: 'accepted',
    submittedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    problemTitle: '正则表达式匹配',
    difficulty: 'hard',
    status: 'wrong_answer',
    submittedAt: '2024-01-14T16:45:00Z'
  },
  {
    id: 4,
    problemTitle: '合并K个升序链表',
    difficulty: 'hard',
    status: 'accepted',
    submittedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 5,
    problemTitle: '三数之和',
    difficulty: 'medium',
    status: 'time_limit_exceeded',
    submittedAt: '2024-01-14T11:30:00Z'
  }
])

// 成就系统
const achievements = ref<Achievement[]>([
  {
    id: 1,
    title: '初出茅庐',
    description: '完成第一道题目',
    icon: '🌱',
    unlocked: true,
    progress: 1,
    target: 1,
    unlockedAt: '2023-12-01T10:00:00Z'
  },
  {
    id: 2,
    title: '百题斩',
    description: '解决100道题目',
    icon: '💯',
    unlocked: true,
    progress: 100,
    target: 100,
    unlockedAt: '2024-01-10T15:30:00Z'
  },
  {
    id: 3,
    title: '连击高手',
    description: '连续7天解题',
    icon: '🔥',
    unlocked: true,
    progress: 7,
    target: 7,
    unlockedAt: '2024-01-12T20:00:00Z'
  },
  {
    id: 4,
    title: '算法大师',
    description: '解决500道题目',
    icon: '👑',
    unlocked: false,
    progress: 387,
    target: 500
  },
  {
    id: 5,
    title: '困难征服者',
    description: '解决50道困难题目',
    icon: '⚔️',
    unlocked: false,
    progress: 44,
    target: 50
  },
  {
    id: 6,
    title: '月度冠军',
    description: '单月解题数排名第一',
    icon: '🥇',
    unlocked: false,
    progress: 0,
    target: 1
  }
])

// 设置
const settings = reactive<Settings>({
  emailNotifications: true,
  contestReminders: true,
  discussionReplies: false,
  publicRanking: true,
  publicSubmissions: true
})

// 密码表单
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// 计算属性
const getLevelClass = (level: string) => {
  const levelClasses: { [key: string]: string } = {
    'Beginner': 'level-beginner',
    'Intermediate': 'level-intermediate',
    'Advanced': 'level-advanced',
    'Expert': 'level-expert',
    'Master': 'level-master'
  }
  return levelClasses[level] || 'level-beginner'
}

// 方法
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  
  if (diffHours < 24) return `${diffHours}小时前`
  const diffDays = Math.ceil(diffHours / 24)
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '未知时间'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'accepted': '通过',
    'wrong_answer': '答案错误',
    'time_limit_exceeded': '超时',
    'memory_limit_exceeded': '内存超限',
    'runtime_error': '运行错误',
    'compile_error': '编译错误'
  }
  return statusMap[status] || status
}

const saveProfile = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    Object.assign(userProfile, editProfile)
    editMode.profile = false
    alert('个人信息保存成功！')
  } catch {
    alert('保存失败，请重试')
  }
}

const cancelEdit = (type: string) => {
  if (type === 'profile') {
    Object.assign(editProfile, userProfile)
    editMode.profile = false
  }
}

const handleAvatarClick = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        userProfile.avatar = result
        showAvatarModal.value = false
        alert('头像更新成功！')
      }
    }
    reader.readAsDataURL(file)
  }
}

const changePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('新密码和确认密码不一致')
    return
  }
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showPasswordModal.value = false
    Object.assign(passwordForm, { current: '', new: '', confirm: '' })
    alert('密码修改成功！')
  } catch {
    alert('密码修改失败，请重试')
  }
}

const exportData = () => {
  // 模拟数据导出
  const data = {
    profile: userProfile,
    submissions: recentSubmissions.value,
    achievements: achievements.value.filter(a => a.unlocked)
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${userProfile.username}_data.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 2rem;
}

/* Profile Header */
.profile-header {
  position: relative;
  padding: 2rem 0 4rem;
  margin-bottom: 2rem;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  backdrop-filter: blur(10px);
}

.header-content {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

.avatar-section {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex: 1;
}

.avatar-container {
  position: relative;
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: white;
  transform: scale(1.1);
}

.edit-icon {
  font-size: 16px;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.user-title {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem;
}

.user-level {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.level-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-beginner { background: linear-gradient(135deg, #4CAF50, #45a049); color: white; }
.level-intermediate { background: linear-gradient(135deg, #FF9800, #f57c00); color: white; }
.level-advanced { background: linear-gradient(135deg, #2196F3, #1976d2); color: white; }
.level-expert { background: linear-gradient(135deg, #9C27B0, #7b1fa2); color: white; }
.level-master { background: linear-gradient(135deg, #FFD700, #FFA000); color: #333; }

.level-exp {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.level-progress {
  margin-top: 0.5rem;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Main Content */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.5rem;
}

.tab-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: 600;
}

.tab-icon {
  font-size: 1.2rem;
}

/* Tab Content */
.tab-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Statistics Tab */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card, .submissions-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.submissions-card {
  grid-column: 1 / -1;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: end;
  gap: 4px;
  padding: 1rem 0;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #4CAF50, #81C784);
  border-radius: 2px 2px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  background: linear-gradient(to top, #45a049, #66BB6A);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.difficulty-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.difficulty-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.difficulty-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.difficulty-label {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.difficulty-label.easy { background: #4CAF50; color: white; }
.difficulty-label.medium { background: #FF9800; color: white; }
.difficulty-label.hard { background: #f44336; color: white; }

.difficulty-count {
  color: white;
  font-weight: 600;
}

.difficulty-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.difficulty-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.difficulty-fill.easy { background: #4CAF50; }
.difficulty-fill.medium { background: #FF9800; }
.difficulty-fill.hard { background: #f44336; }

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.submission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.submission-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.submission-problem {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.problem-title {
  color: white;
  font-weight: 500;
}

.problem-difficulty {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  width: fit-content;
}

.submission-result {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.result-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.result-status.accepted { background: #4CAF50; color: white; }
.result-status.wrong_answer { background: #f44336; color: white; }
.result-status.time_limit_exceeded { background: #FF9800; color: white; }

.submission-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

/* Achievements Tab */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  opacity: 0.6;
}

.achievement-card.unlocked {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.achievement-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
}

.achievement-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.achievement-title {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  text-align: center;
}

.achievement-description {
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0 0 1rem;
  line-height: 1.5;
}

.achievement-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  text-align: center;
}

.achievement-unlocked {
  text-align: center;
}

.unlock-date {
  color: #4CAF50;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Settings Tab */
.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.form-input, .form-textarea {
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
}

.form-input:disabled, .form-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.edit-btn, .save-btn, .cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #667eea;
  color: white;
}

.save-btn {
  background: #4CAF50;
  color: white;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.edit-btn:hover, .save-btn:hover, .cancel-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.setting-label {
  color: white;
  font-weight: 500;
}

.setting-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4CAF50;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.account-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.primary {
  background: #667eea;
  color: white;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.danger {
  background: #f44336;
  color: white;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
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
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.upload-area {
  text-align: center;
  padding: 2rem;
}

.upload-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.upload-icon {
  font-size: 1.2rem;
}

.upload-hint {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 2rem;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .stats-overview {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .content-tabs {
    flex-direction: column;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .account-actions {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-view {
    padding-bottom: 1rem;
  }

  .header-content {
    padding: 0 1rem;
  }

  .main-content {
    padding: 0 1rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .username {
    font-size: 2rem;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
  }
}
</style>

<style scoped>
.profile-view {
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

.profile-content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #666;
}
</style>
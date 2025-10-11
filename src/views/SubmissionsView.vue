<template>
  <div class="submissions-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">提交记录</h1>
      <div class="header-actions">
        <div class="filter-section">
          <select v-model="selectedStatus" class="filter-select">
            <option value="">全部状态</option>
            <option value="accepted">通过</option>
            <option value="wrong_answer">答案错误</option>
            <option value="time_limit_exceeded">超时</option>
            <option value="memory_limit_exceeded">内存超限</option>
            <option value="runtime_error">运行错误</option>
            <option value="compile_error">编译错误</option>
          </select>
          <select v-model="selectedLanguage" class="filter-select">
            <option value="">全部语言</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="c">C</option>
          </select>
          <input 
            v-model="searchProblem" 
            type="text" 
            placeholder="搜索题目..." 
            class="search-input"
          >
        </div>
        <button @click="refreshSubmissions" class="refresh-btn" :disabled="isLoading">
          {{ isLoading ? '刷新中...' : '刷新' }}
        </button>
      </div>
    </div>

    <!-- 提交统计 -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-number">{{ stats.total }}</div>
        <div class="stat-label">总提交数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.accepted }}</div>
        <div class="stat-label">通过数</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.acceptanceRate }}%</div>
        <div class="stat-label">通过率</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ stats.uniqueSolved }}</div>
        <div class="stat-label">解决题目</div>
      </div>
    </div>

    <!-- 提交列表 -->
    <div class="submissions-container">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
      
      <div v-else-if="filteredSubmissions.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无提交记录</h3>
        <p>{{ hasFilters ? '没有找到符合条件的提交记录' : '开始刷题，创建你的第一个提交吧！' }}</p>
        <RouterLink to="/problems" class="start-coding-btn">开始刷题</RouterLink>
      </div>

      <div v-else class="submissions-table">
        <div class="table-header">
          <div class="col-time">提交时间</div>
          <div class="col-problem">题目</div>
          <div class="col-status">状态</div>
          <div class="col-language">语言</div>
          <div class="col-runtime">运行时间</div>
          <div class="col-memory">内存</div>
          <div class="col-actions">操作</div>
        </div>

        <div class="table-body">
          <div 
            v-for="submission in paginatedSubmissions" 
            :key="submission.id" 
            class="submission-row"
          >
            <div class="col-time">
              <div class="time-main">{{ formatTime(submission.submitTime) }}</div>
              <div class="time-relative">{{ getRelativeTime(submission.submitTime) }}</div>
            </div>
            
            <div class="col-problem">
              <RouterLink 
                :to="`/problems/${submission.problemId}`" 
                class="problem-link"
              >
                #{{ submission.problemId }}. {{ submission.problemTitle }}
              </RouterLink>
              <div class="problem-difficulty">
                <span :class="['difficulty-tag', submission.difficulty]">
                  {{ getDifficultyText(submission.difficulty) }}
                </span>
              </div>
            </div>
            
            <div class="col-status">
              <div :class="['status-badge', submission.status]">
                <span class="status-icon">{{ getStatusIcon(submission.status) }}</span>
                <span class="status-text">{{ getStatusText(submission.status) }}</span>
              </div>
              <div v-if="submission.testCases" class="test-cases">
                {{ submission.testCases.passed }}/{{ submission.testCases.total }}
              </div>
            </div>
            
            <div class="col-language">
              <span class="language-tag">{{ getLanguageText(submission.language) }}</span>
            </div>
            
            <div class="col-runtime">
              <span v-if="submission.runtime">{{ submission.runtime }}ms</span>
              <span v-else class="na-text">-</span>
            </div>
            
            <div class="col-memory">
              <span v-if="submission.memory">{{ submission.memory }}MB</span>
              <span v-else class="na-text">-</span>
            </div>
            
            <div class="col-actions">
              <button @click="viewCode(submission)" class="action-btn view-btn">
                查看代码
              </button>
              <button 
                v-if="submission.status === 'accepted'" 
                @click="shareSubmission(submission)" 
                class="action-btn share-btn"
              >
                分享
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage = 1" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          首页
        </button>
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          上一页
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="typeof page === 'number' ? currentPage = page : null"
            :class="['page-number', { active: page === currentPage }]"
            :disabled="typeof page === 'string'"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          下一页
        </button>
        <button 
          @click="currentPage = totalPages" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          末页
        </button>
      </div>
    </div>

    <!-- 代码查看模态框 -->
    <div v-if="showCodeModal" class="modal-overlay" @click="closeCodeModal">
      <div class="code-modal" @click.stop>
        <div class="modal-header">
          <h3>提交代码</h3>
          <button @click="closeCodeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="code-info">
            <div class="info-item">
              <strong>题目：</strong>
              #{{ selectedSubmission?.problemId }}. {{ selectedSubmission?.problemTitle }}
            </div>
            <div class="info-item">
              <strong>语言：</strong>
              {{ getLanguageText(selectedSubmission?.language || '') }}
            </div>
            <div class="info-item">
              <strong>状态：</strong>
              <span :class="['status-badge', selectedSubmission?.status]">
                {{ getStatusText(selectedSubmission?.status || '') }}
              </span>
            </div>
            <div class="info-item">
              <strong>提交时间：</strong>
              {{ formatTime(selectedSubmission?.submitTime || '') }}
            </div>
          </div>
          <div class="code-content">
            <pre><code>{{ selectedSubmission?.code }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface TestCases {
  passed: number
  total: number
}

interface Submission {
  id: number
  problemId: number
  problemTitle: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compile_error'
  language: string
  runtime?: number
  memory?: number
  submitTime: string
  testCases?: TestCases
  code: string
}

interface Stats {
  total: number
  accepted: number
  acceptanceRate: number
  uniqueSolved: number
}

// 响应式数据
const isLoading = ref(false)
const selectedStatus = ref('')
const selectedLanguage = ref('')
const searchProblem = ref('')
const currentPage = ref(1)
const pageSize = 20
const showCodeModal = ref(false)
const selectedSubmission = ref<Submission | null>(null)

// 统计数据
const stats = ref<Stats>({
  total: 156,
  accepted: 89,
  acceptanceRate: 57.1,
  uniqueSolved: 45
})

// 模拟提交数据
const submissions = ref<Submission[]>([
  {
    id: 1,
    problemId: 1,
    problemTitle: '两数之和',
    difficulty: 'easy',
    status: 'accepted',
    language: 'cpp',
    runtime: 12,
    memory: 15.2,
    submitTime: '2024-01-15 14:30:25',
    testCases: { passed: 58, total: 58 },
    code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            map[nums[i]] = i;
        }
        return {};
    }
};`
  },
  {
    id: 2,
    problemId: 2,
    problemTitle: '两数相加',
    difficulty: 'medium',
    status: 'wrong_answer',
    language: 'java',
    runtime: 25,
    memory: 42.1,
    submitTime: '2024-01-15 13:45:12',
    testCases: { passed: 1563, total: 1568 },
    code: `public class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        int carry = 0;
        
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }
            
            carry = sum / 10;
            current.next = new ListNode(sum % 10);
            current = current.next;
        }
        
        return dummy.next;
    }
}`
  },
  {
    id: 3,
    problemId: 3,
    problemTitle: '无重复字符的最长子串',
    difficulty: 'medium',
    status: 'time_limit_exceeded',
    language: 'python',
    submitTime: '2024-01-15 12:20:08',
    testCases: { passed: 985, total: 987 },
    code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        char_map = {}
        left = 0
        max_length = 0
        
        for right in range(len(s)):
            if s[right] in char_map and char_map[s[right]] >= left:
                left = char_map[s[right]] + 1
            
            char_map[s[right]] = right
            max_length = max(max_length, right - left + 1)
        
        return max_length`
  },
  {
    id: 4,
    problemId: 4,
    problemTitle: '寻找两个正序数组的中位数',
    difficulty: 'hard',
    status: 'accepted',
    language: 'cpp',
    runtime: 8,
    memory: 89.5,
    submitTime: '2024-01-14 16:15:33',
    testCases: { passed: 2094, total: 2094 },
    code: `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int m = nums1.size();
        int n = nums2.size();
        int left = 0, right = m;
        
        while (left <= right) {
            int partitionX = (left + right) / 2;
            int partitionY = (m + n + 1) / 2 - partitionX;
            
            int maxLeftX = (partitionX == 0) ? INT_MIN : nums1[partitionX - 1];
            int minRightX = (partitionX == m) ? INT_MAX : nums1[partitionX];
            
            int maxLeftY = (partitionY == 0) ? INT_MIN : nums2[partitionY - 1];
            int minRightY = (partitionY == n) ? INT_MAX : nums2[partitionY];
            
            if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                if ((m + n) % 2 == 0) {
                    return (max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2.0;
                } else {
                    return max(maxLeftX, maxLeftY);
                }
            } else if (maxLeftX > minRightY) {
                right = partitionX - 1;
            } else {
                left = partitionX + 1;
            }
        }
        
        return 0.0;
    }
};`
  },
  {
    id: 5,
    problemId: 1,
    problemTitle: '两数之和',
    difficulty: 'easy',
    status: 'runtime_error',
    language: 'javascript',
    submitTime: '2024-01-14 10:30:15',
    testCases: { passed: 12, total: 58 },
    code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
};`
  }
])

// 计算属性
const hasFilters = computed(() => {
  return selectedStatus.value || selectedLanguage.value || searchProblem.value
})

const filteredSubmissions = computed(() => {
  let filtered = submissions.value

  if (selectedStatus.value) {
    filtered = filtered.filter(s => s.status === selectedStatus.value)
  }

  if (selectedLanguage.value) {
    filtered = filtered.filter(s => s.language === selectedLanguage.value)
  }

  if (searchProblem.value) {
    const search = searchProblem.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.problemTitle.toLowerCase().includes(search) ||
      s.problemId.toString().includes(search)
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredSubmissions.value.length / pageSize)
})

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredSubmissions.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages
})

// 方法
const getDifficultyText = (difficulty: string) => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[difficulty as keyof typeof map] || difficulty
}

const getStatusText = (status: string) => {
  const map = {
    accepted: '通过',
    wrong_answer: '答案错误',
    time_limit_exceeded: '超时',
    memory_limit_exceeded: '内存超限',
    runtime_error: '运行错误',
    compile_error: '编译错误'
  }
  return map[status as keyof typeof map] || status
}

const getStatusIcon = (status: string) => {
  const map = {
    accepted: '✓',
    wrong_answer: '✗',
    time_limit_exceeded: '⏰',
    memory_limit_exceeded: '💾',
    runtime_error: '⚠️',
    compile_error: '🔧'
  }
  return map[status as keyof typeof map] || '?'
}

const getLanguageText = (language: string) => {
  const map = {
    cpp: 'C++',
    java: 'Java',
    python: 'Python',
    javascript: 'JavaScript',
    c: 'C'
  }
  return map[language as keyof typeof map] || language
}

const formatTime = (timeStr: string) => {
  return timeStr
}

const getRelativeTime = (timeStr: string) => {
  const now = new Date()
  const time = new Date(timeStr)
  const diff = now.getTime() - time.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

const refreshSubmissions = async () => {
  isLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 这里可以重新获取数据
  } finally {
    isLoading.value = false
  }
}

const viewCode = (submission: Submission) => {
  selectedSubmission.value = submission
  showCodeModal.value = true
}

const closeCodeModal = () => {
  showCodeModal.value = false
  selectedSubmission.value = null
}

const shareSubmission = (submission: Submission) => {
  // 实现分享功能
  alert(`分享提交记录：${submission.problemTitle}`)
}

// 初始化
onMounted(() => {
  // 可以在这里加载数据
})
</script>

<style scoped>
.submissions-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.filter-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-select,
.search-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.search-input {
  min-width: 200px;
}

.refresh-btn {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #096dd9;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.submissions-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.loading-state,
.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #666;
  margin: 0 0 20px 0;
}

.start-coding-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s ease;
}

.start-coding-btn:hover {
  background: #096dd9;
}

.submissions-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 140px 1fr 120px 80px 80px 80px 120px;
  gap: 16px;
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.submission-row {
  display: grid;
  grid-template-columns: 140px 1fr 120px 80px 80px 80px 120px;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
}

.submission-row:hover {
  background: #fafafa;
}

.col-time {
  display: flex;
  flex-direction: column;
}

.time-main {
  font-size: 13px;
  color: #333;
  margin-bottom: 2px;
}

.time-relative {
  font-size: 12px;
  color: #999;
}

.problem-link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
}

.problem-link:hover {
  text-decoration: underline;
}

.problem-difficulty {
  margin-top: 4px;
}

.difficulty-tag {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
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

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 4px;
}

.status-badge.accepted {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.wrong_answer,
.status-badge.runtime_error,
.status-badge.compile_error {
  background: #fff2f0;
  color: #ff4d4f;
}

.status-badge.time_limit_exceeded,
.status-badge.memory_limit_exceeded {
  background: #fff7e6;
  color: #fa8c16;
}

.test-cases {
  font-size: 11px;
  color: #999;
}

.language-tag {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.na-text {
  color: #ccc;
}

.action-btn {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  margin-right: 4px;
  transition: all 0.2s ease;
}

.view-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.share-btn:hover {
  border-color: #52c41a;
  color: #52c41a;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
}

.page-btn,
.page-number {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled),
.page-number:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.code-modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

.code-info {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.info-item {
  margin-bottom: 8px;
  font-size: 14px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.code-content {
  background: #f8f8f8;
  border-radius: 6px;
  overflow: hidden;
}

.code-content pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .table-header,
  .submission-row {
    grid-template-columns: 120px 1fr 100px 70px 70px 70px 100px;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .submissions-view {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px;
  }
  
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-section {
    justify-content: stretch;
  }
  
  .filter-select,
  .search-input {
    flex: 1;
    min-width: 0;
  }
  
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-header {
    display: none;
  }
  
  .submission-row {
    display: block;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .submission-row > div {
    margin-bottom: 8px;
  }
  
  .submission-row > div:last-child {
    margin-bottom: 0;
  }
  
  .col-time,
  .col-problem,
  .col-status,
  .col-language,
  .col-runtime,
  .col-memory,
  .col-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .col-time::before { content: "提交时间："; }
  .col-problem::before { content: "题目："; }
  .col-status::before { content: "状态："; }
  .col-language::before { content: "语言："; }
  .col-runtime::before { content: "运行时间："; }
  .col-memory::before { content: "内存："; }
  .col-actions::before { content: "操作："; }
  
  .col-time::before,
  .col-problem::before,
  .col-status::before,
  .col-language::before,
  .col-runtime::before,
  .col-memory::before,
  .col-actions::before {
    font-weight: 600;
    color: #666;
    font-size: 12px;
  }
  
  .code-modal {
    width: 95%;
    margin: 20px;
  }
}
</style>
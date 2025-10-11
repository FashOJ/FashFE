<template>
  <div class="problem-detail-view">
    <!-- 题目头部信息 -->
    <div class="problem-header">
      <div class="problem-meta">
        <RouterLink to="/problems" class="back-link">← 返回题库</RouterLink>
        <div class="problem-title-section">
          <h1 class="problem-title">#{{ problemId }}. {{ problem.title }}</h1>
          <div class="problem-tags">
            <span :class="['difficulty-tag', problem.difficulty]">
              {{ getDifficultyText(problem.difficulty) }}
            </span>
            <span v-for="tag in problem.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="problem-stats">
        <div class="stat-item">
          <span class="stat-label">通过率</span>
          <span class="stat-value">{{ problem.acceptanceRate }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">提交数</span>
          <span class="stat-value">{{ problem.submitCount }}</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="problem-content">
      <!-- 左侧：题目描述 -->
      <div class="problem-description">
        <div class="description-section">
          <h3>题目描述</h3>
          <div class="description-content" v-html="problem.description"></div>
        </div>

        <div class="description-section" v-if="problem.inputFormat">
          <h3>输入格式</h3>
          <div class="description-content" v-html="problem.inputFormat"></div>
        </div>

        <div class="description-section" v-if="problem.outputFormat">
          <h3>输出格式</h3>
          <div class="description-content" v-html="problem.outputFormat"></div>
        </div>

        <div class="description-section" v-if="problem.examples.length > 0">
          <h3>示例</h3>
          <div v-for="(example, index) in problem.examples" :key="index" class="example">
            <div class="example-title">示例 {{ index + 1 }}</div>
            <div class="example-content">
              <div class="example-input">
                <strong>输入：</strong>
                <pre>{{ example.input }}</pre>
              </div>
              <div class="example-output">
                <strong>输出：</strong>
                <pre>{{ example.output }}</pre>
              </div>
              <div v-if="example.explanation" class="example-explanation">
                <strong>解释：</strong>
                <p>{{ example.explanation }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="description-section" v-if="problem.constraints">
          <h3>数据范围</h3>
          <div class="description-content" v-html="problem.constraints"></div>
        </div>
      </div>

      <!-- 右侧：代码编辑器和提交 -->
      <div class="code-section">
        <div class="code-editor-container">
          <div class="editor-header">
            <LanguageSelector 
              v-model="selectedLanguage" 
              @change="onLanguageChange"
            />
            <button @click="resetCode" class="reset-btn">重置代码</button>
          </div>
          
          <div class="code-editor">
            <MonacoEditor
              v-model="userCode"
              :language="selectedLanguage"
              :height="'500px'"
              theme="vs-dark"
              :options="{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false
              }"
            />
          </div>

          <div class="editor-actions">
            <button @click="runCode" class="run-btn" :disabled="isRunning">
              {{ isRunning ? '运行中...' : '运行代码' }}
            </button>
            <button @click="submitCodeAction" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? '提交中...' : '提交答案' }}
            </button>
          </div>
        </div>

        <!-- 运行结果 -->
        <div v-if="runResult" class="run-result">
          <h4>运行结果</h4>
          <div v-if="runResult.success" class="success-result">
            <p><strong>输出:</strong></p>
            <pre>{{ runResult.output }}</pre>
            <div class="result-stats">
              <span><strong>执行时间:</strong> {{ formatExecutionTime(runResult.executionTime) }}</span>
              <span><strong>内存使用:</strong> {{ formatMemoryUsage(runResult.memoryUsage) }}</span>
            </div>
          </div>
          <div v-else class="error-result">
            <p><strong>错误:</strong></p>
            <pre>{{ runResult.error }}</pre>
            <div class="result-stats">
              <span><strong>执行时间:</strong> {{ formatExecutionTime(runResult.executionTime) }}</span>
              <span><strong>内存使用:</strong> {{ formatMemoryUsage(runResult.memoryUsage) }}</span>
            </div>
          </div>
        </div>

        <!-- 提交结果 -->
        <div v-if="submitResult" class="submit-result">
          <h4>提交结果</h4>
          <div class="result-summary">
            <div class="status" :style="{ color: getStatusColor(submitResult.status) }">
              {{ getStatusIcon(submitResult.status) }} {{ submitResult.status }}
            </div>
            <div class="details">
              <p>得分: {{ submitResult.score }}/100</p>
              <p>通过测试: {{ submitResult.passedTestCases }}/{{ submitResult.totalTestCases }}</p>
              <p>执行时间: {{ formatExecutionTime(submitResult.executionTime) }}</p>
              <p>内存使用: {{ formatMemoryUsage(submitResult.memoryUsage) }}</p>
            </div>
          </div>
          
          <!-- 测试用例详情 -->
          <div v-if="submitResult.details && submitResult.details.length > 0" class="test-cases">
            <h5>测试用例详情</h5>
            <div v-for="(testCase, index) in submitResult.details" :key="index" class="test-case">
              <div class="test-case-header">
                <span class="test-case-number">测试用例 {{ index + 1 }}</span>
                <span class="test-case-status" :class="{ passed: testCase.passed, failed: !testCase.passed }">
                  {{ testCase.passed ? '✅ 通过' : '❌ 失败' }}
                </span>
              </div>
              <div class="test-case-content">
                <div class="test-input">
                  <strong>输入:</strong> {{ testCase.input }}
                </div>
                <div class="test-output">
                  <strong>期望输出:</strong> {{ testCase.expectedOutput }}
                </div>
                <div class="test-actual">
                  <strong>实际输出:</strong> {{ testCase.actualOutput }}
                </div>
                <div class="test-time">
                  <strong>执行时间:</strong> {{ formatExecutionTime(testCase.executionTime) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MonacoEditor from '@/components/MonacoEditor.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { getCodeTemplate } from '@/utils/codeTemplates'
import { executeCode, submitCode, formatExecutionTime, formatMemoryUsage, getStatusColor, getStatusIcon, type ExecutionResult, type SubmissionResult } from '@/services/codeExecutionService'

interface Example {
  input: string
  output: string
  explanation?: string
}

interface Problem {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  inputFormat?: string
  outputFormat?: string
  examples: Example[]
  constraints?: string
  tags: string[]
  acceptanceRate: number
  submitCount: number
}



const route = useRoute()
const problemId = computed(() => route.params.id as string)



const selectedLanguage = ref('cpp')
const userCode = ref('')
const customInput = ref('')
const runResult = ref<ExecutionResult | null>(null)
const submitResult = ref<SubmissionResult | null>(null)
const isRunning = ref(false)
const isSubmitting = ref(false)

// 模拟题目数据
const problem = ref<Problem>({
  id: parseInt(problemId.value),
  title: '两数之和',
  difficulty: 'easy',
  description: `
    <p>给你一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请你在该数组中找出 <strong>和为目标值</strong> <em>target</em> 的那 <strong>两个</strong> 整数，并返回它们的数组下标。</p>
    <p>你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。</p>
    <p>你可以按任意顺序返回答案。</p>
  `,
  inputFormat: '<p>第一行包含整数数组的长度 n 和目标值 target。</p><p>第二行包含 n 个整数，表示数组 nums。</p>',
  outputFormat: '<p>输出两个整数，表示和为 target 的两个数的下标。</p>',
  examples: [
    {
      input: '4 9\n2 7 11 15',
      output: '0 1',
      explanation: '因为 nums[0] + nums[1] == 9，返回 [0, 1]。'
    },
    {
      input: '3 6\n3 2 4',
      output: '1 2',
      explanation: '因为 nums[1] + nums[2] == 6，返回 [1, 2]。'
    }
  ],
  constraints: `
    <ul>
      <li><code>2 ≤ nums.length ≤ 10<sup>4</sup></code></li>
      <li><code>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></code></li>
      <li><code>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></code></li>
      <li><strong>只会存在一个有效答案</strong></li>
    </ul>
  `,
  tags: ['数组', '哈希表'],
  acceptanceRate: 85.2,
  submitCount: 1234567
})

// 获取难度文本
const getDifficultyText = (difficulty: string) => {
  const map = {
    easy: '简单',
    medium: '中等',
    hard: '困难'
  }
  return map[difficulty as keyof typeof map] || difficulty
}

// 语言变化处理
const onLanguageChange = () => {
  resetCode()
}

// 重置代码
const resetCode = () => {
  userCode.value = getCodeTemplate(selectedLanguage.value)
}

// 运行代码
const runCode = async () => {
  if (!userCode.value.trim()) {
    alert('请先输入代码')
    return
  }
  
  isRunning.value = true
  runResult.value = null
  
  try {
    const result = await executeCode(userCode.value, selectedLanguage.value, customInput.value)
    runResult.value = result
  } catch {
    runResult.value = {
      success: false,
      output: '',
      error: '代码执行失败，请检查网络连接',
      executionTime: 0,
      memoryUsage: 0
    }
  } finally {
    isRunning.value = false
  }
}

// 提交代码
const submitCodeAction = async () => {
  if (!userCode.value.trim()) {
    alert('请先输入代码')
    return
  }
  
  isSubmitting.value = true
  submitResult.value = null
  
  try {
    const result = await submitCode(userCode.value, selectedLanguage.value, problemId.value)
    submitResult.value = result
  } catch {
    submitResult.value = {
      submissionId: 'error',
      status: 'Runtime Error',
      score: 0,
      totalTestCases: 0,
      passedTestCases: 0,
      executionTime: 0,
      memoryUsage: 0,
      details: []
    }
  } finally {
    isSubmitting.value = false
  }
}

// 初始化
onMounted(() => {
  resetCode()
})
</script>

<style scoped>
.problem-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.problem-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.problem-meta {
  margin-bottom: 1.5rem;
}

.back-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.back-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
}

.problem-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.problem-tags {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.difficulty-tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.difficulty-tag.easy {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
}

.difficulty-tag.medium {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
}

.difficulty-tag.hard {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
}

.tag {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 0.875rem;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.problem-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 120px;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.problem-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.problem-description {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  color: white;
}

.description-section {
  margin-bottom: 2rem;
}

.description-section:last-child {
  margin-bottom: 0;
}

.description-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.description-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
}

.description-content p {
  margin: 0 0 1rem 0;
}

.description-content code {
  background: rgba(255, 255, 255, 0.2);
  color: #e0e7ff;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-weight: 500;
}

.description-content ul {
  margin: 0;
  padding-left: 1.5rem;
}

.description-content li {
  margin-bottom: 0.5rem;
}

.example {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.example:last-child {
  margin-bottom: 0;
}

.example-title {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 600;
  font-size: 0.875rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.example-content {
  padding: 1.5rem;
}

.example-input,
.example-output {
  margin-bottom: 1rem;
}

.example-input strong,
.example-output strong {
  color: white;
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.5rem;
}

.example-input pre,
.example-output pre {
  background: rgba(0, 0, 0, 0.3);
  color: #e0e7ff;
  padding: 1rem;
  border-radius: 8px;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.example-explanation {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.example-explanation strong {
  color: white;
  font-size: 0.875rem;
  display: block;
  margin-bottom: 0.5rem;
}

.example-explanation p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  line-height: 1.6;
}

.code-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  color: white;
}

.code-editor-container {
  margin-bottom: 2rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}



.reset-btn {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.code-editor {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
}

.editor-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.run-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.run-btn {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
}

.run-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
}

.submit-btn {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.run-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.run-result,
.submit-result {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.run-result:last-child,
.submit-result:last-child {
  margin-bottom: 0;
}

.run-result h4,
.submit-result h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.result-success {
  color: #22c55e;
}

.result-error {
  color: #ef4444;
}

.result-item {
  margin-bottom: 1rem;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-item strong {
  font-weight: 600;
  color: white;
  display: block;
  margin-bottom: 0.5rem;
}

.result-item pre {
  background: rgba(0, 0, 0, 0.3);
  color: #e0e7ff;
  padding: 1rem;
  border-radius: 8px;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
}

.submit-status {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.submit-status.accepted {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.submit-status.wrong_answer,
.submit-status.runtime_error,
.submit-status.compile_error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.submit-status.time_limit_exceeded,
.submit-status.memory_limit_exceeded {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.submit-details {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.detail-item span:first-child {
  color: rgba(255, 255, 255, 0.8);
}

.detail-item span:last-child {
  color: white;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .problem-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .code-section {
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .problem-detail-view {
    padding: 1rem;
  }
  
  .problem-header {
    padding: 1.5rem;
  }
  
  .problem-title {
    font-size: 1.5rem;
  }
  
  .problem-stats {
    gap: 1rem;
    flex-direction: column;
  }
  
  .stat-item {
    min-width: auto;
    flex-direction: row;
    justify-content: space-between;
  }
  
  .problem-description,
  .code-section {
    padding: 1.5rem;
  }
  
  .editor-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .editor-actions {
    flex-direction: column;
  }
  
  .code-editor {
    height: 400px;
  }
  
  .example-content {
    padding: 1rem;
  }
  
  .example-title {
    padding: 0.75rem 1rem;
  }
  
  .submit-details {
    padding: 1rem;
  }
  
  .result-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .test-cases h5 {
    font-size: 1rem;
  }
  
  .test-case {
    padding: 1rem;
  }
  
  .test-case-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .test-case-content {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .problem-detail-view {
    padding: 0.75rem;
  }
  
  .problem-header,
  .problem-description,
  .code-section {
    padding: 1rem;
  }
  
  .problem-title {
    font-size: 1.25rem;
  }
  
  .problem-tags {
    gap: 0.5rem;
  }
  
  .difficulty-tag,
  .tag {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .code-editor {
    height: 300px;
  }
  
  .run-result,
  .submit-result {
    padding: 1rem;
  }
  
  .back-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .description-section h3 {
    font-size: 1.125rem;
  }
  
  .example-input pre,
  .example-output pre {
    font-size: 0.75rem;
    padding: 0.75rem;
  }
  
  .run-btn,
  .submit-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .reset-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.75rem;
  }
  
  .test-case-content {
    font-size: 0.75rem;
  }
  
  .test-case-content div {
    margin-bottom: 0.75rem;
  }
}

/* 平板设备响应式设计 */
@media (min-width: 769px) and (max-width: 1024px) {
  .problem-detail {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .problem-header h1 {
    font-size: 1.75rem;
  }

  .problem-meta {
    gap: 1rem;
  }

  .meta-item {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }

  .problem-content {
    gap: 1.5rem;
  }

  .problem-description,
  .code-editor-section {
    padding: 1.5rem;
  }

  .problem-description h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .problem-description h3 {
    font-size: 1.1rem;
    margin: 1.25rem 0 0.75rem 0;
  }

  .problem-description p,
  .problem-description li {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .code-editor-section h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .editor-controls {
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .control-group {
    gap: 0.75rem;
  }

  .control-group label {
    font-size: 0.85rem;
  }

  .editor-actions {
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .btn {
    padding: 0.6rem 1.25rem;
    font-size: 0.85rem;
  }

  .btn-primary,
  .btn-success {
    min-height: 42px;
  }

  .result-section {
    margin-top: 1.5rem;
    padding: 1.25rem;
  }

  .result-section h3 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .result-info {
    gap: 1rem;
  }

  .info-item {
    padding: 0.75rem;
    font-size: 0.85rem;
  }

  .test-cases {
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .test-case {
    padding: 1rem;
  }

  .test-case-header {
    font-size: 0.85rem;
    margin-bottom: 0.75rem;
  }

  .test-case-content {
    gap: 0.75rem;
  }

  .test-case-item {
    padding: 0.75rem;
    font-size: 0.8rem;
  }

  /* Monaco Editor 平板优化 */
  .monaco-editor-container {
    min-height: 350px;
    border-radius: 10px;
  }
}

/* 平板横屏模式优化 */
@media (min-width: 769px) and (max-width: 1024px) and (orientation: landscape) {
  .problem-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  .problem-description {
    max-height: 70vh;
    overflow-y: auto;
  }

  .code-editor-section {
    position: sticky;
    top: 1rem;
  }

  .monaco-editor-container {
    min-height: 400px;
  }
}

/* 平板竖屏模式优化 */
@media (min-width: 769px) and (max-width: 1024px) and (orientation: portrait) {
  .problem-content {
    display: flex;
    flex-direction: column;
  }

  .problem-description {
    max-height: 40vh;
    overflow-y: auto;
  }

  .monaco-editor-container {
    min-height: 300px;
  }
}

/* 中等屏幕设备的字体和间距优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  /* 优化代码块显示 */
  .problem-description pre {
    font-size: 0.8rem;
    padding: 1rem;
    border-radius: 8px;
  }

  .problem-description code {
    font-size: 0.8rem;
    padding: 0.2rem 0.4rem;
  }

  /* 优化列表显示 */
  .problem-description ul,
  .problem-description ol {
    padding-left: 1.5rem;
  }

  .problem-description li {
    margin-bottom: 0.5rem;
  }

  /* 优化表格显示 */
  .problem-description table {
    font-size: 0.85rem;
  }

  .problem-description th,
  .problem-description td {
    padding: 0.6rem 0.8rem;
  }

  /* 优化按钮组布局 */
  .editor-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .editor-actions .btn {
    flex: 1;
    min-width: 120px;
    max-width: 200px;
  }

  /* 优化结果显示 */
  .result-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .test-cases {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }
}

/* 平板设备的滚动优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .problem-description::-webkit-scrollbar,
  .result-section::-webkit-scrollbar {
    width: 8px;
  }

  .problem-description::-webkit-scrollbar-track,
  .result-section::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .problem-description::-webkit-scrollbar-thumb,
  .result-section::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  .problem-description::-webkit-scrollbar-thumb:hover,
  .result-section::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }
}

/* 平板设备的触摸优化 */
@media (min-width: 769px) and (max-width: 1024px) and (hover: none) {
  .btn:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .meta-item:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}
</style>
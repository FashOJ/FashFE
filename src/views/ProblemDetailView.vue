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
            <select v-model="selectedLanguage" class="language-select">
              <option v-for="lang in supportedLanguages" :key="lang.value" :value="lang.value">
                {{ lang.label }}
              </option>
            </select>
            <button @click="resetCode" class="reset-btn">重置代码</button>
          </div>
          
          <div class="code-editor">
            <textarea 
              v-model="userCode" 
              class="code-textarea"
              :placeholder="getCodeTemplate(selectedLanguage)"
              spellcheck="false"
            ></textarea>
          </div>

          <div class="editor-actions">
            <button @click="runCode" class="run-btn" :disabled="isRunning">
              {{ isRunning ? '运行中...' : '运行代码' }}
            </button>
            <button @click="submitCode" class="submit-btn" :disabled="isSubmitting">
              {{ isSubmitting ? '提交中...' : '提交答案' }}
            </button>
          </div>
        </div>

        <!-- 运行结果 -->
        <div v-if="runResult" class="run-result">
          <h4>运行结果</h4>
          <div class="result-content">
            <div v-if="runResult.success" class="result-success">
              <div class="result-item">
                <strong>输出：</strong>
                <pre>{{ runResult.output }}</pre>
              </div>
              <div class="result-item">
                <strong>执行时间：</strong>
                <span>{{ runResult.executionTime }}ms</span>
              </div>
            </div>
            <div v-else class="result-error">
              <strong>错误：</strong>
              <pre>{{ runResult.error }}</pre>
            </div>
          </div>
        </div>

        <!-- 提交结果 -->
        <div v-if="submitResult" class="submit-result">
          <h4>提交结果</h4>
          <div class="result-content">
            <div :class="['submit-status', submitResult.status]">
              {{ getStatusText(submitResult.status) }}
            </div>
            <div v-if="submitResult.details" class="submit-details">
              <div class="detail-item">
                <span>通过测试用例：</span>
                <span>{{ submitResult.details.passedTests }}/{{ submitResult.details.totalTests }}</span>
              </div>
              <div class="detail-item">
                <span>执行时间：</span>
                <span>{{ submitResult.details.executionTime }}ms</span>
              </div>
              <div class="detail-item">
                <span>内存消耗：</span>
                <span>{{ submitResult.details.memoryUsage }}MB</span>
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

interface RunResult {
  success: boolean
  output?: string
  error?: string
  executionTime?: number
}

interface SubmitResult {
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'memory_limit_exceeded' | 'runtime_error' | 'compile_error'
  details?: {
    passedTests: number
    totalTests: number
    executionTime: number
    memoryUsage: number
  }
}

const route = useRoute()
const problemId = computed(() => route.params.id as string)

// 支持的编程语言
const supportedLanguages = [
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'C', value: 'c' }
]

// 响应式数据
const selectedLanguage = ref('cpp')
const userCode = ref('')
const isRunning = ref(false)
const isSubmitting = ref(false)
const runResult = ref<RunResult | null>(null)
const submitResult = ref<SubmitResult | null>(null)

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

// 获取代码模板
const getCodeTemplate = (language: string) => {
  const templates = {
    cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // 在这里编写你的代码
        
    }
};

int main() {
    // 测试代码
    return 0;
}`,
    java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // 在这里编写你的代码
        
    }
}

public class Main {
    public static void main(String[] args) {
        // 测试代码
    }
}`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # 在这里编写你的代码
        pass

# 测试代码
if __name__ == "__main__":
    pass`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // 在这里编写你的代码
    
};

// 测试代码`,
    c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // 在这里编写你的代码
    
}

int main() {
    // 测试代码
    return 0;
}`
  }
  return templates[language as keyof typeof templates] || ''
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
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟运行结果
    runResult.value = {
      success: true,
      output: '0 1',
      executionTime: 15
    }
  } catch {
    runResult.value = {
      success: false,
      error: '编译错误：语法错误'
    }
  } finally {
    isRunning.value = false
  }
}

// 提交代码
const submitCode = async () => {
  if (!userCode.value.trim()) {
    alert('请先输入代码')
    return
  }

  isSubmitting.value = true
  submitResult.value = null

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 模拟提交结果
    submitResult.value = {
      status: 'accepted',
      details: {
        passedTests: 58,
        totalTests: 58,
        executionTime: 12,
        memoryUsage: 15.2
      }
    }
  } catch {
    submitResult.value = {
      status: 'runtime_error'
    }
  } finally {
    isSubmitting.value = false
  }
}

// 获取状态文本
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

// 初始化
onMounted(() => {
  resetCode()
})
</script>

<style scoped>
.problem-detail-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.problem-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.problem-meta {
  margin-bottom: 16px;
}

.back-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 16px;
  display: inline-block;
}

.back-link:hover {
  text-decoration: underline;
}

.problem-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.problem-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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

.tag {
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
}

.problem-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.problem-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.problem-description {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.description-section {
  margin-bottom: 24px;
}

.description-section:last-child {
  margin-bottom: 0;
}

.description-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.description-content {
  color: #666;
  line-height: 1.6;
}

.description-content p {
  margin: 0 0 12px 0;
}

.description-content code {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.description-content ul {
  margin: 0;
  padding-left: 20px;
}

.example {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 16px;
}

.example:last-child {
  margin-bottom: 0;
}

.example-title {
  background: #fafafa;
  padding: 8px 12px;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 500;
  font-size: 14px;
}

.example-content {
  padding: 12px;
}

.example-input,
.example-output {
  margin-bottom: 8px;
}

.example-input strong,
.example-output strong {
  color: #333;
  font-size: 14px;
}

.example-input pre,
.example-output pre {
  background: #f8f8f8;
  padding: 8px;
  border-radius: 4px;
  margin: 4px 0 0 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  overflow-x: auto;
}

.example-explanation {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.example-explanation strong {
  color: #333;
  font-size: 14px;
}

.example-explanation p {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 14px;
}

.code-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.code-editor-container {
  margin-bottom: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.language-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.reset-btn {
  padding: 6px 12px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.reset-btn:hover {
  background: #e8e8e8;
}

.code-editor {
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
}

.code-textarea {
  width: 100%;
  height: 400px;
  padding: 16px;
  border: none;
  outline: none;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  background: #fafafa;
}

.editor-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.run-btn,
.submit-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.run-btn {
  background: #52c41a;
  color: white;
}

.run-btn:hover:not(:disabled) {
  background: #389e0d;
}

.submit-btn {
  background: #1890ff;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #096dd9;
}

.run-btn:disabled,
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.run-result,
.submit-result {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.run-result:last-child,
.submit-result:last-child {
  margin-bottom: 0;
}

.run-result h4,
.submit-result h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.result-success {
  color: #52c41a;
}

.result-error {
  color: #ff4d4f;
}

.result-item {
  margin-bottom: 8px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.result-item strong {
  font-weight: 500;
}

.result-item pre {
  background: white;
  padding: 8px;
  border-radius: 4px;
  margin: 4px 0 0 0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  border: 1px solid #e8e8e8;
}

.submit-status {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.submit-status.accepted {
  color: #52c41a;
}

.submit-status.wrong_answer,
.submit-status.runtime_error,
.submit-status.compile_error {
  color: #ff4d4f;
}

.submit-status.time_limit_exceeded,
.submit-status.memory_limit_exceeded {
  color: #fa8c16;
}

.submit-details {
  background: white;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .problem-content {
    grid-template-columns: 1fr;
  }
  
  .code-section {
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .problem-detail-view {
    padding: 12px;
  }
  
  .problem-header {
    padding: 16px;
  }
  
  .problem-title {
    font-size: 20px;
  }
  
  .problem-stats {
    gap: 16px;
  }
  
  .problem-description,
  .code-section {
    padding: 16px;
  }
  
  .editor-header {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .editor-actions {
    flex-direction: column;
  }
  
  .code-textarea {
    height: 300px;
  }
}
</style>
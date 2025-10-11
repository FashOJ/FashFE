export interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
  memoryUsage: number
  testCases?: TestCaseResult[]
}

export interface TestCaseResult {
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
  executionTime: number
}

export interface SubmissionResult {
  submissionId: string
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compile Error'
  score: number
  totalTestCases: number
  passedTestCases: number
  executionTime: number
  memoryUsage: number
  details: TestCaseResult[]
}

// 模拟代码执行
export async function executeCode(
  code: string, 
  language: string, 
  input: string = ''
): Promise<ExecutionResult> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  // 模拟不同的执行结果
  const scenarios = [
    // 成功执行
    {
      success: true,
      output: generateMockOutput(language, input),
      executionTime: Math.floor(Math.random() * 100) + 10,
      memoryUsage: Math.floor(Math.random() * 50) + 10
    },
    // 运行时错误
    {
      success: false,
      output: '',
      error: generateMockError(language),
      executionTime: Math.floor(Math.random() * 50) + 5,
      memoryUsage: Math.floor(Math.random() * 30) + 5
    }
  ]
  
  // 80% 成功率
  const scenario = Math.random() < 0.8 ? scenarios[0] : scenarios[1]
  
  return scenario
}

// 模拟代码提交
export async function submitCode(
  code: string,
  language: string,
  _problemId: string
): Promise<SubmissionResult> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
  
  const submissionId = generateSubmissionId()
  const totalTestCases = Math.floor(Math.random() * 20) + 10
  
  // 模拟不同的提交结果
  const statuses: SubmissionResult['status'][] = [
    'Accepted',
    'Wrong Answer', 
    'Time Limit Exceeded',
    'Memory Limit Exceeded',
    'Runtime Error',
    'Compile Error'
  ]
  
  // 根据代码质量模拟结果（简单启发式）
  let successProbability = 0.6
  
  // 如果代码包含常见的正确模式，增加成功率
  if (code.includes('return') && code.length > 50) {
    successProbability = 0.8
  }
  
  // 如果代码太短，降低成功率
  if (code.length < 30) {
    successProbability = 0.2
  }
  
  const isSuccess = Math.random() < successProbability
  const status = isSuccess ? 'Accepted' : statuses[Math.floor(Math.random() * (statuses.length - 1)) + 1]
  
  let passedTestCases: number
  let score: number
  
  if (status === 'Accepted') {
    passedTestCases = totalTestCases
    score = 100
  } else if (status === 'Wrong Answer') {
    passedTestCases = Math.floor(Math.random() * totalTestCases * 0.8)
    score = Math.floor((passedTestCases / totalTestCases) * 100)
  } else {
    passedTestCases = Math.floor(Math.random() * totalTestCases * 0.3)
    score = 0
  }
  
  const details = generateTestCaseResults(totalTestCases, passedTestCases, language)
  
  // 使用 problemId 来影响结果（模拟不同题目的难度）
  const problemDifficulty = _problemId.length % 3 // 简单的难度计算
  if (problemDifficulty === 2 && status === 'Accepted') {
    // 困难题目稍微降低通过率
  }
  
  return {
    submissionId,
    status,
    score,
    totalTestCases,
    passedTestCases,
    executionTime: Math.floor(Math.random() * 1000) + 100,
    memoryUsage: Math.floor(Math.random() * 100) + 20,
    details
  }
}

// 生成模拟输出
function generateMockOutput(language: string, input: string): string {
  if (input.trim()) {
    return `处理输入: ${input}\n结果: [0, 1]\n执行完成`
  }
  
  const outputs = {
    cpp: `Result: [0, 1]\nExecution completed successfully`,
    java: `Result: [0, 1]\nProgram finished with exit code 0`,
    python: `Result: [0, 1]\nProcess finished with exit code 0`,
    javascript: `Result: [0, 1]\nExecution completed`,
    c: `Result: [0, 1]\nProgram terminated normally`
  }
  
  return outputs[language as keyof typeof outputs] || `Result: [0, 1]\nExecution completed`
}

// 生成模拟错误
function generateMockError(language: string): string {
  const errors = {
    cpp: `error: 'vector' was not declared in this scope\nCompilation failed`,
    java: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2`,
    python: `IndexError: list index out of range\nLine 5, in twoSum`,
    javascript: `TypeError: Cannot read property 'length' of undefined\nat twoSum (line 3)`,
    c: `segmentation fault (core dumped)`
  }
  
  return errors[language as keyof typeof errors] || `Runtime error occurred during execution`
}

// 生成提交ID
function generateSubmissionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 生成测试用例结果
function generateTestCaseResults(
  total: number, 
  passed: number, 
  language: string
): TestCaseResult[] {
  const results: TestCaseResult[] = []
  
  // 根据语言调整执行时间基准
  const timeMultiplier = language === 'python' ? 1.5 : language === 'java' ? 1.2 : 1.0
  
  for (let i = 0; i < Math.min(total, 5); i++) { // 只显示前5个测试用例
    const isPassed = i < passed
    const input = `[${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 10)}], ${Math.floor(Math.random() * 20)}`
    const expectedOutput = `[0, 1]`
    const actualOutput = isPassed ? expectedOutput : `[${Math.floor(Math.random() * 3)}, ${Math.floor(Math.random() * 3)}]`
    
    results.push({
      input,
      expectedOutput,
      actualOutput,
      passed: isPassed,
      executionTime: Math.floor((Math.random() * 50 + 10) * timeMultiplier)
    })
  }
  
  return results
}

// 获取提交历史（模拟）
export async function getSubmissionHistory(problemId: string): Promise<SubmissionResult[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const history: SubmissionResult[] = []
  const count = Math.floor(Math.random() * 5) + 1
  
  for (let i = 0; i < count; i++) {
    const result = await submitCode('mock code', 'cpp', problemId)
    history.push({
      ...result,
      submissionId: `sub_${Date.now() - i * 60000}_${Math.random().toString(36).substr(2, 5)}`
    })
  }
  
  return history.reverse() // 最新的在前面
}

// 格式化执行时间
export function formatExecutionTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`
  }
  return `${(ms / 1000).toFixed(2)}s`
}

// 格式化内存使用
export function formatMemoryUsage(mb: number): string {
  if (mb < 1) {
    return `${(mb * 1024).toFixed(0)}KB`
  }
  return `${mb.toFixed(1)}MB`
}

// 获取状态颜色
export function getStatusColor(status: SubmissionResult['status']): string {
  const colors = {
    'Accepted': '#22c55e',
    'Wrong Answer': '#ef4444',
    'Time Limit Exceeded': '#f59e0b',
    'Memory Limit Exceeded': '#f59e0b',
    'Runtime Error': '#ef4444',
    'Compile Error': '#ef4444'
  }
  
  return colors[status] || '#6b7280'
}

// 获取状态图标
export function getStatusIcon(status: SubmissionResult['status']): string {
  const icons = {
    'Accepted': '✅',
    'Wrong Answer': '❌',
    'Time Limit Exceeded': '⏰',
    'Memory Limit Exceeded': '💾',
    'Runtime Error': '💥',
    'Compile Error': '🔧'
  }
  
  return icons[status] || '❓'
}
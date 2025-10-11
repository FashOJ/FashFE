import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  nickname?: string
  bio?: string
  level: number
  exp: number
  solvedCount: number
  submissionCount: number
  acceptanceRate: number
  ranking: number
  createdAt: string
  lastLoginAt: string
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  nickname?: string
}

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const userLevel = computed(() => {
    if (!user.value) return 0
    return Math.floor(user.value.exp / 1000) + 1
  })
  const nextLevelExp = computed(() => {
    if (!user.value) return 1000
    const currentLevel = userLevel.value
    return currentLevel * 1000
  })
  const expProgress = computed(() => {
    if (!user.value) return 0
    const currentLevelExp = (userLevel.value - 1) * 1000
    const expInCurrentLevel = user.value.exp - currentLevelExp
    return (expInCurrentLevel / 1000) * 100
  })

  // 设置认证信息
  const setAuth = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('user_data', JSON.stringify(userData))
  }

  // 清除认证信息
  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  // 从本地存储恢复用户信息
  const restoreAuth = () => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Failed to restore auth data:', error)
        clearAuth()
      }
    }
  }

  // 登录
  const login = async (credentials: LoginCredentials): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 模拟登录验证
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const userData: User = {
          id: 1,
          username: 'admin',
          email: 'admin@fashoj.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          nickname: '管理员',
          bio: '系统管理员账户',
          level: 10,
          exp: 15680,
          solvedCount: 156,
          submissionCount: 342,
          acceptanceRate: 78.5,
          ranking: 1,
          createdAt: '2023-01-01T00:00:00Z',
          lastLoginAt: new Date().toISOString()
        }
        
        const authToken = 'mock_jwt_token_' + Date.now()
        setAuth(userData, authToken)
      } else if (credentials.username === 'user' && credentials.password === 'user123') {
        const userData: User = {
          id: 2,
          username: 'user',
          email: 'user@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
          nickname: '普通用户',
          bio: '热爱编程的学习者',
          level: 5,
          exp: 4250,
          solvedCount: 45,
          submissionCount: 89,
          acceptanceRate: 65.2,
          ranking: 128,
          createdAt: '2023-06-15T00:00:00Z',
          lastLoginAt: new Date().toISOString()
        }
        
        const authToken = 'mock_jwt_token_' + Date.now()
        setAuth(userData, authToken)
      } else {
        throw new Error('用户名或密码错误')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '登录失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 注册
  const register = async (data: RegisterData): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // 验证密码确认
      if (data.password !== data.confirmPassword) {
        throw new Error('两次输入的密码不一致')
      }

      // 验证密码强度
      if (data.password.length < 6) {
        throw new Error('密码长度至少为6位')
      }

      // 验证用户名格式
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(data.username)) {
        throw new Error('用户名只能包含字母、数字和下划线，长度3-20位')
      }

      // 验证邮箱格式
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('请输入有效的邮箱地址')
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 模拟注册验证（检查用户名是否已存在）
      if (data.username === 'admin' || data.username === 'user') {
        throw new Error('用户名已存在')
      }

      if (data.email === 'admin@fashoj.com' || data.email === 'user@example.com') {
        throw new Error('邮箱已被注册')
      }

      // 创建新用户
      const userData: User = {
        id: Date.now(),
        username: data.username,
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        nickname: data.nickname || data.username,
        bio: '',
        level: 1,
        exp: 0,
        solvedCount: 0,
        submissionCount: 0,
        acceptanceRate: 0,
        ranking: 0,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }

      const authToken = 'mock_jwt_token_' + Date.now()
      setAuth(userData, authToken)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '注册失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const logout = async (): Promise<void> => {
    isLoading.value = true
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      clearAuth()
    } finally {
      isLoading.value = false
    }
  }

  // 更新用户信息
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user.value) throw new Error('用户未登录')
    
    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedUser = { ...user.value, ...updates }
      user.value = updatedUser
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 修改密码
  const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    if (!user.value) throw new Error('用户未登录')
    
    isLoading.value = true
    error.value = null

    try {
      // 验证新密码强度
      if (newPassword.length < 6) {
        throw new Error('新密码长度至少为6位')
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 模拟验证旧密码（实际应用中应该在后端验证）
      // 这里简单模拟一下
      console.log('密码修改成功')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '密码修改失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 检查认证状态
  const checkAuth = async (): Promise<void> => {
    if (!token.value) return

    try {
      // 模拟验证token有效性
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 如果token无效，清除认证信息
      // 这里简单模拟token永远有效
      if (user.value) {
        user.value.lastLoginAt = new Date().toISOString()
      }
    } catch (err) {
      console.error('Token validation failed:', err)
      clearAuth()
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    // 状态
    user,
    token,
    isLoading,
    error,
    
    // 计算属性
    isAuthenticated,
    userLevel,
    nextLevelExp,
    expProgress,
    
    // 方法
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuth,
    restoreAuth,
    clearAuth,
    clearError
  }
})
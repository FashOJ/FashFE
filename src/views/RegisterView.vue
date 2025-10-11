<template>
  <div class="register-view">
    <div class="register-container">
      <div class="register-card">
        <!-- Logo and Title -->
        <div class="register-header">
          <img src="@/assets/logo.svg" alt="FashOJ" class="register-logo" />
          <h1 class="register-title">注册 FashOJ</h1>
          <p class="register-subtitle">开始你的编程学习之旅</p>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名 *</label>
            <input
              id="username"
              v-model="registerForm.username"
              type="text"
              class="form-input"
              :class="{ 'error': errors.username }"
              placeholder="3-20位字母、数字或下划线"
              required
            />
            <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">邮箱 *</label>
            <input
              id="email"
              v-model="registerForm.email"
              type="email"
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="请输入邮箱地址"
              required
            />
            <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
          </div>

          <div class="form-group">
            <label for="nickname" class="form-label">昵称</label>
            <input
              id="nickname"
              v-model="registerForm.nickname"
              type="text"
              class="form-input"
              placeholder="显示名称（可选）"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码 *</label>
            <div class="password-input">
              <input
                id="password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'error': errors.password }"
                placeholder="至少6位字符"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
            <div class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.level"
                  :style="{ width: passwordStrength.percentage + '%' }"
                ></div>
              </div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">确认密码 *</label>
            <div class="password-input">
              <input
                id="confirmPassword"
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'error': errors.confirmPassword }"
                placeholder="请再次输入密码"
                required
              />
              <button
                type="button"
                class="password-toggle"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="registerForm.agreeTerms" type="checkbox" class="checkbox" required />
              <span class="checkbox-text">
                我已阅读并同意
                <a href="/terms" target="_blank" class="terms-link">用户协议</a>
                和
                <a href="/privacy" target="_blank" class="terms-link">隐私政策</a>
              </span>
            </label>
          </div>

          <button type="submit" class="register-btn" :disabled="isLoading || !isFormValid">
            <span v-if="isLoading" class="loading-spinner">⏳</span>
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </form>

        <!-- Error Message -->
        <div v-if="authStore.error" class="error-alert">
          <span class="error-icon">⚠️</span>
          {{ authStore.error }}
          <button @click="authStore.clearError" class="error-close">×</button>
        </div>

        <!-- Social Register -->
        <div class="social-register">
          <div class="divider">
            <span class="divider-text">或者使用</span>
          </div>
          <div class="social-buttons">
            <button class="social-btn github-btn" @click="handleSocialRegister('github')">
              GitHub
            </button>
            <button class="social-btn qq-btn" @click="handleSocialRegister('qq')">
              QQ
            </button>
          </div>
        </div>

        <!-- Login Link -->
        <div class="login-link">
          <span>已有账号？</span>
          <RouterLink to="/login" class="login-btn-link">立即登录</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

interface RegisterForm {
  username: string
  email: string
  nickname: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const registerForm = ref<RegisterForm>({
  username: '',
  email: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

// 状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerForm.value.password
  if (!password) return { level: 'none', percentage: 0, text: '' }

  let score = 0

  // 长度检查
  if (password.length >= 6) score += 20
  if (password.length >= 8) score += 10
  if (password.length >= 12) score += 10

  // 字符类型检查
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[^a-zA-Z0-9]/.test(password)) score += 20

  // 复杂度检查
  if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) score += 10
  if (/(?=.*[a-z])(?=.*[0-9])/.test(password)) score += 5
  if (/(?=.*[A-Z])(?=.*[0-9])/.test(password)) score += 5

  let level = 'weak'
  let text = '弱'

  if (score >= 80) {
    level = 'strong'
    text = '强'
  } else if (score >= 60) {
    level = 'medium'
    text = '中等'
  } else if (score >= 40) {
    level = 'fair'
    text = '一般'
  }

  return {
    level,
    percentage: Math.min(score, 100),
    text: `密码强度：${text}`
  }
})

// 表单验证
const isFormValid = computed(() => {
  return registerForm.value.username &&
         registerForm.value.email &&
         registerForm.value.password &&
         registerForm.value.confirmPassword &&
         registerForm.value.agreeTerms &&
         Object.keys(errors.value).length === 0
})

// 实时验证
const validateField = (field: string, value: string) => {
  switch (field) {
    case 'username':
      if (!value) {
        errors.value.username = '用户名不能为空'
      } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(value)) {
        errors.value.username = '用户名只能包含字母、数字和下划线，长度3-20位'
      } else {
        delete errors.value.username
      }
      break

    case 'email':
      if (!value) {
        errors.value.email = '邮箱不能为空'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.value.email = '请输入有效的邮箱地址'
      } else {
        delete errors.value.email
      }
      break

    case 'password':
      if (!value) {
        errors.value.password = '密码不能为空'
      } else if (value.length < 6) {
        errors.value.password = '密码长度至少为6位'
      } else {
        delete errors.value.password
      }
      break

    case 'confirmPassword':
      if (!value) {
        errors.value.confirmPassword = '请确认密码'
      } else if (value !== registerForm.value.password) {
        errors.value.confirmPassword = '两次输入的密码不一致'
      } else {
        delete errors.value.confirmPassword
      }
      break
  }
}

// 监听表单变化进行实时验证
watch(() => registerForm.value.username, (value) => validateField('username', value))
watch(() => registerForm.value.email, (value) => validateField('email', value))
watch(() => registerForm.value.password, (value) => {
  validateField('password', value)
  if (registerForm.value.confirmPassword) {
    validateField('confirmPassword', registerForm.value.confirmPassword)
  }
})
watch(() => registerForm.value.confirmPassword, (value) => validateField('confirmPassword', value))

// 注册处理
const handleRegister = async () => {
  // 清除之前的错误
  authStore.clearError()
  
  // 验证所有字段
  validateField('username', registerForm.value.username)
  validateField('email', registerForm.value.email)
  validateField('password', registerForm.value.password)
  validateField('confirmPassword', registerForm.value.confirmPassword)

  if (Object.keys(errors.value).length > 0) {
    return
  }

  isLoading.value = true

  try {
    await authStore.register({
      username: registerForm.value.username,
      email: registerForm.value.email,
      nickname: registerForm.value.nickname,
      password: registerForm.value.password,
      confirmPassword: registerForm.value.confirmPassword
    })

    // 注册成功后跳转
    router.push('/')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 社交注册
const handleSocialRegister = (provider: string) => {
  console.log(`使用 ${provider} 注册`)
  // 这里实现社交登录逻辑
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 450px;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.register-subtitle {
  color: #666;
  margin: 0;
}

.register-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-input.error {
  border-color: #ff4d4f;
}

.form-input.error:focus {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-fill.weak {
  background: #ff4d4f;
}

.strength-fill.fair {
  background: #fa8c16;
}

.strength-fill.medium {
  background: #fadb14;
}

.strength-fill.strong {
  background: #52c41a;
}

.strength-text {
  font-size: 12px;
  color: #666;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  line-height: 1.4;
}

.checkbox {
  margin-right: 8px;
  margin-top: 2px;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 14px;
  color: #666;
}

.terms-link {
  color: #1890ff;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-alert {
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ff4d4f;
  font-size: 14px;
}

.error-icon {
  flex-shrink: 0;
}

.error-close {
  background: none;
  border: none;
  color: #ff4d4f;
  cursor: pointer;
  font-size: 16px;
  margin-left: auto;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-register {
  margin-bottom: 24px;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e8e8e8;
}

.divider-text {
  background: white;
  padding: 0 16px;
  color: #999;
  font-size: 14px;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: #f5f5f5;
}

.github-btn:hover {
  border-color: #333;
  color: #333;
}

.qq-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.login-link {
  text-align: center;
  color: #666;
}

.login-btn-link {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.login-btn-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .register-card {
    padding: 24px;
  }
  
  .social-buttons {
    flex-direction: column;
  }
}

.register-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.register-subtitle {
  color: #666;
  margin: 0 0 32px 0;
}

.register-content {
  color: #666;
}

.back-link {
  color: #1890ff;
  text-decoration: none;
  margin-top: 16px;
  display: inline-block;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
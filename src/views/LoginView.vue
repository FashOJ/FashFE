<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-card">
        <!-- Logo and Title -->
        <div class="login-header">
          <img src="@/assets/logo.svg" alt="FashOJ" class="login-logo" />
          <h1 class="login-title">登录 FashOJ</h1>
          <p class="login-subtitle">欢迎回来，继续你的编程之旅</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名/邮箱</label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              class="form-input"
              placeholder="请输入用户名或邮箱"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <div class="password-input">
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="请输入密码"
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
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input v-model="loginForm.rememberMe" type="checkbox" class="checkbox" />
              <span class="checkbox-text">记住我</span>
            </label>
            <RouterLink to="/forgot-password" class="forgot-link">忘记密码？</RouterLink>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="loading-spinner">⏳</span>
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- Social Login -->
        <div class="social-login">
          <div class="divider">
            <span class="divider-text">或者使用</span>
          </div>
          <div class="social-buttons">
            <button class="social-btn github-btn">
              GitHub
            </button>
            <button class="social-btn qq-btn">
              QQ
            </button>
          </div>
        </div>

        <!-- Register Link -->
        <div class="register-link">
          <span>还没有账号？</span>
          <RouterLink to="/register" class="register-btn">立即注册</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

const router = useRouter()

// 表单数据
const loginForm = ref<LoginForm>({
  username: '',
  password: '',
  rememberMe: false
})

// 状态
const showPassword = ref(false)
const isLoading = ref(false)

// 登录处理
const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // 这里会调用登录API
    console.log('登录数据:', loginForm.value)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 登录成功后跳转
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    // 这里会显示错误消息
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.login-subtitle {
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox {
  margin-right: 8px;
}

.checkbox-text {
  font-size: 14px;
  color: #666;
}

.forgot-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}

.forgot-link:hover {
  text-decoration: underline;
}

.login-btn {
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

.login-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.login-btn:disabled {
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

.social-login {
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

.social-icon {
  font-size: 16px;
}

.register-link {
  text-align: center;
  color: #666;
}

.register-btn {
  color: #1890ff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 4px;
}

.register-btn:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
  
  .social-buttons {
    flex-direction: column;
  }
}
</style>
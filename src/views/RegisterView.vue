<template>
  <div class="register-view">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <img src="@/assets/logo.svg" alt="FashOJ" class="register-logo" />
          <h1 class="register-title">注册 FashOJ</h1>
          <p class="register-subtitle">加入我们，开始你的编程之旅</p>
        </div>
        
        <div class="register-content">
          <p>注册页面正在开发中...</p>
          <RouterLink to="/login" class="back-link">返回登录</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 注册页面组件
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
  max-width: 400px;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
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
<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo and Brand -->
      <div class="brand">
        <RouterLink to="/" class="brand-link">
          <img src="@/assets/logo.svg" alt="FashOJ" class="logo" />
          <span class="brand-text">FashOJ</span>
        </RouterLink>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu" :class="{ 'nav-open': isMenuOpen }">
        <RouterLink to="/" class="nav-item">首页</RouterLink>
        <RouterLink to="/problems" class="nav-item">题库</RouterLink>
        <RouterLink to="/contests" class="nav-item">比赛</RouterLink>
        <RouterLink to="/submissions" class="nav-item">提交记录</RouterLink>
        <RouterLink to="/ranking" class="nav-item">排行榜</RouterLink>
        <RouterLink to="/discuss" class="nav-item">讨论</RouterLink>
      </nav>

      <!-- User Actions -->
      <div class="user-actions">
        <div v-if="isLoggedIn" class="user-menu">
          <div class="user-info" @click="toggleUserMenu">
            <img :src="userAvatar" alt="用户头像" class="user-avatar" />
            <span class="username">{{ username }}</span>
            <i class="arrow-down">▼</i>
          </div>
          <div v-if="showUserMenu" class="user-dropdown">
            <RouterLink to="/profile" class="dropdown-item">个人中心</RouterLink>
            <RouterLink to="/settings" class="dropdown-item">设置</RouterLink>
            <div class="dropdown-divider"></div>
            <a href="#" @click="logout" class="dropdown-item">退出登录</a>
          </div>
        </div>
        <div v-else class="auth-buttons">
          <RouterLink to="/login" class="btn btn-outline">登录</RouterLink>
          <RouterLink to="/register" class="btn btn-primary">注册</RouterLink>
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 移动端菜单状态
const isMenuOpen = ref(false)
const showUserMenu = ref(false)

// 用户状态 (这里先用模拟数据，后续会接入真实的用户状态管理)
const isLoggedIn = ref(false)
const username = ref('用户名')
const userAvatar = ref('https://via.placeholder.com/32x32')

const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  // 退出登录逻辑
  isLoggedIn.value = false
  showUserMenu.value = false
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1890ff;
  font-weight: 600;
  font-size: 20px;
}

.logo {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.brand-text {
  color: #1890ff;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #1890ff;
  background-color: #f0f8ff;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.user-info:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.username {
  font-weight: 500;
  color: #333;
}

.arrow-down {
  font-size: 12px;
  color: #999;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  padding: 8px 0;
  margin-top: 4px;
}

.dropdown-item {
  display: block;
  padding: 8px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 8px 0;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.btn-outline {
  color: #1890ff;
  border-color: #1890ff;
}

.btn-outline:hover {
  background-color: #f0f8ff;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}

.btn-primary:hover {
  background-color: #40a9ff;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.mobile-menu-toggle span {
  width: 20px;
  height: 2px;
  background-color: #333;
  margin: 2px 0;
  transition: 0.3s;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e8e8e8;
    flex-direction: column;
    gap: 0;
    padding: 16px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .nav-menu.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-item {
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .user-actions {
    order: -1;
  }
}
</style>
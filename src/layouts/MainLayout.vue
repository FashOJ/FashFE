<template>
  <div class="main-layout">
    <!-- Header -->
    <AppHeader @toggle-sidebar="toggleMobileSidebar" />

    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isMobileSidebarOpen" 
      class="sidebar-overlay" 
      @click="closeMobileSidebar"
    ></div>

    <!-- Main Content Area -->
    <div class="layout-container">
      <!-- Sidebar -->
      <AppSidebar 
        v-if="showSidebar" 
        :class="{ 'sidebar-mobile-open': isMobileSidebarOpen }"
        @close="closeMobileSidebar"
      />

      <!-- Content -->
      <main class="main-content" :class="{ 'with-sidebar': showSidebar }">
        <!-- Mobile Sidebar Toggle -->
        <div v-if="showSidebar" class="mobile-sidebar-toggle">
          <button 
            class="sidebar-toggle-btn" 
            @click="toggleMobileSidebar"
            :aria-label="isMobileSidebarOpen ? '关闭侧边栏' : '打开侧边栏'"
          >
            <span class="toggle-icon">☰</span>
          </button>
        </div>

        <!-- Breadcrumb -->
        <AppBreadcrumb />

        <!-- Page Content -->
        <div class="page-content">
          <RouterView />
        </div>
      </main>
    </div>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'

const route = useRoute()

// 移动端侧边栏状态
const isMobileSidebarOpen = ref(false)

// 控制侧边栏显示
const showSidebar = computed(() => {
  // 在某些页面隐藏侧边栏，比如登录页
  const hideSidebarRoutes = ['/login', '/register']
  return !hideSidebarRoutes.includes(route.path)
})

// 移动端侧边栏控制
const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false
}

// 监听窗口大小变化，大屏幕时自动关闭移动端侧边栏
const handleResize = () => {
  if (window.innerWidth > 768) {
    isMobileSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.layout-container {
  flex: 1;
  display: flex;
  position: relative;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: none;
}

.main-content {
  flex: 1;
  padding: 16px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  min-height: calc(100vh - 64px - 60px); /* 减去header和footer高度 */
}

.main-content.with-sidebar {
  margin-left: 0;
}

.mobile-sidebar-toggle {
  display: none;
  margin-bottom: 16px;
}

.sidebar-toggle-btn {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-btn:hover {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #1890ff;
}

.toggle-icon {
  font-size: 16px;
}

.page-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  min-height: calc(100vh - 200px);
}

/* 平板设备 */
@media (max-width: 1024px) {
  .main-content {
    padding: 12px;
  }
  
  .page-content {
    padding: 20px;
    border-radius: 8px;
  }
}

/* 移动设备 */
@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
  }
  
  .main-content {
    padding: 8px;
  }

  .mobile-sidebar-toggle {
    display: block;
  }

  .page-content {
    padding: 16px;
    border-radius: 8px;
    min-height: calc(100vh - 180px);
  }
  
  /* 侧边栏在移动端的样式 */
  .app-sidebar {
    position: fixed !important;
    left: -240px !important;
    top: 64px !important;
    height: calc(100vh - 64px) !important;
    z-index: 999 !important;
    transition: left 0.3s ease !important;
  }
  
  .sidebar-mobile-open {
    left: 0 !important;
  }
}

/* 小屏手机 */
@media (max-width: 480px) {
  .main-content {
    padding: 4px;
  }
  
  .page-content {
    padding: 12px;
    margin: 0;
  }
  
  .sidebar-toggle-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
}

/* 大屏设备优化 */
@media (min-width: 1200px) {
  .layout-container {
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .main-content {
    padding: 24px;
  }
  
  .page-content {
    padding: 32px;
  }
}

/* 超大屏设备 */
@media (min-width: 1600px) {
  .layout-container {
    max-width: 1600px;
  }
  
  .main-content {
    padding: 32px;
  }
}
</style>

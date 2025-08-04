<template>
  <div class="main-layout">
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content Area -->
    <div class="layout-container">
      <!-- Sidebar -->
      <AppSidebar v-if="showSidebar" />
      
      <!-- Content -->
      <main class="main-content" :class="{ 'with-sidebar': showSidebar }">
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppFooter from './components/AppFooter.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'

const route = useRoute()

// 控制侧边栏显示
const showSidebar = computed(() => {
  // 在某些页面隐藏侧边栏，比如登录页
  const hideSidebarRoutes = ['/login', '/register']
  return !hideSidebarRoutes.includes(route.path)
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-container {
  flex: 1;
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  transition: margin-left 0.3s ease;
}

.main-content.with-sidebar {
  margin-left: 0;
}

.page-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
  
  .page-content {
    padding: 16px;
  }
}
</style>
<template>
  <div class="main-layout">
    <!-- 头部导航 -->
    <AppHeader />
    
    <!-- 面包屑导航 -->
    <AppBreadcrumb />
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="page-content">
        <RouterView />
      </div>
    </main>
    
    <!-- 底部 -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 FashOJ. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import AppBreadcrumb from './components/AppBreadcrumb.vue'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.app-footer {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  padding: 20px 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-content {
    padding: 20px;
  }
  
  .footer-content {
    padding: 0 20px;
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: 16px;
  }
  
  .footer-content {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 12px;
  }
  
  .footer-content {
    padding: 0 12px;
    font-size: 13px;
  }
}
</style>

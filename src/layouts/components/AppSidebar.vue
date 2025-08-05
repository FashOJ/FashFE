<template>
  <aside class="app-sidebar" :class="{ 'sidebar-collapsed': isCollapsed, 'sidebar-mobile-open': isMobileOpen }">
    <div class="sidebar-content">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <h3 v-if="!isCollapsed" class="sidebar-title">导航菜单</h3>
        <button 
          v-if="!isMobile" 
          @click="$emit('toggle-collapse')" 
          class="collapse-btn"
          :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
        >
          {{ isCollapsed ? '→' : '←' }}
        </button>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h4 v-if="!isCollapsed" class="section-title">学习</h4>
          <RouterLink to="/problems" class="nav-item">
            <span class="nav-text">题库</span>
          </RouterLink>
          <RouterLink to="/contests" class="nav-item">
            <span class="nav-text">比赛</span>
          </RouterLink>
          <RouterLink to="/ranking" class="nav-item">
            <span class="nav-text">排行榜</span>
          </RouterLink>
          <RouterLink to="/achievements" class="nav-item">
            <span class="nav-text">成就</span>
          </RouterLink>
        </div>

        <div class="nav-section">
          <h4 v-if="!isCollapsed" class="section-title">个人</h4>
          <RouterLink to="/profile" class="nav-item">
            <span class="nav-text">个人中心</span>
          </RouterLink>
          <RouterLink to="/submissions" class="nav-item">
            <span class="nav-text">提交记录</span>
          </RouterLink>
          <RouterLink to="/favorites" class="nav-item">
            <span class="nav-text">收藏夹</span>
          </RouterLink>
          <RouterLink to="/notes" class="nav-item">
            <span class="nav-text">笔记</span>
          </RouterLink>
        </div>

        <div class="nav-section">
          <h4 v-if="!isCollapsed" class="section-title">社区</h4>
          <RouterLink to="/discuss" class="nav-item">
            <span class="nav-text">讨论区</span>
          </RouterLink>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface Props {
  isCollapsed?: boolean
  isMobileOpen?: boolean
  isMobile?: boolean
}

withDefaults(defineProps<Props>(), {
  isCollapsed: false,
  isMobileOpen: false,
  isMobile: false
})

defineEmits<{
  'toggle-collapse': []
}>()
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  height: 100vh;
  position: sticky;
  top: 64px;
  transition: all 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
}

.sidebar-content {
  padding: 20px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.collapse-btn {
  background: none;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  color: #1890ff;
}

.sidebar-nav {
  flex: 1;
  padding: 0 12px;
}

.nav-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px 8px;
  padding: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  margin: 2px 0;
  border-radius: 8px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  background-color: #f0f8ff;
  color: #1890ff;
  transform: translateX(2px);
}

.nav-item.router-link-active {
  background-color: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.nav-item.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #1890ff;
}

.nav-text {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 收起状态 */
.sidebar-collapsed {
  width: 64px;
}

.sidebar-collapsed .sidebar-header {
  padding: 0 12px 16px;
  justify-content: center;
}

.sidebar-collapsed .sidebar-title {
  display: none;
}

.sidebar-collapsed .collapse-btn {
  margin: 0;
}

.sidebar-collapsed .nav-section {
  margin-bottom: 16px;
}

.sidebar-collapsed .section-title {
  display: none;
}

.sidebar-collapsed .nav-item {
  padding: 12px;
  justify-content: center;
  margin: 4px 0;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.sidebar-collapsed .nav-item:hover {
  transform: none;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    top: 64px;
    left: -240px;
    z-index: 998;
    height: calc(100vh - 64px);
    transition: left 0.3s ease;
  }

  .sidebar-mobile-open {
    left: 0;
  }

  .sidebar-collapsed {
    left: -64px;
  }

  .sidebar-collapsed.sidebar-mobile-open {
    left: 0;
  }
}

/* 平板设备优化 */
@media (max-width: 1024px) and (min-width: 769px) {
  .app-sidebar {
    width: 200px;
  }

  .sidebar-collapsed {
    width: 56px;
  }

  .nav-item {
    padding: 8px 10px;
    font-size: 13px;
  }

  .sidebar-collapsed .nav-item {
    padding: 10px;
  }
}

/* 小屏设备 */
@media (max-width: 480px) {
  .app-sidebar {
    width: 100vw;
    left: -100vw;
  }

  .sidebar-mobile-open {
    left: 0;
  }

  .sidebar-content {
    padding: 16px 0;
  }

  .sidebar-header {
    padding: 0 16px 12px;
  }

  .sidebar-nav {
    padding: 0 8px;
  }

  .nav-item {
    padding: 12px 16px;
    font-size: 16px;
  }
}

/* 滚动条样式 */
.app-sidebar::-webkit-scrollbar {
  width: 4px;
}

.app-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.app-sidebar::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

.app-sidebar::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>

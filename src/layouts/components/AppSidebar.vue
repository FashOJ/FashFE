<template>
  <aside class="app-sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- Sidebar Toggle -->
    <div class="sidebar-header">
      <button class="collapse-btn" @click="toggleCollapse">
        <span class="collapse-icon">{{ isCollapsed ? '→' : '←' }}</span>
      </button>
    </div>

    <!-- Sidebar Menu -->
    <nav class="sidebar-nav">
      <div class="nav-section">
        <div class="section-title" v-if="!isCollapsed">题目</div>
        <RouterLink to="/problems" class="nav-link" title="题库">
          <i class="icon">📚</i>
          <span v-if="!isCollapsed" class="nav-text">题库</span>
        </RouterLink>
        <RouterLink to="/problems/random" class="nav-link" title="随机题目">
          <i class="icon">🎲</i>
          <span v-if="!isCollapsed" class="nav-text">随机题目</span>
        </RouterLink>
        <RouterLink to="/problems/favorites" class="nav-link" title="收藏题目">
          <i class="icon">⭐</i>
          <span v-if="!isCollapsed" class="nav-text">收藏题目</span>
        </RouterLink>
      </div>

      <div class="nav-section">
        <div class="section-title" v-if="!isCollapsed">比赛</div>
        <RouterLink to="/contests" class="nav-link" title="比赛列表">
          <i class="icon">🏆</i>
          <span v-if="!isCollapsed" class="nav-text">比赛列表</span>
        </RouterLink>
        <RouterLink to="/contests/my" class="nav-link" title="我的比赛">
          <i class="icon">👤</i>
          <span v-if="!isCollapsed" class="nav-text">我的比赛</span>
        </RouterLink>
      </div>

      <div class="nav-section">
        <div class="section-title" v-if="!isCollapsed">记录</div>
        <RouterLink to="/submissions" class="nav-link" title="提交记录">
          <i class="icon">📝</i>
          <span v-if="!isCollapsed" class="nav-text">提交记录</span>
        </RouterLink>
        <RouterLink to="/submissions/my" class="nav-link" title="我的提交">
          <i class="icon">📋</i>
          <span v-if="!isCollapsed" class="nav-text">我的提交</span>
        </RouterLink>
      </div>

      <div class="nav-section">
        <div class="section-title" v-if="!isCollapsed">社区</div>
        <RouterLink to="/ranking" class="nav-link" title="排行榜">
          <i class="icon">🏅</i>
          <span v-if="!isCollapsed" class="nav-text">排行榜</span>
        </RouterLink>
        <RouterLink to="/discuss" class="nav-link" title="讨论区">
          <i class="icon">💬</i>
          <span v-if="!isCollapsed" class="nav-text">讨论区</span>
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 侧边栏折叠状态
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  height: calc(100vh - 64px);
  position: sticky;
  top: 64px;
  transition: width 0.3s ease;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
}

.collapse-btn {
  background: none;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: #f5f5f5;
  border-color: #d9d9d9;
}

.collapse-icon {
  font-size: 14px;
  color: #666;
}

.sidebar-nav {
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 24px;
}

.section-title {
  padding: 0 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background-color: #f5f5f5;
  color: #1890ff;
}

.nav-link.router-link-active {
  background-color: #e6f7ff;
  color: #1890ff;
  border-right: 3px solid #1890ff;
}

.icon {
  font-size: 18px;
  margin-right: 12px;
  min-width: 18px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
  white-space: nowrap;
}

.sidebar-collapsed .nav-link {
  justify-content: center;
  padding: 12px;
}

.sidebar-collapsed .icon {
  margin-right: 0;
}

@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    left: -240px;
    z-index: 999;
    transition: left 0.3s ease;
  }

  .app-sidebar.sidebar-open {
    left: 0;
  }

  .sidebar-collapsed {
    left: -64px;
  }
}
</style>
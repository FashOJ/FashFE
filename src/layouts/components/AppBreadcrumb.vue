<template>
  <nav class="breadcrumb" aria-label="面包屑导航">
    <ol class="breadcrumb-list">
      <li 
        v-for="(item, index) in breadcrumbItems" 
        :key="index" 
        class="breadcrumb-item"
        :class="{ 'is-active': index === breadcrumbItems.length - 1 }"
      >
        <RouterLink 
          v-if="item.path && index !== breadcrumbItems.length - 1" 
          :to="item.path" 
          class="breadcrumb-link"
        >
          {{ item.title }}
        </RouterLink>
        <span v-else class="breadcrumb-text">
          {{ item.title }}
        </span>
        <span 
          v-if="index < breadcrumbItems.length - 1" 
          class="breadcrumb-separator"
          aria-hidden="true"
        >
          /
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  title: string
  path?: string
}

const route = useRoute()

// 路由面包屑映射
const routeBreadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/': [{ title: '首页', path: '/' }],
  '/problems': [
    { title: '首页', path: '/' },
    { title: '题库' }
  ],
  '/contests': [
    { title: '首页', path: '/' },
    { title: '比赛' }
  ],
  '/submissions': [
    { title: '首页', path: '/' },
    { title: '提交记录' }
  ],
  '/ranking': [
    { title: '首页', path: '/' },
    { title: '排行榜' }
  ],
  '/discuss': [
    { title: '首页', path: '/' },
    { title: '讨论区' }
  ],
  '/profile': [
    { title: '首页', path: '/' },
    { title: '个人中心' }
  ],
  '/settings': [
    { title: '首页', path: '/' },
    { title: '个人中心', path: '/profile' },
    { title: '设置' }
  ],
  '/login': [
    { title: '首页', path: '/' },
    { title: '登录' }
  ],
  '/register': [
    { title: '首页', path: '/' },
    { title: '注册' }
  ],
  '/favorites': [
    { title: '首页', path: '/' },
    { title: '收藏夹' }
  ],
  '/notes': [
    { title: '首页', path: '/' },
    { title: '笔记' }
  ],
  '/achievements': [
    { title: '首页', path: '/' },
    { title: '成就' }
  ]
}

// 计算面包屑项目
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const currentPath = route.path
  
  // 检查是否有预定义的面包屑
  if (routeBreadcrumbMap[currentPath]) {
    return routeBreadcrumbMap[currentPath]
  }
  
  // 动态生成面包屑（用于动态路由）
  const pathSegments = currentPath.split('/').filter(segment => segment)
  const breadcrumbs: BreadcrumbItem[] = [{ title: '首页', path: '/' }]
  
  let currentFullPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentFullPath += `/${segment}`
    
    // 根据路径段生成标题
    let title = segment
    switch (segment) {
      case 'problems':
        title = '题库'
        break
      case 'contests':
        title = '比赛'
        break
      case 'submissions':
        title = '提交记录'
        break
      case 'ranking':
        title = '排行榜'
        break
      case 'discuss':
        title = '讨论区'
        break
      case 'profile':
        title = '个人中心'
        break
      case 'settings':
        title = '设置'
        break
      case 'favorites':
        title = '收藏夹'
        break
      case 'notes':
        title = '笔记'
        break
      case 'achievements':
        title = '成就'
        break
      default:
        // 如果是数字，可能是ID，保持原样或进行特殊处理
        if (/^\d+$/.test(segment)) {
          title = `#${segment}`
        } else {
          // 首字母大写
          title = segment.charAt(0).toUpperCase() + segment.slice(1)
        }
    }
    
    breadcrumbs.push({
      title,
      path: index === pathSegments.length - 1 ? undefined : currentFullPath
    })
  })
  
  return breadcrumbs
})
</script>

<style scoped>
.breadcrumb {
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  padding: 12px 20px;
  font-size: 14px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  color: #666;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.breadcrumb-link:hover {
  color: #1890ff;
  background-color: #f0f8ff;
}

.breadcrumb-text {
  color: #333;
  font-weight: 600;
  padding: 4px 8px;
}

.breadcrumb-item.is-active .breadcrumb-text {
  color: #1890ff;
}

.breadcrumb-separator {
  color: #ccc;
  font-weight: normal;
  user-select: none;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .breadcrumb {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .breadcrumb-list {
    gap: 2px;
  }
  
  .breadcrumb-item {
    gap: 6px;
  }
  
  .breadcrumb-link,
  .breadcrumb-text {
    padding: 2px 6px;
  }
}

/* 小屏设备 */
@media (max-width: 480px) {
  .breadcrumb {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .breadcrumb-list {
    gap: 1px;
  }
  
  .breadcrumb-item {
    gap: 4px;
  }
  
  .breadcrumb-link,
  .breadcrumb-text {
    padding: 1px 4px;
  }
  
  /* 在小屏设备上隐藏中间的面包屑项，只显示首页和当前页 */
  .breadcrumb-item:not(:first-child):not(:last-child) {
    display: none;
  }
  
  .breadcrumb-item:nth-last-child(2) .breadcrumb-separator {
    display: none;
  }
  
  .breadcrumb-item:first-child:not(:last-child)::after {
    content: '...';
    color: #ccc;
    margin: 0 4px;
  }
}
</style>

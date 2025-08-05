<template>
  <div class="app-breadcrumb" v-if="breadcrumbs.length > 0">
    <nav class="breadcrumb-nav">
      <ol class="breadcrumb-list">
        <li
          v-for="(item, index) in breadcrumbs"
          :key="index"
          class="breadcrumb-item"
          :class="{ 'is-active': index === breadcrumbs.length - 1 }"
        >
          <RouterLink
            v-if="item.path && index !== breadcrumbs.length - 1"
            :to="item.path"
            class="breadcrumb-link"
          >
            <i v-if="item.icon" :class="item.icon" class="breadcrumb-icon"></i>
            {{ item.title }}
          </RouterLink>
          <span v-else class="breadcrumb-text">
            <i v-if="item.icon" :class="item.icon" class="breadcrumb-icon"></i>
            {{ item.title }}
          </span>
          <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  title: string
  path?: string
  icon?: string
}

const route = useRoute()

// 路由到面包屑的映射配置
const routeBreadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/': [
    { title: '首页', path: '/' }
  ],
  '/problems': [
    { title: '首页', path: '/' },
    { title: '题库', path: '/problems' }
  ],
  '/problems/create': [
    { title: '首页', path: '/' },
    { title: '题库', path: '/problems' },
    { title: '创建题目' }
  ],
  '/contests': [
    { title: '首页', path: '/' },
    { title: '比赛', path: '/contests' }
  ],
  '/contests/create': [
    { title: '首页', path: '/' },
    { title: '比赛', path: '/contests' },
    { title: '创建比赛' }
  ],
  '/submissions': [
    { title: '首页', path: '/' },
    { title: '提交记录', path: '/submissions' }
  ],
  '/ranking': [
    { title: '首页', path: '/' },
    { title: '排行榜', path: '/ranking' }
  ],
  '/discuss': [
    { title: '首页', path: '/' },
    { title: '讨论区', path: '/discuss' }
  ],
  '/profile': [
    { title: '首页', path: '/' },
    { title: '个人中心', path: '/profile' }
  ],
  '/settings': [
    { title: '首页', path: '/' },
    { title: '个人中心', path: '/profile' },
    { title: '设置' }
  ],
  '/admin': [
    { title: '首页', path: '/' },
    { title: '管理后台', path: '/admin' }
  ],
  '/about': [
    { title: '首页', path: '/' },
    { title: '关于我们' }
  ]
}

// 动态生成面包屑
const breadcrumbs = computed(() => {
  const currentPath = route.path

  // 首先检查精确匹配
  if (routeBreadcrumbMap[currentPath]) {
    return routeBreadcrumbMap[currentPath]
  }

  // 处理动态路由，如 /problems/123
  const pathSegments = currentPath.split('/').filter(Boolean)
  const breadcrumbItems: BreadcrumbItem[] = [
    { title: '首页', path: '/' }
  ]

  let currentSegmentPath = ''

  for (let i = 0; i < pathSegments.length; i++) {
    currentSegmentPath += '/' + pathSegments[i]

    // 检查是否有预定义的面包屑
    if (routeBreadcrumbMap[currentSegmentPath]) {
      const predefinedBreadcrumbs = routeBreadcrumbMap[currentSegmentPath]
      // 跳过首页，因为已经添加了
      breadcrumbItems.push(...predefinedBreadcrumbs.slice(1))
      break
    } else {
      // 动态生成面包屑项
      const segment = pathSegments[i]
      let title = segment
      //let icon = ''

      // 根据路径段生成标题
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
        case 'admin':
          title = '管理后台'
          break
        default:
          // 如果是数字，可能是ID
          if (/^\d+$/.test(segment)) {
            title = `#${segment}`
          } else {
            title = segment.charAt(0).toUpperCase() + segment.slice(1)
          }
      }

      breadcrumbItems.push({
        title,
        path: i === pathSegments.length - 1 ? undefined : currentSegmentPath
      })
    }
  }

  return breadcrumbItems
})
</script>

<style scoped>
.app-breadcrumb {
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.breadcrumb-nav {
  font-size: 14px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: #1890ff;
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  background-color: #f0f8ff;
  color: #40a9ff;
}

.breadcrumb-text {
  color: #666;
  display: flex;
  align-items: center;
  padding: 4px 8px;
}

.breadcrumb-item.is-active .breadcrumb-text {
  color: #333;
  font-weight: 500;
}

.breadcrumb-icon {
  margin-right: 4px;
  font-size: 14px;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #ccc;
  user-select: none;
}

@media (max-width: 768px) {
  .app-breadcrumb {
    margin-bottom: 12px;
    padding: 8px 0;
  }

  .breadcrumb-nav {
    font-size: 13px;
  }

  .breadcrumb-link,
  .breadcrumb-text {
    padding: 2px 4px;
  }

  .breadcrumb-separator {
    margin: 0 4px;
  }
}
</style>

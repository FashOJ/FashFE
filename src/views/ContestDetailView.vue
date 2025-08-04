<template>
  <div class="contest-detail-view">
    <h1>比赛详情页</h1>
    <p>比赛ID: {{ $route.params.id }}</p>
    <p>此页面正在开发中...</p>
    <RouterLink to="/contests" class="back-link">返回比赛列表</RouterLink>
  </div>
</template>

<script setup lang="ts">
// 比赛详情页组件
</script>

<style scoped>
.contest-detail-view {
  padding: 20px;
}

.back-link {
  color: #1890ff;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
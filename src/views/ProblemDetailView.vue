<template>
  <div class="problem-detail-view">
    <h1>题目详情页</h1>
    <p>题目ID: {{ $route.params.id }}</p>
    <p>此页面正在开发中...</p>
    <RouterLink to="/problems" class="back-link">返回题库</RouterLink>
  </div>
</template>

<script setup lang="ts">
// 题目详情页组件
</script>

<style scoped>
.problem-detail-view {
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
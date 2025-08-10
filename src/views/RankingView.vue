<template>
  <div class="ranking-view">
    <div class="page-header">
      <h1 class="page-title">排行榜</h1>
      <p class="page-description">查看用户排名和积分</p>
    </div>
    <div class="ranking-content">
      <div class="coming-soon">
        <div class="icon">🏆</div>
        <h3>排行榜功能即将上线</h3>
        <p>我们正在开发用户排名系统，敬请期待！</p>
        <div class="features">
          <div class="feature-item">
            <span class="feature-text">实时排名</span>
          </div>
          <div class="feature-item">
            <span class="feature-text">积分系统</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 排行榜页组件
</script>

<style scoped>
.ranking-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  font-size: 16px;
  margin: 0;
}

.ranking-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.coming-soon {
  padding: 60px 40px;
  text-align: center;
}

.icon {
  font-size: 64px;
  margin-bottom: 24px;
  display: block;
}

.coming-soon h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.coming-soon p {
  color: #666;
  font-size: 16px;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.feature-text {
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  text-align: center;
}

/* Enhanced Responsive Design */
/* Large Desktop */
@media (min-width: 1400px) {
  .ranking-view {
    max-width: 1400px;
    padding: 0 40px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-description {
    font-size: 18px;
  }
  
  .coming-soon {
    padding: 80px 60px;
  }
  
  .icon {
    font-size: 80px;
  }
  
  .coming-soon h3 {
    font-size: 28px;
  }
  
  .coming-soon p {
    font-size: 18px;
  }
  
  .features {
    gap: 32px;
  }
  
  .feature-item {
    padding: 24px;
  }
}

/* Desktop */
@media (max-width: 1200px) {
  .ranking-view {
    padding: 0 24px;
  }
  
  .coming-soon {
    padding: 50px 32px;
  }
  
  .features {
    gap: 20px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .ranking-view {
    padding: 0 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-description {
    font-size: 14px;
  }
  
  .coming-soon {
    padding: 40px 24px;
  }
  
  .icon {
    font-size: 56px;
  }
  
  .coming-soon h3 {
    font-size: 22px;
  }
  
  .coming-soon p {
    font-size: 15px;
  }
  
  .features {
    gap: 16px;
  }
  
  .feature-item {
    padding: 16px;
  }
}

/* Mobile Large */
@media (max-width: 768px) {
  .ranking-view {
    padding: 0 16px;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .coming-soon {
    padding: 32px 20px;
  }
  
  .icon {
    font-size: 48px;
    margin-bottom: 20px;
  }
  
  .coming-soon h3 {
    font-size: 20px;
  }
  
  .coming-soon p {
    font-size: 14px;
    margin-bottom: 32px;
  }
  
  .features {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 400px;
  }
  
  .feature-item {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    padding: 12px 16px;
  }
  
  .feature-text {
    font-size: 13px;
  }
}

/* Mobile Small */
@media (max-width: 480px) {
  .ranking-view {
    padding: 0 12px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-description {
    font-size: 13px;
  }
  
  .coming-soon {
    padding: 24px 16px;
  }
  
  .icon {
    font-size: 40px;
    margin-bottom: 16px;
  }
  
  .coming-soon h3 {
    font-size: 18px;
  }
  
  .coming-soon p {
    font-size: 13px;
    margin-bottom: 24px;
  }
  
  .features {
    gap: 8px;
  }
  
  .feature-item {
    padding: 10px 12px;
  }
  
  .feature-text {
    font-size: 12px;
  }
}

/* Extra Small Mobile */
@media (max-width: 360px) {
  .ranking-view {
    padding: 0 8px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .coming-soon {
    padding: 20px 12px;
  }
  
  .icon {
    font-size: 36px;
  }
  
  .coming-soon h3 {
    font-size: 16px;
  }
  
  .coming-soon p {
    font-size: 12px;
  }
}
</style>
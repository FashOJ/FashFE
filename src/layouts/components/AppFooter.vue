<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- Footer Content -->
      <div class="footer-content">
        <!-- Brand Section -->
        <div class="footer-section">
          <div class="footer-brand">
            <img src="@/assets/logo.svg" alt="FashOJ" class="footer-logo" />
            <span class="footer-brand-text">FashOJ</span>
          </div>
          <p class="footer-description">
            专业的在线编程评测平台，提供丰富的算法题库和编程竞赛。
          </p>
          <div class="social-links">
            <a href="#" class="social-link" title="GitHub">
              <i class="icon">🐙</i>
            </a>
            <a href="#" class="social-link" title="QQ群">
              <i class="icon">💬</i>
            </a>
            <a href="#" class="social-link" title="微信">
              <i class="icon">💚</i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4 class="footer-title">快速链接</h4>
          <ul class="footer-links">
            <li><RouterLink to="/problems">题库</RouterLink></li>
            <li><RouterLink to="/contests">比赛</RouterLink></li>
            <li><RouterLink to="/ranking">排行榜</RouterLink></li>
            <li><RouterLink to="/discuss">讨论区</RouterLink></li>
          </ul>
        </div>

        <!-- Help & Support -->
        <div class="footer-section">
          <h4 class="footer-title">帮助与支持</h4>
          <ul class="footer-links">
            <li><RouterLink to="/help">使用帮助</RouterLink></li>
            <li><RouterLink to="/faq">常见问题</RouterLink></li>
            <li><RouterLink to="/api-docs">API文档</RouterLink></li>
            <li><RouterLink to="/contact">联系我们</RouterLink></li>
          </ul>
        </div>

        <!-- About -->
        <div class="footer-section">
          <h4 class="footer-title">关于我们</h4>
          <ul class="footer-links">
            <li><RouterLink to="/about">关于FashOJ</RouterLink></li>
            <li><RouterLink to="/privacy">隐私政策</RouterLink></li>
            <li><RouterLink to="/terms">服务条款</RouterLink></li>
            <li><RouterLink to="/changelog">更新日志</RouterLink></li>
          </ul>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <div class="copyright">
            <p>&copy; {{ currentYear }} FashOJ. All rights reserved.</p>
            <p>Powered by Vue 3 + TypeScript + Vite</p>
          </div>
          <div class="footer-stats">
            <span class="stat-item">在线用户: {{ onlineUsers }}</span>
            <span class="stat-item">题目总数: {{ totalProblems }}</span>
            <span class="stat-item">提交总数: {{ totalSubmissions }}</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 当前年份
const currentYear = computed(() => new Date().getFullYear())

// 统计数据 (这里先用模拟数据，后续会接入真实的API)
const onlineUsers = ref(1234)
const totalProblems = ref(5678)
const totalSubmissions = ref(123456)
</script>

<style scoped>
.app-footer {
  background: #001529;
  color: #fff;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 40px 0;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.footer-logo {
  width: 32px;
  height: 32px;
  margin-right: 8px;
  filter: brightness(0) invert(1);
}

.footer-brand-text {
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
}

.footer-description {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #1890ff;
  transform: translateY(-2px);
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #fff;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #1890ff;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding: 20px 0;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: #999;
}

.copyright p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.footer-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  color: #ccc;
  font-size: 14px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px 0;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer-stats {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding: 0 16px;
  }

  .social-links {
    justify-content: center;
  }
}</style>
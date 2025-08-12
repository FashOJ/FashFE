<script setup lang="ts">
</script>

<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">欢迎来到Fash Online Judge</h1>
        <p class="hero-subtitle">专业的在线编程评测平台，提升你的算法能力</p>
      </div>
      <div class="hero-image">
        <div class="code-animation">
          <div class="code-line">#include &lt;iostream&gt;</div>
          <div class="code-line">using namespace std;</div>
          <div class="code-line">int main() { </div>
          <div class="code-line">  return 0; </div>
          <div class="code-line">}</div>
        </div>
      </div>
    </section>




  </div>
</template>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 60px 0;
  margin-bottom: 80px;
}

.hero-content {
  text-align: left;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  color: #666;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-animation {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 40px;
  border-radius: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 16px;
  line-height: 1.8;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
}

.code-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(90deg, #ff5f56, #ffbd2e, #27ca3f);
  border-radius: 12px 12px 0 0;
}

.code-line {
  margin-top: 30px;
  animation: typewriter 3s steps(20) infinite;
}

@keyframes typewriter {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.7; }
}



/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .code-animation {
    max-width: 320px;
    padding: 24px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 14px;
  }

  .code-animation {
    max-width: 280px;
    padding: 20px;
    font-size: 11px;
  }
}
</style>

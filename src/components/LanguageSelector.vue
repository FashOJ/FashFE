<template>
  <div class="language-selector">
    <div class="selector-header" @click="toggleDropdown">
      <div class="selected-language">
        <span class="language-icon">{{ getLanguageIcon(modelValue) }}</span>
        <span class="language-label">{{ getLanguageLabel(modelValue) }}</span>
      </div>
      <div class="dropdown-arrow" :class="{ open: isOpen }">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    
    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <div class="language-categories">
          <div class="category">
            <div class="category-title">热门语言</div>
            <div 
              v-for="lang in popularLanguages" 
              :key="lang.value"
              class="language-option"
              :class="{ active: modelValue === lang.value }"
              @click="selectLanguage(lang.value)"
            >
              <span class="language-icon">{{ lang.icon }}</span>
              <span class="language-label">{{ lang.label }}</span>
              <span v-if="modelValue === lang.value" class="check-icon">✓</span>
            </div>
          </div>
          
          <div class="category" v-if="otherLanguages.length > 0">
            <div class="category-title">其他语言</div>
            <div 
              v-for="lang in otherLanguages" 
              :key="lang.value"
              class="language-option"
              :class="{ active: modelValue === lang.value }"
              @click="selectLanguage(lang.value)"
            >
              <span class="language-icon">{{ lang.icon }}</span>
              <span class="language-label">{{ lang.label }}</span>
              <span v-if="modelValue === lang.value" class="check-icon">✓</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { 
  supportedLanguages, 
  getPopularLanguages,
  getLanguageInfo
} from '@/utils/codeTemplates'

interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)

// 计算属性
const popularLanguages = computed(() => getPopularLanguages())
const otherLanguages = computed(() => 
  supportedLanguages.filter(lang => 
    !popularLanguages.value.some(popular => popular.value === lang.value)
  )
)

// 获取语言信息的辅助函数
const getLanguageLabel = (value: string): string => {
  const lang = getLanguageInfo(value)
  return lang ? lang.label : value
}

const getLanguageIcon = (value: string): string => {
  const lang = getLanguageInfo(value)
  return lang ? lang.icon : '📄'
}

// 方法
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (value: string) => {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-selector')) {
    isOpen.value = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.language-selector {
  position: relative;
  min-width: 180px;
}

.selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.selector-header:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.selected-language {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.language-icon {
  font-size: 1.1rem;
}

.language-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
}

.language-categories {
  padding: 0.5rem;
}

.category {
  margin-bottom: 1rem;
}

.category:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: rgba(255, 255, 255, 0.9);
}

.language-option:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.language-option.active {
  background: rgba(59, 130, 246, 0.3);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.5);
}

.language-option .language-icon {
  font-size: 1.1rem;
  width: 1.5rem;
  text-align: center;
}

.language-option .language-label {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

.check-icon {
  color: #22c55e;
  font-weight: bold;
  font-size: 0.875rem;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* 滚动条样式 */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-selector {
    min-width: 150px;
    width: 100%;
  }
  
  .selector-header {
    padding: 0.875rem 1rem;
    min-height: 48px; /* 增加触摸目标大小 */
    border-radius: 10px;
  }
  
  .language-label {
    font-size: 0.875rem;
  }
  
  .language-icon {
    font-size: 1.2rem;
  }
  
  .dropdown-arrow {
    font-size: 1rem;
  }
  
  .dropdown-menu {
    max-height: 60vh; /* 限制高度以适应小屏幕 */
    border-radius: 12px;
    margin-top: 0.75rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  }
  
  .category-title {
    padding: 0.75rem 1rem;
    font-size: 0.8rem;
    position: sticky;
    top: 0;
    background: rgba(30, 41, 59, 0.98);
    backdrop-filter: blur(20px);
    z-index: 1;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .language-option {
    padding: 1rem;
    min-height: 48px; /* 增加触摸目标大小 */
    border-radius: 10px;
    margin: 0.25rem 0.5rem;
  }
  
  .language-option .language-icon {
    font-size: 1.2rem;
    width: 1.75rem;
  }
  
  .language-option .language-label {
    font-size: 0.9rem;
  }
  
  /* 优化滚动体验 */
  .dropdown-menu {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
}

/* 小屏幕设备优化 */
@media (max-width: 480px) {
  .language-selector {
    min-width: unset;
    width: 100%;
  }
  
  .selector-header {
    padding: 1rem 1.125rem;
    min-height: 52px;
    border-radius: 12px;
  }
  
  .language-label {
    font-size: 0.9rem;
  }
  
  .language-icon {
    font-size: 1.3rem;
  }
  
  .dropdown-arrow {
    font-size: 1.1rem;
  }
  
  .dropdown-menu {
    max-height: 50vh;
    border-radius: 16px;
    margin-top: 1rem;
  }
  
  .category-title {
    padding: 1rem 1.25rem;
    font-size: 0.85rem;
  }
  
  .language-option {
    padding: 1.125rem 1.25rem;
    min-height: 52px;
    border-radius: 12px;
    margin: 0.25rem 0.75rem;
  }
  
  .language-option .language-icon {
    font-size: 1.3rem;
    width: 2rem;
  }
  
  .language-option .language-label {
    font-size: 0.95rem;
  }
  
  .check-icon {
    font-size: 1rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .selector-header:hover {
    background: rgba(255, 255, 255, 0.1); /* 禁用悬停效果 */
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .language-option:hover {
    background: transparent; /* 禁用悬停效果 */
    color: rgba(255, 255, 255, 0.9);
  }
  
  /* 增强触摸反馈 */
  .selector-header:active {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0.98);
    transition: all 0.1s ease;
  }
  
  .language-option:active {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.98);
    transition: all 0.1s ease;
  }
}

/* 平板设备优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .language-selector {
    min-width: 160px;
  }
  
  .selector-header {
    padding: 0.8rem 0.95rem;
    min-height: 44px;
  }
  
  .language-option {
    padding: 0.8rem 0.9rem;
    min-height: 44px;
  }
  
  .dropdown-menu {
    max-height: 350px;
  }
}

/* 横屏模式优化 */
@media (max-height: 500px) and (orientation: landscape) {
  .dropdown-menu {
    max-height: 40vh;
  }
  
  .category-title {
    padding: 0.5rem 0.75rem;
  }
  
  .language-option {
    padding: 0.6rem 0.75rem;
    min-height: 40px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .selector-header {
    border-width: 2px;
    background: rgba(255, 255, 255, 0.2);
  }
  
  .language-option.active {
    background: rgba(59, 130, 246, 0.5);
    border: 2px solid rgba(59, 130, 246, 0.8);
  }
  
  .dropdown-menu {
    border-width: 2px;
    background: rgba(30, 41, 59, 0.98);
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: opacity 0.1s ease;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: none;
  }
  
  .dropdown-arrow {
    transition: none;
  }
  
  .selector-header:active,
  .language-option:active {
    transform: none;
  }
  
  .selector-header,
  .language-option {
    transition: background-color 0.1s ease;
  }
}

/* 深色模式优化 */
@media (prefers-color-scheme: dark) {
  .dropdown-menu {
    background: rgba(15, 23, 42, 0.95);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .category-title {
    background: rgba(15, 23, 42, 0.98);
  }
}

/* 滚动条在移动设备上的优化 */
@media (max-width: 768px) {
  .dropdown-menu::-webkit-scrollbar {
    width: 4px;
  }
  
  .dropdown-menu::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .dropdown-menu::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

/* 确保在所有设备上都有足够的对比度 */
@media (max-width: 768px) {
  .language-option {
    color: rgba(255, 255, 255, 0.95);
  }
  
  .category-title {
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
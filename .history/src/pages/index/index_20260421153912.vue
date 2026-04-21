<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import { useHoroscope } from '@/composables/useHoroscope'

const { zodiacList, selectedZodiac, setSelectedZodiac, getZodiacInfo } = useZodiac()
const { getHoroscopeWithDescription } = useHoroscope()

const showPicker = ref(false)
const isLoading = ref(false)

// 加载保存的星座设置
const loadSavedZodiac = () => {
  const savedZodiac = localStorage.getItem('selectedZodiac')
  if (savedZodiac) {
    setSelectedZodiac(savedZodiac as typeof selectedZodiac.value)
  }
}

const currentInfo = computed(() => getZodiacInfo(selectedZodiac.value))
const horoscopeDetail = computed(() => getHoroscopeWithDescription(selectedZodiac.value))

const selectZodiac = (sign: typeof selectedZodiac.value) => {
  isLoading.value = true
  setTimeout(() => {
    setSelectedZodiac(sign)
    // 保存星座选择到本地存储
    localStorage.setItem('selectedZodiac', sign)
    showPicker.value = false
    isLoading.value = false
  }, 300)
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'var(--success)'
  if (score >= 60) return 'var(--warning)'
  return 'var(--danger)'
}

const getScoreGradient = (score: number) => {
  if (score >= 80) return 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
  if (score >= 60) return 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
  return 'linear-gradient(135deg, #f44336 0%, #da190b 100%)'
}

const today = new Date()

onMounted(() => {
  // 加载保存的星座设置
  loadSavedZodiac()

  // 动画效果
  const cards = document.querySelectorAll('.score-item')
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in')
    }, index * 100)
  })
})
</script>

<template>
  <div class="horoscope-page">
    <!-- 顶部渐变背景 -->
    <div class="hero-section">
      <div class="container">
        <div class="date-display">
          <h1 class="date-title">{{ today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</h1>
          <p class="date-weekday">{{ today.toLocaleDateString('zh-CN', { weekday: 'long' }) }}</p>
        </div>

        <!-- 星座选择卡片 -->
        <div class="zodiac-card" @click="showPicker = true">
          <div class="zodiac-content">
            <span class="zodiac-symbol">{{ currentInfo?.symbol }}</span>
            <div class="zodiac-info">
              <h2 class="zodiac-name">{{ selectedZodiac }}</h2>
              <p class="zodiac-date">{{ currentInfo?.dateRange }}</p>
              <div class="zodiac-tags">
                <span class="tag element-tag" :style="{ backgroundColor: currentInfo?.element === '火' ? '#e74c3c' : currentInfo?.element === '土' ? '#8b4513' : currentInfo?.element === '风' ? '#3498db' : '#1abc9c' }">
                  {{ currentInfo?.element }}象
                </span>
                <span class="tag planet-tag">{{ currentInfo?.planet }}</span>
              </div>
            </div>
          </div>
          <span class="select-icon">↗</span>
        </div>
      </div>
    </div>

    <!-- 运势卡片 -->
    <div class="container">
      <div class="horoscope-card">
        <div class="card-header">
          <h3 class="card-title">今日运势</h3>
          <span class="card-subtitle">综合运势: {{ horoscopeDetail.overall }}%</span>
        </div>

        <!-- 运势评分网格 -->
        <div class="scores-grid">
          <div class="score-item">
            <div class="score-circle" :style="{ background: getScoreGradient(horoscopeDetail.overall) }">
              <span class="score-value">{{ horoscopeDetail.overall }}</span>
            </div>
            <span class="score-label">综合</span>
            <span class="score-desc">{{ horoscopeDetail.overallDesc }}</span>
          </div>
          <div class="score-item">
            <div class="score-circle" :style="{ background: getScoreGradient(horoscopeDetail.love) }">
              <span class="score-value">{{ horoscopeDetail.love }}</span>
            </div>
            <span class="score-label">爱情</span>
            <span class="score-desc">{{ horoscopeDetail.loveDesc }}</span>
          </div>
          <div class="score-item">
            <div class="score-circle" :style="{ background: getScoreGradient(horoscopeDetail.career) }">
              <span class="score-value">{{ horoscopeDetail.career }}</span>
            </div>
            <span class="score-label">事业</span>
            <span class="score-desc">{{ horoscopeDetail.careerDesc }}</span>
          </div>
          <div class="score-item">
            <div class="score-circle" :style="{ background: getScoreGradient(horoscopeDetail.fortune) }">
              <span class="score-value">{{ horoscopeDetail.fortune }}</span>
            </div>
            <span class="score-label">财运</span>
            <span class="score-desc">{{ horoscopeDetail.fortuneDesc }}</span>
          </div>
          <div class="score-item">
            <div class="score-circle" :style="{ background: getScoreGradient(horoscopeDetail.health) }">
              <span class="score-value">{{ horoscopeDetail.health }}</span>
            </div>
            <span class="score-label">健康</span>
            <span class="score-desc">{{ horoscopeDetail.healthDesc }}</span>
          </div>
          <div class="score-item">
            <div class="score-circle" :style="{ background: getScoreGradient(horoscopeDetail.relationship) }">
              <span class="score-value">{{ horoscopeDetail.relationship }}</span>
            </div>
            <span class="score-label">人际</span>
            <span class="score-desc">{{ horoscopeDetail.relationshipDesc }}</span>
          </div>
          <div class="score-item">
            <div class="score-circle" :style="{ background: getScoreGradient(horoscopeDetail.study) }">
              <span class="score-value">{{ horoscopeDetail.study }}</span>
            </div>
            <span class="score-label">学习</span>
            <span class="score-desc">{{ horoscopeDetail.studyDesc }}</span>
          </div>
        </div>

        <!-- 今日提示 -->
        <div class="tip-section">
          <h4 class="tip-title">今日提示</h4>
          <p class="tip-text">{{ horoscopeDetail.tip }}</p>
        </div>
      </div>

      <!-- 星座特性卡片 -->
      <div class="characteristics-card">
        <h3 class="card-title">星座特性</h3>
        <div class="characteristics-grid">
          <div class="characteristic-item">
            <span class="characteristic-label">元素</span>
            <span class="characteristic-value">{{ currentInfo?.element }}</span>
          </div>
          <div class="characteristic-item">
            <span class="characteristic-label">守护星</span>
            <span class="characteristic-value">{{ currentInfo?.planet }}</span>
          </div>
          <div class="characteristic-item">
            <span class="characteristic-label">模式</span>
            <span class="characteristic-value">{{ currentInfo?.qualities }}</span>
          </div>
          <div class="characteristic-item">
            <span class="characteristic-label">符号</span>
            <span class="characteristic-value">{{ currentInfo?.symbol }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 星座选择弹窗 -->
    <div v-if="showPicker" class="popup-overlay" @click="showPicker = false">
      <div class="zodiac-picker" @click.stop>
        <div class="picker-header">
          <h3 class="picker-title">选择星座</h3>
          <span class="picker-close" @click="showPicker = false">✕</span>
        </div>
        <div class="zodiac-grid">
          <div
            v-for="zodiac in zodiacList"
            :key="zodiac.name"
            class="zodiac-grid-item"
            :class="{ active: zodiac.name === selectedZodiac }"
            @click="selectZodiac(zodiac.name)"
          >
            <span class="grid-symbol">{{ zodiac.symbol }}</span>
            <span class="grid-name">{{ zodiac.name }}</span>
            <span class="grid-date">{{ zodiac.dateRange }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载动画 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.horoscope-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.hero-section {
  background: var(--bg-gradient);
  padding: var(--space-2xl) var(--space-md);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-bottom: var(--space-lg);
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
  color: var(--text-white);
}

.date-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-sm);
}

.date-weekday {
  font-size: var(--text-lg);
  opacity: 0.9;
}

.zodiac-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid var(--border-light);
}

.zodiac-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--primary);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
}

.zodiac-content {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.zodiac-symbol {
  font-size: 48px;
  line-height: 1;
}

.zodiac-info {
  flex: 1;
}

.zodiac-name {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.zodiac-date {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
}

.zodiac-tags {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.element-tag {
  color: var(--text-white);
}

.planet-tag {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.select-icon {
  font-size: 24px;
  color: var(--text-muted);
  transition: transform var(--transition-normal);
}

.zodiac-card:hover .select-icon {
  transform: rotate(45deg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.horoscope-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.card-subtitle {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.score-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-sm);
  box-shadow: var(--shadow-md);
}

.score-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-white);
}

.score-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.score-desc {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.tip-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border-left: 4px solid var(--primary);
}

.tip-title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--primary);
  margin-bottom: var(--space-sm);
}

.tip-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.characteristics-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.characteristics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.characteristic-item {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  text-align: center;
}

.characteristic-label {
  display: block;
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.characteristic-value {
  display: block;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.zodiac-picker {
  background: var(--bg-primary);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--space-xl);
  padding-bottom: calc(var(--space-xl) + env(safe-area-inset-bottom));
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-light);
}

.picker-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.picker-close {
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.picker-close:hover {
  color: var(--text-primary);
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
}

.zodiac-grid-item {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid transparent;
}

.zodiac-grid-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--bg-primary);
}

.zodiac-grid-item.active {
  border-color: var(--primary);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.grid-symbol {
  font-size: 32px;
  display: block;
  margin-bottom: var(--space-xs);
}

.grid-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.grid-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-light);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--space-xl) var(--space-md);
  }

  .zodiac-card {
    padding: var(--space-md);
  }

  .zodiac-symbol {
    font-size: 36px;
  }

  .zodiac-name {
    font-size: var(--text-xl);
  }

  .horoscope-card {
    padding: var(--space-lg);
  }

  .scores-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .score-circle {
    width: 70px;
    height: 70px;
  }

  .score-value {
    font-size: var(--text-xl);
  }

  .zodiac-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .zodiac-content {
    gap: var(--space-md);
  }

  .zodiac-symbol {
    font-size: 28px;
  }

  .zodiac-name {
    font-size: var(--text-lg);
  }

  .scores-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .zodiac-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .grid-name {
    font-size: var(--text-xs);
  }

  .grid-date {
    font-size: 10px;
  }
}
</style>

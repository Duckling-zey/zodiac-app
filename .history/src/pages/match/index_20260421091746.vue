<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import type { ZodiacSign } from '@/types/zodiac'

const { zodiacList, selectedZodiac, secondZodiac, setSelectedZodiac, setSecondZodiac, getZodiacInfo, getMatchResult } = useZodiac()

const activePicker = ref<'first' | 'second' | null>(null)
const isLoading = ref(false)
const selectedMatchType = ref<'love' | 'friendship' | 'work' | 'family'>('love')

const firstInfo = computed(() => getZodiacInfo(selectedZodiac.value))
const secondInfo = computed(() => getZodiacInfo(secondZodiac.value))
const matchResult = computed(() => getMatchResult(selectedZodiac.value, secondZodiac.value, selectedMatchType.value))

const selectZodiac = (sign: ZodiacSign, type: 'first' | 'second') => {
  isLoading.value = true
  setTimeout(() => {
    if (type === 'first') {
      setSelectedZodiac(sign)
    } else {
      setSecondZodiac(sign)
    }
    activePicker.value = null
    isLoading.value = false
  }, 300)
}

const openPicker = (type: 'first' | 'second') => {
  activePicker.value = type
}

const getMatchLevel = (score: number) => {
  if (score >= 85) return { text: '非常契合', color: 'var(--success)', gradient: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' }
  if (score >= 70) return { text: '比较契合', color: 'var(--warning)', gradient: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)' }
  return { text: '一般契合', color: 'var(--text-muted)', gradient: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)' }
}

const matchLevel = computed(() => getMatchLevel(matchResult.value.score))

const getElementColor = (element: string) => {
  switch (element) {
    case '火': return '#e74c3c'
    case '土': return '#8b4513'
    case '风': return '#3498db'
    case '水': return '#1abc9c'
    default: return '#999'
  }
}

const matchTypeLabels = {
  love: '爱情匹配',
  friendship: '友情匹配',
  work: '职场匹配',
  family: '家庭匹配'
}

onMounted(() => {
  // 动画效果
  const elements = document.querySelectorAll('.animate-on-mount')
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('animate-in')
    }, index * 150)
  })
})
</script>

<template>
  <div class="match-page">
    <!-- 顶部渐变背景 -->
    <div class="hero-section">
      <div class="container">
        <h1 class="page-title">星座匹配</h1>
        <p class="page-subtitle">探索两个星座之间的契合度</p>
      </div>
    </div>

    <!-- 匹配卡片 -->
    <div class="container">
      <div class="match-card">
        <div class="match-header animate-on-mount">
          <h2 class="match-title">匹配分析</h2>
          <div class="match-level" :style="{ background: matchLevel.gradient }">
            <span class="level-text">{{ matchLevel.text }}</span>
            <span class="level-score">{{ matchResult.score }}%</span>
          </div>
        </div>

        <!-- 匹配类型选择 -->
        <div class="match-type-selector animate-on-mount">
          <h3 class="type-selector-title">匹配类型</h3>
          <div class="type-buttons">
            <button
              v-for="(label, type) in matchTypeLabels"
              :key="type"
              class="type-button"
              :class="{ active: selectedMatchType === type }"
              @click="selectedMatchType = type as 'love' | 'friendship' | 'work' | 'family'"
            >
              {{ label }}
            </button>
          </div>
        </div>

        <!-- 星座选择区域 -->
        <div class="zodiac-selectors">
          <div class="zodiac-card animate-on-mount" @click="openPicker('first')">
            <div class="zodiac-content">
              <span class="zodiac-symbol">{{ firstInfo?.symbol }}</span>
              <div class="zodiac-info">
                <h3 class="zodiac-name">{{ selectedZodiac }}</h3>
                <p class="zodiac-date">{{ firstInfo?.dateRange }}</p>
                <span class="element-tag" :style="{ backgroundColor: getElementColor(firstInfo?.element || '火') }">
                  {{ firstInfo?.element }}象
                </span>
              </div>
            </div>
            <span class="select-icon">↗</span>
          </div>

          <!-- 匹配之心 -->
          <div class="match-heart animate-on-mount">
            <div class="heart-container" :style="{ background: matchLevel.gradient }">
              <span class="heart-symbol">❤️</span>
              <span class="heart-score">{{ matchResult.score }}%</span>
            </div>
            <div class="heart-connector"></div>
          </div>

          <div class="zodiac-card animate-on-mount" @click="openPicker('second')">
            <div class="zodiac-content">
              <span class="zodiac-symbol">{{ secondInfo?.symbol }}</span>
              <div class="zodiac-info">
                <h3 class="zodiac-name">{{ secondZodiac }}</h3>
                <p class="zodiac-date">{{ secondInfo?.dateRange }}</p>
                <span class="element-tag" :style="{ backgroundColor: getElementColor(secondInfo?.element || '水') }">
                  {{ secondInfo?.element }}象
                </span>
              </div>
            </div>
            <span class="select-icon">↗</span>
          </div>
        </div>

        <!-- 匹配分析 -->
        <div class="analysis-section animate-on-mount">
          <h3 class="analysis-title">匹配分析</h3>
          <div class="analysis-content">
            <p class="analysis-text">{{ matchResult.analysis }}</p>
          </div>
        </div>

        <!-- 相处建议 -->
        <div class="tips-section animate-on-mount">
          <h3 class="tips-title">相处建议</h3>
          <div class="tips-list">
            <div v-for="(tip, index) in matchResult.tips" :key="index" class="tip-item">
              <div class="tip-icon" :style="{ background: matchLevel.gradient }">
                <span>{{ index + 1 }}</span>
              </div>
              <p class="tip-text">{{ tip }}</p>
            </div>
          </div>
        </div>

        <!-- 元素相性 -->
        <div class="elements-section animate-on-mount">
          <h3 class="elements-title">元素相性</h3>
          <div class="elements-grid">
            <div class="element-item">
              <div class="element-circle" :style="{ background: getElementColor(firstInfo?.element || '火') }">
                <span class="element-symbol">{{ firstInfo?.element }}</span>
              </div>
              <span class="element-name">{{ firstInfo?.element }}象</span>
              <span class="element-sign">{{ selectedZodiac }}</span>
            </div>
            <div class="element-vs">
              <span class="vs-text">VS</span>
            </div>
            <div class="element-item">
              <div class="element-circle" :style="{ background: getElementColor(secondInfo?.element || '水') }">
                <span class="element-symbol">{{ secondInfo?.element }}</span>
              </div>
              <span class="element-name">{{ secondInfo?.element }}象</span>
              <span class="element-sign">{{ secondZodiac }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 星座选择弹窗 -->
    <div v-if="activePicker" class="popup-overlay" @click="activePicker = null">
      <div class="zodiac-picker" @click.stop>
        <div class="picker-header">
          <h3 class="picker-title">选择{{ activePicker === 'first' ? '第一个' : '第二个' }}星座</h3>
          <span class="picker-close" @click="activePicker = null">✕</span>
        </div>
        <div class="zodiac-grid">
          <div
            v-for="zodiac in zodiacList"
            :key="zodiac.name"
            class="zodiac-grid-item"
            :class="{ active: (activePicker === 'first' ? zodiac.name === selectedZodiac : zodiac.name === secondZodiac) }"
            @click="selectZodiac(zodiac.name, activePicker!)"
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
.match-page {
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
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-white);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.9);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.match-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-light);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.match-title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.match-level {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-lg);
  color: var(--text-white);
  box-shadow: var(--shadow-md);
}

.level-text {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.level-score {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.zodiac-selectors {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.zodiac-card {
  flex: 1;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid transparent;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.zodiac-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--bg-primary);
}

.zodiac-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.zodiac-symbol {
  font-size: 40px;
  line-height: 1;
}

.zodiac-info {
  flex: 1;
}

.zodiac-name {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.zodiac-date {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.element-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-white);
}

.select-icon {
  font-size: 20px;
  color: var(--text-muted);
  transition: transform var(--transition-normal);
}

.zodiac-card:hover .select-icon {
  transform: rotate(45deg);
  color: var(--primary);
}

.match-heart {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.6s ease;
}

.heart-container {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  color: var(--text-white);
}

.heart-symbol {
  font-size: 32px;
  margin-bottom: 2px;
}

.heart-score {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
}

.heart-connector {
  width: 2px;
  height: 40px;
  background: var(--border-light);
  margin-top: var(--space-sm);
}

.analysis-section {
  margin-bottom: var(--space-xl);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.analysis-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.analysis-content {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border-left: 4px solid var(--secondary);
}

.analysis-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.tips-section {
  margin-bottom: var(--space-xl);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.tips-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
}

.tip-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-white);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.tip-text {
  flex: 1;
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.elements-section {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.elements-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.elements-grid {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: var(--space-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.element-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.element-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-white);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-sm);
  box-shadow: var(--shadow-sm);
}

.element-name {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.element-sign {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.element-vs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vs-text {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-muted);
  padding: 0 var(--space-md);
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
  border-color: var(--secondary);
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
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
  border-top: 4px solid var(--secondary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

.match-heart.animate-in {
  transform: scale(1) !important;
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

  .page-title {
    font-size: var(--text-2xl);
  }

  .match-card {
    padding: var(--space-lg);
  }

  .zodiac-selectors {
    flex-direction: column;
    gap: var(--space-md);
  }

  .zodiac-card {
    width: 100%;
  }

  .heart-connector {
    height: 20px;
  }

  .elements-grid {
    flex-direction: column;
    gap: var(--space-md);
  }

  .element-vs {
    transform: rotate(90deg);
  }

  .zodiac-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .match-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .zodiac-symbol {
    font-size: 32px;
  }

  .zodiac-name {
    font-size: var(--text-base);
  }

  .heart-container {
    width: 60px;
    height: 60px;
  }

  .heart-symbol {
    font-size: 24px;
  }

  .element-circle {
    width: 50px;
    height: 50px;
  }
}
</style>

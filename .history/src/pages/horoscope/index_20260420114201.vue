<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import type { ZodiacSign, HoroscopeChart } from '@/types/zodiac'

const { getZodiacByDate } = useZodiac()

const birthDate = ref('')
const birthTime = ref('12:00')
const birthPlace = ref('')
const showResult = ref(false)
const isLoading = ref(false)

const sunSign = computed(() => {
  if (!birthDate.value) return '白羊座'
  const date = new Date(birthDate.value)
  return getZodiacByDate(date.getMonth() + 1, date.getDate())
})

const generateChart = (): HoroscopeChart => {
  const baseDate = birthDate.value ? new Date(birthDate.value) : new Date()
  const dayHash = baseDate.getDate() + baseDate.getMonth() * 31

  const signs: ZodiacSign[] = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

  const getSign = (offset: number) => signs[(signs.indexOf(sunSign.value as ZodiacSign) + offset + 12) % 12]
  const getDegree = (base: number) => (base * 30 + dayHash) % 360

  return {
    sun: { sign: sunSign.value as ZodiacSign, degree: getDegree(0) },
    moon: { sign: getSign(Math.floor(dayHash % 4)), degree: getDegree(1) },
    rising: { sign: getSign(Math.floor(dayHash % 6)), degree: getDegree(2) },
    mercury: { sign: getSign(Math.floor(dayHash % 3)), degree: getDegree(3) },
    venus: { sign: getSign(Math.floor(dayHash % 5)), degree: getDegree(4) },
    mars: { sign: getSign(Math.floor(dayHash % 7)), degree: getDegree(5) }
  }
}

const chart = computed(() => showResult.value ? generateChart() : null)

const planetConfig = [
  { key: 'sun', name: '太阳', icon: '☀️', color: '#FFD700' },
  { key: 'moon', name: '月亮', icon: '🌙', color: '#C0C0C0' },
  { key: 'rising', name: '上升', icon: '⬆️', color: '#9370DB' },
  { key: 'mercury', name: '水星', icon: '☿️', color: '#98D8C8' },
  { key: 'venus', name: '金星', icon: '♀️', color: '#FF69B4' },
  { key: 'mars', name: '火星', icon: '♂️', color: '#FF4500' }
]

const analyzeChart = computed(() => {
  if (!chart.value) return null

  const elements: Record<string, number> = { '火': 0, '土': 0, '风': 0, '水': 0 }
  const keys = ['sun', 'moon', 'rising', 'mercury', 'venus', 'mars'] as const

  const elementMap: Record<ZodiacSign, string> = {
    '白羊座': '火', '狮子座': '火', '射手座': '火',
    '金牛座': '土', '处女座': '土', '摩羯座': '土',
    '双子座': '风', '天秤座': '风', '水瓶座': '风',
    '巨蟹座': '水', '天蝎座': '水', '双鱼座': '水'
  }

  keys.forEach(key => {
    const sign = chart.value![key].sign
    elements[elementMap[sign]]++
  })

  const dominant = Object.entries(elements).sort((a, b) => b[1] - a[1])[0]

  return {
    elements,
    dominantElement: dominant[0],
    dominantCount: dominant[1],
    interpretation: getElementInterpretation(dominant[0])
  }
})

function getElementInterpretation(element: string): string {
  const interpretations: Record<string, string> = {
    '火': '你的星盘以火象星座为主导，展现出积极、热情、有活力的特质。你有强烈的行动力和创造力，适合开创性的事业。',
    '土': '你的星盘以土象星座为主导，表现出务实、稳健、有耐心的特质。你脚踏实地，注重实际成果，适合稳定发展的领域。',
    '风': '你的星盘以风象星座为主导，具有理性、善于交际、思维敏捷的特质。你擅长沟通和表达，适合需要人际交往的工作。',
    '水': '你的星盘以水象星座为主导，拥有敏感、直觉强、情感丰富的特质。你善于感知他人情绪，适合需要同理心的工作。'
  }
  return interpretations[element] || ''
}

const ELEMENT_COLORS: Record<string, string> = {
  '火': '#e74c3c',
  '土': '#8b4513',
  '风': '#3498db',
  '水': '#1abc9c'
}

const submitForm = () => {
  if (!birthDate.value) {
    alert('请选择出生日期')
    return
  }
  isLoading.value = true
  setTimeout(() => {
    showResult.value = true
    isLoading.value = false
  }, 800)
}
</script>

<template>
  <div class="page">
    <div class="header">
      <span class="page-title animate-fade-in">星盘分析</span>
      <span class="page-subtitle animate-slide-up">输入出生信息，生成你的个人星盘</span>
    </div>

    <div v-if="!showResult" class="form-card animate-scale">
      <div class="form-item">
        <span class="form-label">出生日期</span>
        <input
          type="date"
          v-model="birthDate"
          class="input-value"
        />
      </div>

      <div class="form-item">
        <span class="form-label">出生时间</span>
        <input
          type="time"
          v-model="birthTime"
          class="input-value"
        />
      </div>

      <div class="form-item">
        <span class="form-label">出生地点</span>
        <input
          class="input-value"
          type="text"
          v-model="birthPlace"
          placeholder="如：北京"
        />
      </div>

      <button class="submit-btn" @click="submitForm" :disabled="isLoading">
        <span v-if="!isLoading">生成星盘</span>
        <span v-else class="loading-spinner-small"></span>
      </button>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">正在生成星盘...</p>
    </div>

    <div v-else-if="showResult" class="result-section">
      <div class="basic-info animate-fade-in">
        <span class="info-text">
          {{ birthDate }} | {{ birthTime }} | {{ birthPlace || '未知地点' }}
        </span>
      </div>

      <div class="chart-card animate-slide-up">
        <span class="card-title">行星分布</span>
        <div class="planet-list">
          <div v-for="(planet, index) in planetConfig" :key="planet.key" class="planet-item animate-scale" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="planet-icon" :style="{ backgroundColor: planet.color }">
              <span>{{ planet.icon }}</span>
            </div>
            <div class="planet-info">
              <span class="planet-name">{{ planet.name }}</span>
              <span class="planet-sign">{{ chart?.[planet.key as keyof typeof chart]?.sign }}</span>
              <span class="planet-degree">{{ chart?.[planet.key as keyof typeof chart]?.degree }}°</span>
            </div>
          </div>
        </div>
      </div>

      <div class="element-card animate-slide-up" style="animation-delay: 0.2s">
        <span class="card-title">元素分布</span>
        <div class="element-bars">
          <div v-for="(count, element, index) in analyzeChart?.elements" :key="element" class="element-bar-item animate-scale" :style="{ animationDelay: `${index * 0.1}s` }">
            <span class="element-label">{{ element }}</span>
            <div class="bar-container">
              <div
                class="bar-fill"
                :style="{
                  width: `${(count / 6) * 100}%`,
                  backgroundColor: ELEMENT_COLORS[element]
                }"
              ></div>
            </div>
            <span class="element-count">{{ count }}/6</span>
          </div>
        </div>
        <div class="dominant-element" v-if="analyzeChart">
          <span class="dominant-label">主导元素：</span>
          <span class="dominant-value" :style="{ color: ELEMENT_COLORS[analyzeChart.dominantElement] }">{{ analyzeChart.dominantElement }}象 ({{ analyzeChart.dominantCount }}个行星)</span>
        </div>
      </div>

      <div class="interpretation-card animate-slide-up" style="animation-delay: 0.3s">
        <div class="interpretation-header">
          <span class="interpretation-icon">🔮</span>
          <span class="interpretation-title">命理解读</span>
        </div>
        <div class="interpretation-content">
          <span class="interpretation-text">{{ analyzeChart?.interpretation }}</span>
        </div>
      </div>

      <button class="back-btn animate-scale" @click="showResult = false">重新输入</button>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%);
  padding: 20rpx;
  padding-bottom: 100px;
}

.header {
  padding: 40rpx 20rpx;
  text-align: center;
}

.page-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 15rpx;
  display: block;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
}

.form-card:hover {
  transform: translateY(-5rpx);
  box-shadow: 0 15rpx 45rpx rgba(0, 0, 0, 0.2);
}

.form-item {
  margin-bottom: 35rpx;
  position: relative;
}

.form-label {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
  font-weight: 500;
}

.input-value {
  width: 100%;
  padding: 24rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  font-size: 30rpx;
  border: 2rpx solid #e9ecef;
  transition: all 0.3s ease;
}

.input-value:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
  background: #fff;
}

.submit-btn {
  margin-top: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50rpx;
  padding: 28rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3rpx);
  box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.result-section {
  padding-top: 20rpx;
}

.basic-info {
  text-align: center;
  margin-bottom: 24rpx;
  background: rgba(255, 255, 255, 0.1);
  padding: 20rpx;
  border-radius: 16rpx;
  backdrop-filter: blur(10rpx);
}

.info-text {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

.chart-card,
.element-card,
.interpretation-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24rpx;
  padding: 35rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 25rpx rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10rpx);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.chart-card::before,
.element-card::before,
.interpretation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6rpx;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.chart-card:hover,
.element-card:hover,
.interpretation-card:hover {
  transform: translateY(-3rpx);
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
  padding-left: 10rpx;
}

.planet-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.planet-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 16rpx;
  transition: all 0.3s ease;
}

.planet-item:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
  background: #fff;
}

.planet-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.planet-item:hover .planet-icon {
  transform: scale(1.1);
  box-shadow: 0 6rpx 18rpx rgba(0, 0, 0, 0.2);
}

.planet-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.planet-name {
  font-size: 26rpx;
  color: #999;
  font-weight: 500;
}

.planet-sign {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-top: 4rpx;
}

.planet-degree {
  font-size: 24rpx;
  color: #666;
  margin-top: 2rpx;
}

.element-bars {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding-left: 10rpx;
}

.element-bar-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  position: relative;
}

.element-label {
  width: 70rpx;
  font-size: 28rpx;
  color: #666;
  font-weight: 500;
}

.bar-container {
  flex: 1;
  height: 30rpx;
  background: #f0f0f0;
  border-radius: 15rpx;
  overflow: hidden;
  box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.bar-fill {
  height: 100%;
  border-radius: 15rpx;
  transition: width 0.8s ease;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 1s ease-in-out infinite;
}

.bar-fill:hover::after {
  left: 100%;
}

.element-count {
  width: 70rpx;
  font-size: 26rpx;
  color: #999;
  text-align: right;
  font-weight: 500;
}

.dominant-element {
  margin-top: 30rpx;
  padding: 20rpx;
  background: #f8f9fa;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-left: 10rpx;
}

.dominant-label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}

.dominant-value {
  font-size: 28rpx;
  font-weight: bold;
}

.interpretation-header {
  display: flex;
  align-items: center;
  gap: 18rpx;
  margin-bottom: 24rpx;
  padding-left: 10rpx;
}

.interpretation-icon {
  font-size: 40rpx;
  animation: bounce 2s infinite;
}

.interpretation-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.interpretation-content {
  background: linear-gradient(135deg, #f5f5f5 0%, #e9ecef 100%);
  border-radius: 16rpx;
  padding: 28rpx;
  margin-left: 10rpx;
  transition: all 0.3s ease;
}

.interpretation-content:hover {
  transform: scale(1.02);
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
}

.interpretation-text {
  font-size: 30rpx;
  color: #666;
  line-height: 1.8;
  display: block;
  font-weight: 500;
}

.back-btn {
  margin-top: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  border-radius: 50rpx;
  padding: 28rpx;
  font-size: 32rpx;
  border: 2rpx solid #e9ecef;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.back-btn:hover {
  transform: translateY(-3rpx);
  box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.1);
  border-color: #667eea;
  color: #667eea;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 150rpx 0;
}

.loading-spinner {
  width: 100rpx;
  height: 100rpx;
  border: 10rpx solid rgba(255, 255, 255, 0.2);
  border-top: 10rpx solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 40rpx;
}

.loading-spinner-small {
  display: inline-block;
  width: 30rpx;
  height: 30rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.3);
  border-top: 3rpx solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: 500;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5rpx);
  }
  60% {
    transform: translateY(-3rpx);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease;
}

.animate-slide-up {
  animation: slideUp 0.6s ease;
}

.animate-scale {
  animation: scale 0.4s ease;
}
</style>

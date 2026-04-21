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

// 动态星盘计算
const zodiacWheel = computed(() => {
  if (!chart.value) return null

  const signs = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']

  return signs.map((sign, index) => {
    const angle = (index * 30) % 360
    return {
      sign,
      angle,
      startAngle: angle,
      endAngle: (angle + 30) % 360
    }
  })
})

// 行星位置计算
const planetPositions = computed(() => {
  if (!chart.value) return []

  return planetConfig.map(planet => {
    const position = chart.value![planet.key as keyof typeof chart]
    return {
      ...planet,
      position,
      angle: position?.degree || 0
    }
  })
})

// 行星相位计算
const calculateAspects = () => {
  if (!chart.value) return []

  const planets = planetPositions.value
  const aspects = []

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i]
      const planet2 = planets[j]

      if (planet1.position && planet2.position) {
        let angleDiff = Math.abs(planet1.angle - planet2.angle)
        angleDiff = Math.min(angleDiff, 360 - angleDiff)

        let aspectType = ''
        let orb = 0

        if (Math.abs(angleDiff - 0) < 8) {
          aspectType = '合相'
          orb = Math.abs(angleDiff - 0)
        } else if (Math.abs(angleDiff - 60) < 6) {
          aspectType = '六分相'
          orb = Math.abs(angleDiff - 60)
        } else if (Math.abs(angleDiff - 90) < 6) {
          aspectType = '刑相'
          orb = Math.abs(angleDiff - 90)
        } else if (Math.abs(angleDiff - 120) < 6) {
          aspectType = '三分相'
          orb = Math.abs(angleDiff - 120)
        } else if (Math.abs(angleDiff - 180) < 8) {
          aspectType = '对相'
          orb = Math.abs(angleDiff - 180)
        }

        if (aspectType) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspectType,
            orb: orb.toFixed(1),
            angleDiff: angleDiff.toFixed(1)
          })
        }
      }
    }
  }

  return aspects
}

const aspects = computed(() => calculateAspects())

// 相位解释
const getAspectInterpretation = (aspectType: string) => {
  const interpretations: Record<string, string> = {
    '合相': '两个行星的能量融合在一起，增强彼此的特质，可能带来强烈的影响。',
    '六分相': '两个行星之间形成和谐的联系，能量可以顺畅流动，带来机遇和好运。',
    '刑相': '两个行星之间存在紧张的挑战，需要努力平衡，但也能带来成长和突破。',
    '三分相': '两个行星之间形成和谐的能量流动，带来天赋和优势，使事情更容易成功。',
    '对相': '两个行星之间形成对立的能量，需要平衡和整合，可能带来挑战但也能带来全面的视角。'
  }
  return interpretations[aspectType] || ''
}

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
    <!-- 顶部渐变背景 -->
    <div class="hero-section">
      <span class="page-title animate-fade-in">星盘分析</span>
      <span class="page-subtitle animate-slide-up">输入出生信息，生成你的个人星盘</span>
    </div>

    <div class="container">
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

        <!-- 动态星盘 -->
        <div class="chart-card animate-slide-up">
          <span class="card-title">动态星盘</span>
          <div class="zodiac-wheel-container">
            <div class="zodiac-wheel">
              <!-- 星座轮 -->
              <div class="wheel-bg"></div>
              <div v-for="zodiac in zodiacWheel" :key="zodiac.sign" class="zodiac-sector" :style="{ transform: `rotate(${zodiac.angle}deg)` }">
                <div class="sector-content">
                  <span class="sector-name">{{ zodiac.sign }}</span>
                </div>
              </div>
              <!-- 行星位置 -->
              <div v-for="planet in planetPositions" :key="planet.key" class="planet-position" :style="{ transform: `rotate(${planet.angle}deg)` }">
                <div class="planet-marker" :style="{ backgroundColor: planet.color }">
                  <span class="planet-marker-icon">{{ planet.icon }}</span>
                </div>
              </div>
              <!-- 中心 -->
              <div class="wheel-center">
                <span class="center-text">星盘</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 行星分布 -->
        <div class="chart-card animate-slide-up" style="animation-delay: 0.1s">
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

        <!-- 行星相位分析 -->
        <div class="chart-card animate-slide-up" style="animation-delay: 0.2s">
          <span class="card-title">行星相位分析</span>
          <div v-if="aspects.length > 0" class="aspects-list">
            <div v-for="(aspect, index) in aspects" :key="index" class="aspect-item animate-scale" :style="{ animationDelay: `${index * 0.1}s` }">
              <div class="aspect-header">
                <span class="aspect-planets">{{ aspect.planet1 }} {{ aspect.aspectType }} {{ aspect.planet2 }}</span>
                <span class="aspect-orb">{{ aspect.orb }}°</span>
              </div>
              <div class="aspect-description">
                {{ getAspectInterpretation(aspect.aspectType) }}
              </div>
            </div>
          </div>
          <div v-else class="no-aspects">
            <span>暂无明显相位关系</span>
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
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: var(--space-md);
  padding-bottom: var(--space-2xl);
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
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-white);
  display: block;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.9);
  display: block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.form-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
}

.form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.form-item {
  margin-bottom: var(--space-lg);
  position: relative;
}

.form-label {
  font-size: var(--text-base);
  color: var(--text-secondary);
  margin-bottom: var(--space-sm);
  display: block;
  font-weight: var(--font-medium);
}

.input-value {
  width: 100%;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  border: 1px solid var(--border-light);
  transition: all var(--transition-normal);
  color: var(--text-primary);
}

.input-value::placeholder {
  color: var(--text-muted);
}

/* 修改日期和时间选择器图标的颜色 */
.input-value[type="date"]::-webkit-calendar-picker-indicator,
.input-value[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(2);
  cursor: pointer;
}

/* 兼容Firefox */
.input-value[type="date"]::-moz-calendar-picker-indicator,
.input-value[type="time"]::-moz-calendar-picker-indicator {
  filter: invert(1) brightness(2);
  cursor: pointer;
}

.input-value:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: var(--bg-primary);
}

.submit-btn {
  margin-top: var(--space-xl);
  background: var(--bg-gradient);
  color: var(--text-white);
  border-radius: var(--radius-full);
  padding: var(--space-md);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.result-section {
  padding-top: var(--space-md);
}

.basic-info {
  text-align: center;
  margin-bottom: var(--space-lg);
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
}

.info-text {
  font-size: var(--text-base);
  color: rgba(255, 255, 255, 0.95);
  font-weight: var(--font-medium);
}

.chart-card,
.element-card,
.interpretation-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  border-left: 4px solid var(--primary);
}

.chart-card:hover,
.element-card:hover,
.interpretation-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  display: block;
}

.planet-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.planet-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}

.planet-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--bg-primary);
}

.planet-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.planet-item:hover .planet-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.planet-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.planet-name {
  font-size: var(--text-sm);
  color: var(--text-muted);
  font-weight: var(--font-medium);
}

.planet-sign {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-top: 2px;
}

.planet-degree {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-top: 1px;
}

.element-bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.element-bar-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  position: relative;
}

.element-label {
  width: 60px;
  font-size: var(--text-base);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.bar-container {
  flex: 1;
  height: 24px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.8s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  width: 60px;
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: right;
  font-weight: var(--font-medium);
}

.dominant-element {
  margin-top: var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.dominant-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}

.dominant-value {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
}

.interpretation-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.interpretation-icon {
  font-size: 32px;
  animation: bounce 2s infinite;
}

.interpretation-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.interpretation-content {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
  border-left: 4px solid var(--primary);
}

.interpretation-content:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-md);
}

.interpretation-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  display: block;
  font-weight: var(--font-medium);
}

.back-btn {
  margin-top: var(--space-lg);
  background: var(--bg-primary);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  padding: var(--space-md);
  font-size: var(--text-lg);
  border: 1px solid var(--border-light);
  width: 100%;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-weight: var(--font-medium);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
  color: var(--primary);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4xl) 0;
}

.loading-spinner {
  width: 80px;
  height: 80px;
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-top: 8px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-xl);
}

.loading-spinner-small {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: var(--text-lg);
  color: #fff;
  font-weight: var(--font-medium);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
    transform: translateY(20px);
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
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
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

@media (max-width: 768px) {
  .hero-section {
    padding: var(--space-xl) var(--space-md);
  }

  .form-card {
    padding: var(--space-lg);
  }

  .planet-list {
    grid-template-columns: 1fr;
  }

  .chart-card,
  .element-card,
  .interpretation-card {
    padding: var(--space-lg);
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import type { ZodiacSign, HoroscopeChart } from '@/types/zodiac'

const { getZodiacByDate } = useZodiac()

const birthDate = ref('')
const birthTime = ref('12:00')
const birthPlace = ref('')
const showResult = ref(false)

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
    uni.showToast({ title: '请选择出生日期', icon: 'none' })
    return
  }
  showResult.value = true
}
</script>

<template>
  <view class="page">
    <view class="header">
      <text class="page-title">星盘分析</text>
      <text class="page-subtitle">输入出生信息，生成你的个人星盘</text>
    </view>

    <view v-if="!showResult" class="form-card">
      <view class="form-item">
        <text class="form-label">出生日期</text>
        <picker mode="date" @change="(e: any) => birthDate = e.detail.value">
          <view class="picker-value">
            <text>{{ birthDate || '请选择' }}</text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">出生时间</text>
        <picker mode="time" @change="(e: any) => birthTime = e.detail.value">
          <view class="picker-value">
            <text>{{ birthTime }}</text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">出生地点</text>
        <input
          class="input-value"
          type="text"
          v-model="birthPlace"
          placeholder="如：北京"
        />
      </view>

      <button class="submit-btn" @click="submitForm">生成星盘</button>
    </view>

    <view v-else class="result-section">
      <view class="basic-info">
        <text class="info-text">
          {{ birthDate }} | {{ birthTime }} | {{ birthPlace || '未知地点' }}
        </text>
      </view>

      <view class="chart-card">
        <text class="card-title">行星分布</text>
        <view class="planet-list">
          <view v-for="planet in planetConfig" :key="planet.key" class="planet-item">
            <view class="planet-icon" :style="{ backgroundColor: planet.color }">
              <text>{{ planet.icon }}</text>
            </view>
            <view class="planet-info">
              <text class="planet-name">{{ planet.name }}</text>
              <text class="planet-sign">{{ chart?.[planet.key as keyof typeof chart]?.sign }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="element-card">
        <text class="card-title">元素分布</text>
        <view class="element-bars">
          <view v-for="(count, element) in analyzeChart?.elements" :key="element" class="element-bar-item">
            <text class="element-label">{{ element }}</text>
            <view class="bar-container">
              <view
                class="bar-fill"
                :style="{
                  width: `${(count / 6) * 100}%`,
                  backgroundColor: ELEMENT_COLORS[element]
                }"
              ></view>
            </view>
            <text class="element-count">{{ count }}/6</text>
          </view>
        </view>
      </view>

      <view class="interpretation-card">
        <view class="interpretation-header">
          <text class="interpretation-icon">🔮</text>
          <text class="interpretation-title">命理解读</text>
        </view>
        <text class="interpretation-text">{{ analyzeChart?.interpretation }}</text>
      </view>

      <button class="back-btn" @click="showResult = false">重新输入</button>
    </view>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #434343 0%, #f5f5f5 40%);
  padding: 20rpx;
}

.header {
  padding: 30rpx 20rpx;
  text-align: center;
}

.page-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}

.page-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10rpx;
}

.form-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
  display: block;
}

.picker-value {
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
}

.picker-value text {
  font-size: 30rpx;
  color: #333;
}

.input-value {
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  font-size: 30rpx;
}

.submit-btn {
  margin-top: 40rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 50rpx;
  padding: 25rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
}

.result-section {
  padding-top: 10rpx;
}

.basic-info {
  text-align: center;
  margin-bottom: 20rpx;
}

.info-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}

.chart-card,
.element-card,
.interpretation-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 25rpx;
}

.planet-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.planet-item {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.planet-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
}

.planet-info {
  display: flex;
  flex-direction: column;
}

.planet-name {
  font-size: 24rpx;
  color: #999;
}

.planet-sign {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.element-bars {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.element-bar-item {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.element-label {
  width: 60rpx;
  font-size: 26rpx;
  color: #666;
}

.bar-container {
  flex: 1;
  height: 24rpx;
  background: #f0f0f0;
  border-radius: 12rpx;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 12rpx;
  transition: width 0.3s ease;
}

.element-count {
  width: 60rpx;
  font-size: 24rpx;
  color: #999;
  text-align: right;
}

.interpretation-header {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.interpretation-icon {
  font-size: 36rpx;
}

.interpretation-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.interpretation-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.back-btn {
  margin-top: 20rpx;
  background: #f5f5f5;
  color: #666;
  border-radius: 50rpx;
  padding: 25rpx;
  font-size: 30rpx;
  border: none;
}
</style>

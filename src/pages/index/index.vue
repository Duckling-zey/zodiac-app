<script setup lang="ts">
import { ref, computed } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import { useHoroscope } from '@/composables/useHoroscope'
import { ELEMENT_COLORS } from '@/utils/zodiac-data'

const { zodiacList, selectedZodiac, setSelectedZodiac, getZodiacInfo } = useZodiac()
const { currentHoroscope, getHoroscopeWithDescription } = useHoroscope()

const showPicker = ref(false)

const currentInfo = computed(() => getZodiacInfo(selectedZodiac.value))
const horoscopeDetail = computed(() => getHoroscopeWithDescription(selectedZodiac.value))

const selectZodiac = (sign: typeof selectedZodiac.value) => {
  setSelectedZodiac(sign)
  showPicker.value = false
}

const getScoreColor = (score: number) => {
  if (score >= 80) return '#4CAF50'
  if (score >= 60) return '#FF9800'
  return '#f44336'
}
</script>

<template>
  <view class="page">
    <view class="header">
      <view class="zodiac-card" @click="showPicker = true">
        <text class="zodiac-symbol">{{ currentInfo?.symbol }}</text>
        <view class="zodiac-info">
          <text class="zodiac-name">{{ selectedZodiac }}</text>
          <text class="zodiac-date">{{ currentInfo?.dateRange }}</text>
        </view>
        <text class="select-tip">点击切换</text>
      </view>
    </view>

    <view class="date-display">
      <text>{{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</text>
      <text class="weekday">{{ new Date().toLocaleDateString('zh-CN', { weekday: 'long' }) }}</text>
    </view>

    <view class="horoscope-card">
      <view class="card-header">
        <text class="card-title">今日运势</text>
        <view class="element-tag" :style="{ backgroundColor: ELEMENT_COLORS[currentInfo?.element || '火'] }">
          {{ currentInfo?.element }}象
        </view>
      </view>

      <view class="scores-grid">
        <view class="score-item">
          <view class="score-circle" :style="{ borderColor: getScoreColor(horoscopeDetail.overall) }">
            <text class="score-value">{{ horoscopeDetail.overall }}</text>
          </view>
          <text class="score-label">综合</text>
        </view>
        <view class="score-item">
          <view class="score-circle" :style="{ borderColor: getScoreColor(horoscopeDetail.love) }">
            <text class="score-value">{{ horoscopeDetail.love }}</text>
          </view>
          <text class="score-label">爱情</text>
        </view>
        <view class="score-item">
          <view class="score-circle" :style="{ borderColor: getScoreColor(horoscopeDetail.career) }">
            <text class="score-value">{{ horoscopeDetail.career }}</text>
          </view>
          <text class="score-label">事业</text>
        </view>
        <view class="score-item">
          <view class="score-circle" :style="{ borderColor: getScoreColor(horoscopeDetail.fortune) }">
            <text class="score-value">{{ horoscopeDetail.fortune }}</text>
          </view>
          <text class="score-label">财运</text>
        </view>
      </view>

      <view class="tip-section">
        <text class="tip-label">今日提示</text>
        <text class="tip-text">{{ horoscopeDetail.tip }}</text>
      </view>
    </view>

    <uni-popup v-if="showPicker" type="bottom" @close="showPicker = false">
      <view class="zodiac-picker">
        <view class="picker-header">
          <text class="picker-title">选择星座</text>
          <text class="picker-close" @click="showPicker = false">关闭</text>
        </view>
        <view class="zodiac-grid">
          <view
            v-for="zodiac in zodiacList"
            :key="zodiac.name"
            class="zodiac-grid-item"
            :class="{ active: zodiac.name === selectedZodiac }"
            @click="selectZodiac(zodiac.name)"
          >
            <text class="grid-symbol">{{ zodiac.symbol }}</text>
            <text class="grid-name">{{ zodiac.name }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #4a90e2 0%, #f5f5f5 40%);
  padding: 20rpx;
}

.header {
  padding: 20rpx;
}

.zodiac-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.zodiac-symbol {
  font-size: 80rpx;
  margin-right: 30rpx;
}

.zodiac-info {
  flex: 1;
}

.zodiac-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.zodiac-date {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
}

.select-tip {
  font-size: 24rpx;
  color: #4a90e2;
}

.date-display {
  text-align: center;
  padding: 30rpx;
  color: #fff;
}

.date-display text:first-child {
  font-size: 32rpx;
  font-weight: bold;
}

.weekday {
  font-size: 28rpx;
  opacity: 0.9;
  margin-top: 10rpx;
}

.horoscope-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.element-tag {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  color: #fff;
  font-size: 24rpx;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 6rpx solid;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
}

.score-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.score-label {
  font-size: 24rpx;
  color: #666;
}

.tip-section {
  margin-top: 30rpx;
  padding: 20rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
}

.tip-label {
  font-size: 26rpx;
  color: #4a90e2;
  font-weight: bold;
}

.tip-text {
  font-size: 28rpx;
  color: #666;
  margin-top: 10rpx;
  line-height: 1.6;
}

.zodiac-picker {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1px solid #eee;
}

.picker-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.picker-close {
  font-size: 28rpx;
  color: #4a90e2;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  padding: 30rpx;
}

.zodiac-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}

.zodiac-grid-item.active {
  background: #4a90e2;
}

.zodiac-grid-item.active .grid-name {
  color: #fff;
}

.grid-symbol {
  font-size: 48rpx;
}

.grid-name {
  font-size: 24rpx;
  color: #666;
  margin-top: 8rpx;
}
</style>

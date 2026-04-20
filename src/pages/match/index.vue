<script setup lang="ts">
import { ref, computed } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import { ELEMENT_COLORS } from '@/utils/zodiac-data'
import type { ZodiacSign } from '@/types/zodiac'

const { zodiacList, selectedZodiac, secondZodiac, setSelectedZodiac, setSecondZodiac, getZodiacInfo, getMatchResult } = useZodiac()

const activePicker = ref<'first' | 'second' | null>(null)

const firstInfo = computed(() => getZodiacInfo(selectedZodiac.value))
const secondInfo = computed(() => getZodiacInfo(secondZodiac.value))
const matchResult = computed(() => getMatchResult(selectedZodiac.value, secondZodiac.value))

const selectZodiac = (sign: ZodiacSign, type: 'first' | 'second') => {
  if (type === 'first') {
    setSelectedZodiac(sign)
  } else {
    setSecondZodiac(sign)
  }
  activePicker.value = null
}

const openPicker = (type: 'first' | 'second') => {
  activePicker.value = type
}

const getMatchLevel = (score: number) => {
  if (score >= 85) return { text: '非常契合', color: '#4CAF50' }
  if (score >= 70) return { text: '比较契合', color: '#FF9800' }
  return { text: '一般契合', color: '#999' }
}

const matchLevel = computed(() => getMatchLevel(matchResult.value.score))
</script>

<template>
  <view class="page">
    <view class="match-header">
      <text class="page-title">星座匹配</text>
      <text class="page-subtitle">查看两个星座之间的契合度</text>
    </view>

    <view class="zodiac-selectors">
      <view class="selector-card" @click="openPicker('first')">
        <text class="selector-symbol">{{ firstInfo?.symbol }}</text>
        <text class="selector-name">{{ selectedZodiac }}</text>
        <text class="selector-hint">点击选择</text>
      </view>

      <view class="match-heart">
        <text class="heart-symbol">❤️</text>
        <text class="match-score">{{ matchResult.score }}%</text>
      </view>

      <view class="selector-card" @click="openPicker('second')">
        <text class="selector-symbol">{{ secondInfo?.symbol }}</text>
        <text class="selector-name">{{ secondZodiac }}</text>
        <text class="selector-hint">点击选择</text>
      </view>
    </view>

    <view class="result-card">
      <view class="result-header">
        <text class="result-title">匹配分析</text>
        <view class="level-tag" :style="{ backgroundColor: matchLevel.color }">
          {{ matchLevel.text }}
        </view>
      </view>

      <view class="elements-info">
        <view class="element-item">
          <view class="element-dot" :style="{ backgroundColor: ELEMENT_COLORS[firstInfo?.element || '火'] }"></view>
          <text>{{ selectedZodiac }} ({{ firstInfo?.element }}象)</text>
        </view>
        <view class="element-item">
          <view class="element-dot" :style="{ backgroundColor: ELEMENT_COLORS[secondInfo?.element || '水'] }"></view>
          <text>{{ secondZodiac }} ({{ secondInfo?.element }}象)</text>
        </view>
      </view>

      <view class="analysis-text">
        <text>{{ matchResult.analysis }}</text>
      </view>

      <view class="tips-section">
        <text class="tips-title">相处建议</text>
        <view v-for="(tip, index) in matchResult.tips" :key="index" class="tip-item">
          <text class="tip-index">{{ index + 1 }}</text>
          <text class="tip-content">{{ tip }}</text>
        </view>
      </view>
    </view>

    <uni-popup v-if="activePicker" type="bottom" @close="activePicker = null">
      <view class="zodiac-picker">
        <view class="picker-header">
          <text class="picker-title">选择{{ activePicker === 'first' ? '第一个' : '第二个' }}星座</text>
          <text class="picker-close" @click="activePicker = null">关闭</text>
        </view>
        <view class="zodiac-grid">
          <view
            v-for="zodiac in zodiacList"
            :key="zodiac.name"
            class="zodiac-grid-item"
            :class="{ active: (activePicker === 'first' ? zodiac.name === selectedZodiac : zodiac.name === secondZodiac) }"
            @click="selectZodiac(zodiac.name, activePicker!)"
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
  background: linear-gradient(180deg, #ff9a9e 0%, #f5f5f5 40%);
  padding: 20rpx;
}

.match-header {
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
  color: rgba(255, 255, 255, 0.9);
  margin-top: 10rpx;
}

.zodiac-selectors {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
}

.selector-card {
  flex: 1;
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.selector-symbol {
  font-size: 64rpx;
}

.selector-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-top: 10rpx;
}

.selector-hint {
  font-size: 22rpx;
  color: #999;
  margin-top: 5rpx;
}

.match-heart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20rpx;
}

.heart-symbol {
  font-size: 48rpx;
}

.match-score {
  font-size: 32rpx;
  font-weight: bold;
  color: #e91e63;
  margin-top: 5rpx;
}

.result-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-top: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.level-tag {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  color: #fff;
  font-size: 24rpx;
}

.elements-info {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin-top: 20rpx;
  padding: 20rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.element-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.element-item text {
  font-size: 26rpx;
  color: #666;
}

.analysis-text {
  margin-top: 25rpx;
  padding: 20rpx;
  background: #fff5f5;
  border-radius: 12rpx;
  border-left: 4rpx solid #e91e63;
}

.analysis-text text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.tips-section {
  margin-top: 25rpx;
}

.tips-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 15rpx;
  margin-top: 15rpx;
}

.tip-index {
  width: 40rpx;
  height: 40rpx;
  background: #4a90e2;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  flex-shrink: 0;
}

.tip-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
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
  background: #e91e63;
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

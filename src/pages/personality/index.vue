<script setup lang="ts">
import { ref, computed } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import { ELEMENT_COLORS } from '@/utils/zodiac-data'

const { zodiacList, selectedZodiac, setSelectedZodiac, getZodiacInfo, getPersonalityAnalysis } = useZodiac()

const showPicker = ref(false)

const currentInfo = computed(() => getZodiacInfo(selectedZodiac.value))
const personality = computed(() => getPersonalityAnalysis(selectedZodiac.value))

const selectZodiac = (sign: typeof selectedZodiac.value) => {
  setSelectedZodiac(sign)
  showPicker.value = false
}
</script>

<template>
  <view class="page">
    <view class="header">
      <view class="zodiac-display" @click="showPicker = true">
        <view class="zodiac-main">
          <text class="zodiac-symbol">{{ currentInfo?.symbol }}</text>
          <view class="zodiac-text">
            <text class="zodiac-name">{{ selectedZodiac }}</text>
            <text class="zodiac-date">{{ currentInfo?.dateRange }}</text>
          </view>
        </view>
        <view class="zodiac-tags">
          <view class="tag" :style="{ backgroundColor: ELEMENT_COLORS[currentInfo?.element || '火'] }">
            {{ currentInfo?.element }}象
          </view>
          <view class="tag tag-outline">
            {{ currentInfo?.qualities }}
          </view>
          <view class="tag tag-planet">
            {{ currentInfo?.planet }}
          </view>
        </view>
      </view>
    </view>

    <view class="content">
      <view class="section">
        <view class="section-header">
          <text class="section-icon">💪</text>
          <text class="section-title">性格优势</text>
        </view>
        <view class="trait-list">
          <view v-for="(trait, index) in personality.strengths" :key="index" class="trait-item strength">
            <text class="trait-text">{{ trait }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-icon">⚠️</text>
          <text class="section-title">潜在弱点</text>
        </view>
        <view class="trait-list">
          <view v-for="(trait, index) in personality.weaknesses" :key="index" class="trait-item weakness">
            <text class="trait-text">{{ trait }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-icon">💕</text>
          <text class="section-title">爱情风格</text>
        </view>
        <view class="description-card">
          <text>{{ personality.loveStyle }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-icon">💼</text>
          <text class="section-title">职业倾向</text>
        </view>
        <view class="career-list">
          <view v-for="(career, index) in personality.careerPaths" :key="index" class="career-item">
            <text class="career-index">{{ index + 1 }}</text>
            <text class="career-text">{{ career }}</text>
          </view>
        </view>
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
  background: #f5f5f5;
  padding-bottom: 120rpx;
}

.header {
  padding: 20rpx;
}

.zodiac-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.3);
}

.zodiac-main {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.zodiac-symbol {
  font-size: 80rpx;
}

.zodiac-text {
  display: flex;
  flex-direction: column;
}

.zodiac-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #fff;
}

.zodiac-date {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5rpx;
}

.zodiac-tags {
  display: flex;
  gap: 15rpx;
  margin-top: 25rpx;
  flex-wrap: wrap;
}

.tag {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  color: #fff;
  font-size: 24rpx;
}

.tag-outline {
  background: transparent;
  border: 2rpx solid rgba(255, 255, 255, 0.8);
}

.tag-planet {
  background: rgba(255, 255, 255, 0.2);
}

.content {
  padding: 20rpx;
}

.section {
  background: #fff;
  border-radius: 20rpx;
  padding: 25rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.section-icon {
  font-size: 36rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.trait-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.trait-item {
  padding: 15rpx 25rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
}

.trait-item.strength {
  background: #e8f5e9;
  color: #2e7d32;
}

.trait-item.weakness {
  background: #fff3e0;
  color: #e65100;
}

.trait-text {
  font-size: 26rpx;
}

.description-card {
  background: #fce4ec;
  border-radius: 12rpx;
  padding: 20rpx;
}

.description-card text {
  font-size: 28rpx;
  color: #880e4f;
  line-height: 1.6;
}

.career-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15rpx;
}

.career-item {
  display: flex;
  align-items: center;
  gap: 15rpx;
  padding: 15rpx 20rpx;
  background: #e3f2fd;
  border-radius: 10rpx;
}

.career-index {
  width: 40rpx;
  height: 40rpx;
  background: #1976d2;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  flex-shrink: 0;
}

.career-text {
  font-size: 26rpx;
  color: #1565c0;
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
  background: #667eea;
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

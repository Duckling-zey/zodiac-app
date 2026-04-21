<script setup lang="ts">
import { ref, computed } from 'vue'

interface KnowledgeItem {
  id: number
  title: string
  content: string
  category: string
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  readCount: number
  publishDate: Date
  thumbnail: string
}

const categories = [
  { id: 'zodiac', name: '星座基础', icon: '🌟' },
  { id: 'planets', name: '行星知识', icon: '🪐' },
  { id: 'houses', name: '宫位解析', icon: '🏠' },
  { id: 'aspects', name: '相位关系', icon: '🔗' },
  { id: 'transits', name: '行运预测', icon: '🚀' },
  { id: 'synastry', name: '合盘分析', icon: '❤️' }
]

const knowledgeItems = ref<KnowledgeItem[]>([
  {
    id: 1,
    title: '十二星座基础知识',
    content: '星座是占星学中最基础的概念，代表着太阳在黄道上的位置。每个星座都有其独特的性格特点、守护星和元素属性。本文将详细介绍十二星座的基本信息，帮助你更好地理解星座学的基础。',
    category: 'zodiac',
    tags: ['星座基础', '入门', '性格分析'],
    level: 'beginner',
    readCount: 1254,
    publishDate: new Date('2024-01-10'),
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=zodiac%20wheel%20with%20twelve%20constellations%20in%20cosmic%20background&image_size=landscape_16_9'
  },
  {
    id: 2,
    title: '行星在占星学中的意义',
    content: '行星是占星学中的重要组成部分，每个行星都代表着不同的能量和影响。从太阳、月亮到水星、金星、火星等，它们在星盘中的位置和相位关系会影响一个人的性格、行为和命运。',
    category: 'planets',
    tags: ['行星', '能量', '影响'],
    level: 'intermediate',
    readCount: 876,
    publishDate: new Date('2024-01-08'),
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=solar%20system%20planets%20in%20cosmic%20space&image_size=landscape_16_9'
  },
  {
    id: 3,
    title: '十二宫位的含义与影响',
    content: '十二宫位代表着人生的不同领域，从第一宫的自我到第十二宫的潜意识。每个宫位都与特定的生活领域相关联，其行星和星座的配置会影响相应领域的表现。',
    category: 'houses',
    tags: ['宫位', '人生领域', '星盘'],
    level: 'intermediate',
    readCount: 654,
    publishDate: new Date('2024-01-05'),
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=astrological%20chart%20with%20twelve%20houses&image_size=landscape_16_9'
  },
  {
    id: 4,
    title: '相位关系的解读方法',
    content: '相位是行星之间的角度关系，代表着能量的互动方式。主要相位包括合相、六分相、四分相、三分相和对相，每种相位都有其独特的含义和影响。',
    category: 'aspects',
    tags: ['相位', '能量互动', '星盘分析'],
    level: 'advanced',
    readCount: 432,
    publishDate: new Date('2024-01-02'),
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=planetary%20aspects%20lines%20in%20astrological%20chart&image_size=landscape_16_9'
  },
  {
    id: 5,
    title: '行运预测的基本原理',
    content: '行运是指行星在天空中的运行对个人星盘的影响。通过分析行运行星与本命盘的相位关系，可以预测个人在特定时期的运势变化和重要事件。',
    category: 'transits',
    tags: ['行运', '预测', '运势'],
    level: 'advanced',
    readCount: 567,
    publishDate: new Date('2023-12-28'),
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=planet%20movement%20through%20zodiac%20signs&image_size=landscape_16_9'
  },
  {
    id: 6,
    title: '合盘分析与关系匹配',
    content: '合盘分析是将两个人的星盘进行比较，分析它们之间的相位关系，以评估两人的 compatibility 和潜在挑战。这对于亲密关系、友谊和合作关系都有重要参考价值。',
    category: 'synastry',
    tags: ['合盘', '关系', '匹配'],
    level: 'intermediate',
    readCount: 789,
    publishDate: new Date('2023-12-25'),
    thumbnail: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=two%20astrological%20charts%20overlapping%20with%20connection%20lines&image_size=landscape_16_9'
  }
])

const selectedCategory = ref('all')
const selectedLevel = ref('all')
const searchQuery = ref('')

const filteredItems = computed(() => {
  return knowledgeItems.value.filter(item => {
    const matchesCategory = selectedCategory.value === 'all' || item.category === selectedCategory.value
    const matchesLevel = selectedLevel.value === 'all' || item.level === selectedLevel.value
    const matchesSearch = searchQuery.value === '' ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    return matchesCategory && matchesLevel && matchesSearch
  })
})

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getLevelColor = (level: string): string => {
  switch (level) {
    case 'beginner': return '#2ed573'
    case 'intermediate': return '#3742fa'
    case 'advanced': return '#ff4757'
    default: return '#747d8c'
  }
}

const getLevelText = (level: string): string => {
  switch (level) {
    case 'beginner': return '入门'
    case 'intermediate': return '进阶'
    case 'advanced': return '高级'
    default: return '未知'
  }
}
</script>

<template>
  <div class="knowledge-page">
    <div class="hero-section">
      <span class="page-title animate-fade-in">占星学知识库</span>
      <span class="page-subtitle animate-slide-up">探索神秘的占星学世界</span>
    </div>

    <div class="container">
      <!-- 搜索和筛选 -->
      <div class="search-filter-section">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索知识库..."
          />
          <span class="search-icon">🔍</span>
        </div>

        <div class="filter-section">
          <!-- 分类筛选 -->
          <div class="filter-group">
            <span class="filter-label">分类</span>
            <div class="filter-options">
              <button
                class="filter-option"
                :class="{ active: selectedCategory === 'all' }"
                @click="selectedCategory = 'all'"
              >
                全部
              </button>
              <button
                v-for="category in categories"
                :key="category.id"
                class="filter-option"
                :class="{ active: selectedCategory === category.id }"
                @click="selectedCategory = category.id"
              >
                <span class="category-icon">{{ category.icon }}</span>
                {{ category.name }}
              </button>
            </div>
          </div>

          <!-- 难度筛选 -->
          <div class="filter-group">
            <span class="filter-label">难度</span>
            <div class="filter-options">
              <button
                class="filter-option"
                :class="{ active: selectedLevel === 'all' }"
                @click="selectedLevel = 'all'"
              >
                全部
              </button>
              <button
                class="filter-option"
                :class="{ active: selectedLevel === 'beginner' }"
                @click="selectedLevel = 'beginner'"
              >
                入门
              </button>
              <button
                class="filter-option"
                :class="{ active: selectedLevel === 'intermediate' }"
                @click="selectedLevel = 'intermediate'"
              >
                进阶
              </button>
              <button
                class="filter-option"
                :class="{ active: selectedLevel === 'advanced' }"
                @click="selectedLevel = 'advanced'"
              >
                高级
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 知识列表 -->
      <div class="knowledge-list">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="knowledge-card animate-slide-up"
        >
          <div class="card-thumbnail">
            <img :src="item.thumbnail" :alt="item.title" />
          </div>
          <div class="card-content">
            <div class="card-header">
              <h3 class="card-title">{{ item.title }}</h3>
              <span
                class="card-level"
                :style="{ backgroundColor: getLevelColor(item.level) }"
              >
                {{ getLevelText(item.level) }}
              </span>
            </div>
            <p class="card-description">{{ item.content }}</p>
            <div class="card-tags">
              <span
                v-for="(tag, index) in item.tags"
                :key="index"
                class="card-tag"
              >
                {{ tag }}
              </span>
            </div>
            <div class="card-footer">
              <span class="card-date">{{ formatDate(item.publishDate) }}</span>
              <span class="card-reads">👁️ {{ item.readCount }}</span>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div v-if="filteredItems.length === 0" class="no-results">
          <span class="no-results-icon">🔍</span>
          <span class="no-results-text">未找到相关知识内容</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-page {
  min-height: 100vh;
  background: var(--bg-secondary);
  padding-bottom: var(--space-2xl);
}

.hero-section {
  background: var(--bg-gradient);
  padding: var(--space-2xl) var(--space-md);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-bottom: var(--space-lg);
  text-align: center;
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

.search-filter-section {
  margin-bottom: var(--space-lg);
}

.search-box {
  position: relative;
  margin-bottom: var(--space-lg);
}

.search-input {
  width: 100%;
  padding: var(--space-md) var(--space-lg) var(--space-md) var(--space-2xl);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: var(--space-md);
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--text-muted);
}

.filter-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.filter-group {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
}

.filter-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.filter-option {
  padding: var(--space-xs) var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.filter-option:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
}

.filter-option.active {
  background: var(--bg-gradient);
  color: var(--text-white);
  border-color: transparent;
  box-shadow: var(--shadow-md);
}

.category-icon {
  font-size: 14px;
}

.knowledge-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.knowledge-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
  display: flex;
  gap: var(--space-lg);
}

.knowledge-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-thumbnail {
  flex: 0 0 300px;
  height: 200px;
  overflow: hidden;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.knowledge-card:hover .card-thumbnail img {
  transform: scale(1.05);
}

.card-content {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  flex: 1;
  margin-right: var(--space-md);
}

.card-level {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-white);
  align-self: flex-start;
}

.card-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-md);
  flex: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.card-tag {
  font-size: var(--text-xs);
  color: var(--text-muted);
  background: var(--bg-secondary);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-light);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-light);
}

.card-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.card-reads {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.no-results {
  text-align: center;
  padding: var(--space-2xl);
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-top: var(--space-lg);
}

.no-results-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-md);
}

.no-results-text {
  font-size: var(--text-base);
  color: var(--text-muted);
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

.animate-fade-in {
  animation: fadeIn 0.5s ease;
}

.animate-slide-up {
  animation: slideUp 0.6s ease;
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--space-xl) var(--space-md);
  }

  .knowledge-card {
    flex-direction: column;
  }

  .card-thumbnail {
    flex: 0 0 200px;
    width: 100%;
  }

  .card-content {
    padding: var(--space-md);
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .card-level {
    align-self: flex-start;
  }

  .filter-options {
    gap: var(--space-xs);
  }

  .filter-option {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--text-xs);
  }
}
</style>

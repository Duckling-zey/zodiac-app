<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import { ELEMENT_COLORS } from '@/utils/zodiac-data'

const { zodiacList, selectedZodiac, setSelectedZodiac, getZodiacInfo, getPersonalityAnalysis } = useZodiac()

const showPicker = ref(false)
const isLoading = ref(false)
const showTest = ref(false)
const currentQuestionIndex = ref(0)
const userAnswers = ref<number[]>([])
const testCompleted = ref(false)

const currentInfo = computed(() => getZodiacInfo(selectedZodiac.value))
const personality = computed(() => getPersonalityAnalysis(selectedZodiac.value))

// 性格测试题目
const testQuestions = [
  {
    question: '当你遇到问题时，你更倾向于：',
    options: [
      '直接面对并解决它',
      '仔细分析后再决定',
      '寻求他人的建议',
      '等待问题自行解决'
    ]
  },
  {
    question: '在社交场合中，你通常：',
    options: [
      '主动与他人交流',
      '观察后再参与',
      '与熟悉的人交谈',
      '更喜欢独处'
    ]
  },
  {
    question: '对于未来，你更倾向于：',
    options: [
      '制定详细的计划',
      '保持灵活，随机应变',
      '走一步看一步',
      '随波逐流'
    ]
  },
  {
    question: '当你感到压力时，你会：',
    options: [
      '通过运动或活动释放',
      '冷静思考解决方法',
      '与朋友倾诉',
      '独自思考或休息'
    ]
  },
  {
    question: '在团队合作中，你通常是：',
    options: [
      '领导者，主导方向',
      '分析者，提供建议',
      '协调者，促进沟通',
      '执行者，完成任务'
    ]
  }
]

// 计算测试结果
const testResult = computed(() => {
  if (!testCompleted.value) return null

  const scores = [0, 0, 0, 0]
  userAnswers.value.forEach(answer => {
    scores[answer]++
  })

  const maxScore = Math.max(...scores)
  const dominantTrait = scores.indexOf(maxScore)

  const traits = [
    { name: '火象特质', description: '热情、直接、行动派', color: '#e74c3c' },
    { name: '土象特质', description: '务实、稳重、有耐心', color: '#8b4513' },
    { name: '风象特质', description: '理性、灵活、善于沟通', color: '#3498db' },
    { name: '水象特质', description: '感性、直觉、情绪化', color: '#1abc9c' }
  ]

  return traits[dominantTrait]
})

const startTest = () => {
  showTest.value = true
  currentQuestionIndex.value = 0
  userAnswers.value = []
  testCompleted.value = false
}

const answerQuestion = (answer: number) => {
  userAnswers.value.push(answer)
  if (currentQuestionIndex.value < testQuestions.length - 1) {
    currentQuestionIndex.value++
  } else {
    testCompleted.value = true
  }
}

const restartTest = () => {
  startTest()
}

const closeTest = () => {
  showTest.value = false
}

watch(selectedZodiac, () => {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const selectZodiac = (sign: typeof selectedZodiac.value) => {
  isLoading.value = true
  setTimeout(() => {
    setSelectedZodiac(sign)
    showPicker.value = false
    isLoading.value = false
  }, 300)
}
</script>

<template>
  <div class="personality-page">
    <!-- 顶部渐变背景 -->
    <div class="hero-section">
      <div class="container">
        <!-- 星座选择卡片 -->
        <div class="zodiac-card" @click="showPicker = true">
          <div class="zodiac-content">
            <span class="zodiac-symbol">{{ currentInfo?.symbol }}</span>
            <div class="zodiac-info">
              <h2 class="zodiac-name">{{ selectedZodiac }}</h2>
              <p class="zodiac-date">{{ currentInfo?.dateRange }}</p>
              <div class="zodiac-tags">
                <span class="tag element-tag" :style="{ backgroundColor: ELEMENT_COLORS[currentInfo?.element || '火'] }">
                  {{ currentInfo?.element }}象
                </span>
                <span class="tag planet-tag">{{ currentInfo?.qualities }}</span>
                <span class="tag planet-tag">{{ currentInfo?.planet }}</span>
              </div>
            </div>
          </div>
          <span class="select-icon">↗</span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="container">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
      <template v-else>
        <!-- 性格优势 -->
        <div class="personality-card">
          <div class="card-header">
            <h3 class="card-title">性格优势</h3>
          </div>
          <div class="trait-list">
            <span v-for="(trait, index) in personality.strengths" :key="index" class="trait-item strength">
              {{ trait }}
            </span>
          </div>
        </div>

        <!-- 潜在弱点 -->
        <div class="personality-card">
          <div class="card-header">
            <h3 class="card-title">潜在弱点</h3>
          </div>
          <div class="trait-list">
            <span v-for="(trait, index) in personality.weaknesses" :key="index" class="trait-item weakness">
              {{ trait }}
            </span>
          </div>
        </div>

        <!-- 爱情风格 -->
        <div class="personality-card">
          <div class="card-header">
            <h3 class="card-title">爱情风格</h3>
          </div>
          <div class="description-section">
            <p class="description-text">{{ personality.loveStyle }}</p>
          </div>
        </div>

        <!-- 职业倾向 -->
        <div class="personality-card">
          <div class="card-header">
            <h3 class="card-title">职业倾向</h3>
          </div>
          <div class="career-grid">
            <div v-for="(career, index) in personality.careerPaths" :key="index" class="career-item">
              <span class="career-index">{{ index + 1 }}</span>
              <span class="career-text">{{ career }}</span>
            </div>
          </div>
        </div>

        <!-- 性格测试 -->
        <div class="personality-card">
          <div class="card-header">
            <h3 class="card-title">互动式性格测试</h3>
          </div>
          <div class="test-section">
            <p class="test-description">通过回答几个简单的问题，了解你最突出的性格特质</p>
            <button class="test-button" @click="startTest">开始测试</button>
          </div>
        </div>
      </template>
    </div>

    <!-- 性格测试弹窗 -->
    <div v-if="showTest" class="test-overlay" @click="closeTest">
      <div class="test-modal" @click.stop>
        <div class="test-header">
          <h3 class="test-title">性格测试</h3>
          <button class="test-close" @click="closeTest">✕</button>
        </div>

        <div v-if="!testCompleted" class="test-content">
          <div class="test-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%` }"></div>
            </div>
            <span class="progress-text">{{ currentQuestionIndex + 1 }}/{{ testQuestions.length }}</span>
          </div>

          <div class="test-question">
            <h4 class="question-text">{{ testQuestions[currentQuestionIndex].question }}</h4>
            <div class="test-options">
              <button
                v-for="(option, index) in testQuestions[currentQuestionIndex].options"
                :key="index"
                class="option-button"
                @click="answerQuestion(index)"
              >
                {{ option }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="test-result">
          <div class="result-header">
            <h4 class="result-title">测试结果</h4>
          </div>
          <div class="result-content" v-if="testResult">
            <div class="result-trait" :style="{ backgroundColor: testResult.color + '20', borderColor: testResult.color }">
              <h5 class="trait-name">{{ testResult.name }}</h5>
              <p class="trait-description">{{ testResult.description }}</p>
            </div>
            <div class="result-message">
              <p>你的性格特质与{{ selectedZodiac }}的{{ currentInfo?.element }}象属性{{ testResult.name.includes(currentInfo?.element) ? '高度契合' : '有所不同' }}。</p>
              <p>这说明你可能具有跨元素的性格特点，使你更加独特。</p>
            </div>
          </div>
          <div class="result-actions">
            <button class="restart-button" @click="restartTest">重新测试</button>
            <button class="close-button" @click="closeTest">关闭</button>
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
  </div>
</template>

<style scoped>
.personality-page {
  min-height: 100vh;
  background: var(--bg-secondary);
}

.hero-section {
  background: var(--bg-gradient);
  padding: var(--space-2xl) var(--space-md);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  margin-bottom: var(--space-lg);
  position: sticky;
  top: 0;
  z-index: 10;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
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
  color: var(--text-muted);
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

.personality-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  transition: all var(--transition-normal);
}

.personality-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  margin-bottom: var(--space-lg);
}

.card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.trait-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.trait-item {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.trait-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.trait-item.strength {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: var(--text-white);
}

.trait-item.weakness {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: var(--text-white);
}

.description-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  border-left: 4px solid var(--primary);
}

.description-text {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.career-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.career-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: all var(--transition-normal);
}

.career-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--bg-primary);
}

.career-index {
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: var(--text-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.career-text {
  font-size: var(--text-sm);
  color: var(--text-primary);
  font-weight: var(--font-medium);
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

  .personality-card {
    padding: var(--space-lg);
  }

  .career-grid {
    grid-template-columns: 1fr;
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

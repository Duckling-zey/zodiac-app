<script setup lang="ts">
import { ref, computed } from 'vue'

interface Test {
  id: string
  title: string
  description: string
  icon: string
  color: string
  questions: Question[]
}

interface Question {
  id: number
  text: string
  options: Option[]
}

interface Option {
  id: string
  text: string
  points: number
}

interface TestResult {
  testId: string
  testName: string
  score: number
  result: string
  interpretation: string
  date: Date
}

const tests = ref<Test[]>([
  {
    id: 'personality',
    title: '星座性格测试',
    description: '了解你的性格与哪个星座最匹配',
    icon: '🧠',
    color: '#ff6b81',
    questions: [
      {
        id: 1,
        text: '当你遇到困难时，你通常会：',
        options: [
          { id: 'a', text: '直接面对，积极解决', points: 5 },
          { id: 'b', text: '冷静分析，制定计划', points: 3 },
          { id: 'c', text: '寻求他人帮助', points: 2 },
          { id: 'd', text: '暂时回避，等待时机', points: 1 }
        ]
      },
      {
        id: 2,
        text: '你更喜欢哪种类型的活动：',
        options: [
          { id: 'a', text: '户外运动，冒险探索', points: 5 },
          { id: 'b', text: '阅读学习，自我提升', points: 3 },
          { id: 'c', text: '社交聚会，与人交流', points: 2 },
          { id: 'd', text: '安静休息，独自思考', points: 1 }
        ]
      },
      {
        id: 3,
        text: '在团队合作中，你通常扮演什么角色：',
        options: [
          { id: 'a', text: '领导者，主导方向', points: 5 },
          { id: 'b', text: '策划者，提供方案', points: 3 },
          { id: 'c', text: '协调者，促进沟通', points: 2 },
          { id: 'd', text: '执行者，完成任务', points: 1 }
        ]
      },
      {
        id: 4,
        text: '当你感到压力时，你会：',
        options: [
          { id: 'a', text: '通过运动释放压力', points: 5 },
          { id: 'b', text: '分析问题根源', points: 3 },
          { id: 'c', text: '与朋友倾诉', points: 2 },
          { id: 'd', text: '独自冥想或听音乐', points: 1 }
        ]
      },
      {
        id: 5,
        text: '你对未来的态度是：',
        options: [
          { id: 'a', text: '充满期待，积极规划', points: 5 },
          { id: 'b', text: '谨慎乐观，做好准备', points: 3 },
          { id: 'c', text: '随遇而安，顺其自然', points: 2 },
          { id: 'd', text: '有些担忧，保持警惕', points: 1 }
        ]
      }
    ]
  },
  {
    id: 'love',
    title: '星座爱情测试',
    description: '探索你的爱情观与星座匹配度',
    icon: '❤️',
    color: '#ff4757',
    questions: [
      {
        id: 1,
        text: '你理想的恋爱关系是：',
        options: [
          { id: 'a', text: '充满激情，轰轰烈烈', points: 5 },
          { id: 'b', text: '稳定踏实，细水长流', points: 3 },
          { id: 'c', text: '相互理解，精神共鸣', points: 2 },
          { id: 'd', text: '自由独立，保持空间', points: 1 }
        ]
      },
      {
        id: 2,
        text: '当你喜欢一个人时，你会：',
        options: [
          { id: 'a', text: '直接表白，大胆追求', points: 5 },
          { id: 'b', text: '观察了解，循序渐进', points: 3 },
          { id: 'c', text: '暗示对方，等待回应', points: 2 },
          { id: 'd', text: '默默关注，保持距离', points: 1 }
        ]
      },
      {
        id: 3,
        text: '你认为维持感情最重要的是：',
        options: [
          { id: 'a', text: '热情与浪漫', points: 5 },
          { id: 'b', text: '信任与忠诚', points: 3 },
          { id: 'c', text: '沟通与理解', points: 2 },
          { id: 'd', text: '包容与妥协', points: 1 }
        ]
      },
      {
        id: 4,
        text: '当发生矛盾时，你会：',
        options: [
          { id: 'a', text: '直接表达，解决问题', points: 5 },
          { id: 'b', text: '冷静思考，寻找原因', points: 3 },
          { id: 'c', text: '主动沟通，寻求和解', points: 2 },
          { id: 'd', text: '暂时冷静，避免冲突', points: 1 }
        ]
      },
      {
        id: 5,
        text: '你对婚姻的看法是：',
        options: [
          { id: 'a', text: '爱情的升华，非常期待', points: 5 },
          { id: 'b', text: '责任的开始，认真对待', points: 3 },
          { id: 'c', text: '相互陪伴，共同成长', points: 2 },
          { id: 'd', text: '顺其自然，不强求', points: 1 }
        ]
      }
    ]
  },
  {
    id: 'career',
    title: '星座职业测试',
    description: '发现最适合你的职业方向',
    icon: '💼',
    color: '#3742fa',
    questions: [
      {
        id: 1,
        text: '你希望工作环境是：',
        options: [
          { id: 'a', text: '充满挑战，不断创新', points: 5 },
          { id: 'b', text: '稳定有序，规律明确', points: 3 },
          { id: 'c', text: '与人互动，团队合作', points: 2 },
          { id: 'd', text: '独立安静，专注思考', points: 1 }
        ]
      },
      {
        id: 2,
        text: '你更看重工作的：',
        options: [
          { id: 'a', text: '成就感与挑战', points: 5 },
          { id: 'b', text: '稳定性与安全感', points: 3 },
          { id: 'c', text: '人际关系与合作', points: 2 },
          { id: 'd', text: '自由度与灵活性', points: 1 }
        ]
      },
      {
        id: 3,
        text: '你解决问题的方式是：',
        options: [
          { id: 'a', text: '快速决策，行动优先', points: 5 },
          { id: 'b', text: '分析研究，深思熟虑', points: 3 },
          { id: 'c', text: '集思广益，团队合作', points: 2 },
          { id: 'd', text: '创新思维，寻找新方法', points: 1 }
        ]
      },
      {
        id: 4,
        text: '你对职业发展的期望是：',
        options: [
          { id: 'a', text: '快速晋升，追求高位', points: 5 },
          { id: 'b', text: '稳步发展，积累经验', points: 3 },
          { id: 'c', text: '专业深耕，成为专家', points: 2 },
          { id: 'd', text: '平衡工作与生活', points: 1 }
        ]
      },
      {
        id: 5,
        text: '你更喜欢的工作内容是：',
        options: [
          { id: 'a', text: '领导管理，决策规划', points: 5 },
          { id: 'b', text: '技术研究，数据分析', points: 3 },
          { id: 'c', text: '客户服务，沟通协调', points: 2 },
          { id: 'd', text: '创意设计，艺术表达', points: 1 }
        ]
      }
    ]
  }
])

const testResults = ref<TestResult[]>([
  {
    testId: 'personality',
    testName: '星座性格测试',
    score: 18,
    result: '狮子座',
    interpretation: '你具有狮子座的特质，自信、热情、领导力强，喜欢成为焦点，有创造力和表现力。',
    date: new Date('2024-01-15')
  },
  {
    testId: 'love',
    testName: '星座爱情测试',
    score: 12,
    result: '天秤座',
    interpretation: '你的爱情观与天秤座相符，注重平衡与和谐，追求公平与正义，善于沟通与协调。',
    date: new Date('2024-01-10')
  }
])

const selectedTest = ref<Test | null>(null)
const currentQuestionIndex = ref(0)
const userAnswers = ref<Record<number, string>>({})
const showResult = ref(false)
const testScore = ref(0)
const testResult = ref('')
const testInterpretation = ref('')

const startTest = (test: Test) => {
  selectedTest.value = test
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  showResult.value = false
  testScore.value = 0
  testResult.value = ''
  testInterpretation.value = ''
}

const selectAnswer = (questionId: number, optionId: string) => {
  userAnswers.value[questionId] = optionId
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < (selectedTest.value?.questions.length || 0) - 1) {
    currentQuestionIndex.value++
  } else {
    calculateResult()
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const calculateResult = () => {
  if (!selectedTest.value) return

  let score = 0
  selectedTest.value.questions.forEach(question => {
    const selectedOptionId = userAnswers.value[question.id]
    if (selectedOptionId) {
      const option = question.options.find(opt => opt.id === selectedOptionId)
      if (option) {
        score += option.points
      }
    }
  })

  testScore.value = score

  // 根据测试类型和分数计算结果
  if (selectedTest.value.id === 'personality') {
    if (score >= 20) {
      testResult.value = '白羊座'
      testInterpretation.value = '你具有白羊座的特质，勇敢、直接、充满活力，喜欢挑战和冒险，有强烈的竞争意识和领导能力。'
    } else if (score >= 15) {
      testResult.value = '狮子座'
      testInterpretation.value = '你具有狮子座的特质，自信、热情、领导力强，喜欢成为焦点，有创造力和表现力。'
    } else if (score >= 10) {
      testResult.value = '天秤座'
      testInterpretation.value = '你具有天秤座的特质，注重平衡与和谐，追求公平与正义，善于沟通与协调。'
    } else {
      testResult.value = '双鱼座'
      testInterpretation.value = '你具有双鱼座的特质，敏感、直觉强、富有想象力，善于共情和理解他人，有艺术天赋。'
    }
  } else if (selectedTest.value.id === 'love') {
    if (score >= 20) {
      testResult.value = '天蝎座'
      testInterpretation.value = '你的爱情观与天蝎座相符，深情、执着、占有欲强，追求深度的情感连接和忠诚的关系。'
    } else if (score >= 15) {
      testResult.value = '金牛座'
      testInterpretation.value = '你的爱情观与金牛座相符，稳重、忠诚、注重实际，追求稳定和安全感，对感情认真负责。'
    } else if (score >= 10) {
      testResult.value = '天秤座'
      testInterpretation.value = '你的爱情观与天秤座相符，注重平衡与和谐，追求公平与正义，善于沟通与协调。'
    } else {
      testResult.value = '水瓶座'
      testInterpretation.value = '你的爱情观与水瓶座相符，独立、自由、创新，追求精神共鸣和个人空间，对感情保持开放态度。'
    }
  } else if (selectedTest.value.id === 'career') {
    if (score >= 20) {
      testResult.value = '白羊座'
      testInterpretation.value = '你适合具有挑战性和创新性的职业，如企业家、销售、运动员等，能够充分发挥你的领导能力和冒险精神。'
    } else if (score >= 15) {
      testResult.value = '处女座'
      testInterpretation.value = '你适合需要细心和专业技能的职业，如医生、工程师、会计师等，能够充分发挥你的分析能力和精益求精的态度。'
    } else if (score >= 10) {
      testResult.value = '双子座'
      testInterpretation.value = '你适合需要沟通和创意的职业，如记者、教师、设计师等，能够充分发挥你的表达能力和适应能力。'
    } else {
      testResult.value = '摩羯座'
      testInterpretation.value = '你适合需要稳重和责任感的职业，如管理者、律师、金融分析师等，能够充分发挥你的组织能力和毅力。'
    }
  }

  // 保存测试结果
  testResults.value.unshift({
    testId: selectedTest.value.id,
    testName: selectedTest.value.title,
    score,
    result: testResult.value,
    interpretation: testInterpretation.value,
    date: new Date()
  })

  showResult.value = true
}

const currentQuestion = computed(() => {
  if (!selectedTest.value || currentQuestionIndex.value >= selectedTest.value.questions.length) {
    return null
  }
  return selectedTest.value.questions[currentQuestionIndex.value]
})

const progress = computed(() => {
  if (!selectedTest.value) return 0
  return ((currentQuestionIndex.value + 1) / selectedTest.value.questions.length) * 100
})

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const resetTest = () => {
  selectedTest.value = null
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  showResult.value = false
  testScore.value = 0
  testResult.value = ''
  testInterpretation.value = ''
}
</script>

<template>
  <div class="test-center-page">
    <div class="hero-section">
      <span class="page-title animate-fade-in">星座测试中心</span>
      <span class="page-subtitle animate-slide-up">探索你的星座特质</span>
    </div>

    <div class="container">
      <!-- 测试列表 -->
      <div v-if="!selectedTest" class="tests-list">
        <div
          v-for="test in tests"
          :key="test.id"
          class="test-card animate-slide-up"
        >
          <div class="test-icon" :style="{ backgroundColor: test.color }">{{ test.icon }}</div>
          <div class="test-content">
            <h3 class="test-title">{{ test.title }}</h3>
            <p class="test-description">{{ test.description }}</p>
            <button
              class="start-test-btn"
              :style="{ backgroundColor: test.color }"
              @click="startTest(test)"
            >
              开始测试
            </button>
          </div>
        </div>

        <!-- 测试历史 -->
        <div class="test-history">
          <h3 class="section-title">测试历史</h3>
          <div v-if="testResults.length > 0" class="history-list">
            <div
              v-for="(result, index) in testResults"
              :key="index"
              class="history-item"
            >
              <div class="history-header">
                <span class="history-test-name">{{ result.testName }}</span>
                <span class="history-date">{{ formatDate(result.date) }}</span>
              </div>
              <div class="history-result">
                <span class="result-label">结果：</span>
                <span class="result-value">{{ result.result }}</span>
              </div>
              <p class="history-interpretation">{{ result.interpretation }}</p>
            </div>
          </div>
          <div v-else class="no-history">
            <span class="no-history-icon">📝</span>
            <span class="no-history-text">暂无测试历史</span>
          </div>
        </div>
      </div>

      <!-- 测试界面 -->
      <div v-else-if="!showResult" class="test-interface">
        <div class="test-header">
          <h2 class="test-title">{{ selectedTest.title }}</h2>
          <div class="test-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
            </div>
            <span class="progress-text">{{ currentQuestionIndex + 1 }} / {{ selectedTest.questions.length }}</span>
          </div>
        </div>

        <div v-if="currentQuestion" class="question-card">
          <h3 class="question-text">{{ currentQuestion.text }}</h3>
          <div class="options-list">
            <div
              v-for="option in currentQuestion.options"
              :key="option.id"
              class="option-item"
              :class="{ selected: userAnswers[currentQuestion.id] === option.id }"
              @click="selectAnswer(currentQuestion.id, option.id)"
            >
              <span class="option-text">{{ option.text }}</span>
            </div>
          </div>
        </div>

        <div class="test-navigation">
          <button
            class="nav-btn prev"
            :disabled="currentQuestionIndex === 0"
            @click="prevQuestion"
          >
            上一题
          </button>
          <button
            class="nav-btn next"
            :disabled="!userAnswers[currentQuestion?.id || 0]"
            @click="nextQuestion"
          >
            {{ currentQuestionIndex === (selectedTest.questions.length - 1) ? '提交' : '下一题' }}
          </button>
        </div>
      </div>

      <!-- 测试结果 -->
      <div v-else class="test-result">
        <div class="result-card">
          <div class="result-header">
            <h2 class="result-title">测试结果</h2>
            <span class="result-score">得分：{{ testScore }}</span>
          </div>
          <div class="result-content">
            <div class="result-constellation">
              <span class="constellation-icon">✨</span>
              <h3 class="constellation-name">{{ testResult }}</h3>
            </div>
            <p class="result-interpretation">{{ testInterpretation }}</p>
          </div>
          <div class="result-actions">
            <button class="action-btn restart" @click="resetTest">
              重新测试
            </button>
            <button class="action-btn back" @click="resetTest">
              返回测试列表
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-center-page {
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

.tests-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.test-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
  display: flex;
  gap: var(--space-lg);
  align-items: center;
}

.test-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.test-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--text-white);
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.test-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.test-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.test-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.start-test-btn {
  align-self: flex-start;
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-white);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.start-test-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.test-history {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.test-history:hover {
  box-shadow: var(--shadow-lg);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.history-item {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  transition: all var(--transition-normal);
  border-left: 4px solid var(--primary);
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--bg-primary);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.history-test-name {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.history-date {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.history-result {
  margin-bottom: var(--space-sm);
}

.result-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.result-value {
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--primary);
}

.history-interpretation {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.no-history {
  text-align: center;
  padding: var(--space-2xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.no-history-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-md);
}

.no-history-text {
  font-size: var(--text-base);
  color: var(--text-muted);
}

.test-interface {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.test-interface:hover {
  box-shadow: var(--shadow-lg);
}

.test-header {
  margin-bottom: var(--space-lg);
}

.test-progress {
  margin-top: var(--space-md);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-sm);
}

.progress-fill {
  height: 100%;
  background: var(--bg-gradient);
  transition: width var(--transition-normal);
  border-radius: var(--radius-full);
}

.progress-text {
  font-size: var(--text-sm);
  color: var(--text-muted);
  text-align: right;
}

.question-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.question-text {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  line-height: 1.5;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.option-item {
  padding: var(--space-md);
  background: var(--bg-primary);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.option-item:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.option-item.selected {
  border-color: var(--primary);
  background: var(--bg-gradient);
  color: var(--text-white);
}

.option-text {
  font-size: var(--text-base);
  line-height: 1.5;
}

.test-navigation {
  display: flex;
  justify-content: space-between;
  gap: var(--space-md);
}

.nav-btn {
  flex: 1;
  padding: var(--space-md);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.nav-btn.prev {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.nav-btn.next {
  background: var(--bg-gradient);
  color: var(--text-white);
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-result {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.test-result:hover {
  box-shadow: var(--shadow-lg);
}

.result-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  align-items: center;
  text-align: center;
}

.result-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--space-md);
}

.result-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.result-score {
  padding: var(--space-xs) var(--space-md);
  background: var(--bg-gradient);
  border-radius: var(--radius-full);
  color: var(--text-white);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 600px;
}

.result-constellation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.constellation-icon {
  font-size: 48px;
}

.constellation-name {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--primary);
  margin: 0;
}

.result-interpretation {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.result-actions {
  display: flex;
  gap: var(--space-md);
  width: 100%;
  max-width: 400px;
}

.action-btn {
  flex: 1;
  padding: var(--space-md);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.action-btn.restart {
  background: var(--bg-gradient);
  color: var(--text-white);
}

.action-btn.back {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
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

  .test-card {
    flex-direction: column;
    text-align: center;
  }

  .test-icon {
    align-self: center;
  }

  .start-test-btn {
    align-self: center;
  }

  .result-header {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }

  .result-actions {
    flex-direction: column;
  }
}
</style>

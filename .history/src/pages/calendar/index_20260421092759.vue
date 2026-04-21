<script setup lang="ts">
import { ref, computed } from 'vue'

interface CalendarEvent {
  id: number
  title: string
  date: Date
  type: 'zodiac' | 'planet' | 'festival'
  description: string
  icon: string
  color: string
}

const currentDate = ref(new Date())

const events = ref<CalendarEvent[]>([
  {
    id: 1,
    title: '白羊座新月',
    date: new Date('2024-03-21'),
    type: 'zodiac',
    description: '白羊座新月带来新的开始和机会，适合制定新计划和设定目标。',
    icon: '♈',
    color: '#ff4757'
  },
  {
    id: 2,
    title: '金牛座满月',
    date: new Date('2024-04-24'),
    type: 'zodiac',
    description: '金牛座满月带来情感的高潮和结果，适合审视自己的价值观和财务状况。',
    icon: '♉',
    color: '#2ed573'
  },
  {
    id: 3,
    title: '双子座水星逆行开始',
    date: new Date('2024-05-20'),
    type: 'planet',
    description: '水星在双子座逆行，注意沟通和交通问题，备份重要数据。',
    icon: '☿',
    color: '#3742fa'
  },
  {
    id: 4,
    title: '巨蟹座夏至',
    date: new Date('2024-06-21'),
    type: 'festival',
    description: '夏至是一年中白天最长的一天，象征着光明和活力。',
    icon: '♋',
    color: '#ffa502'
  },
  {
    id: 5,
    title: '狮子座太阳进入',
    date: new Date('2024-07-23'),
    type: 'zodiac',
    description: '太阳进入狮子座，带来自信和创造力，适合展示自我和追求梦想。',
    icon: '♌',
    color: '#ff6b81'
  },
  {
    id: 6,
    title: '处女座金星进入',
    date: new Date('2024-08-15'),
    type: 'planet',
    description: '金星进入处女座，注重细节和品质，适合整理和优化生活。',
    icon: '♀',
    color: '#74b9ff'
  },
  {
    id: 7,
    title: '天秤座秋分',
    date: new Date('2024-09-22'),
    type: 'festival',
    description: '秋分是昼夜平分的日子，象征着平衡和和谐。',
    icon: '♎',
    color: '#a29bfe'
  },
  {
    id: 8,
    title: '天蝎座火星进入',
    date: new Date('2024-10-10'),
    type: 'planet',
    description: '火星进入天蝎座，增强激情和决心，适合深入探索和转型。',
    icon: '♂',
    color: '#fd79a8'
  },
  {
    id: 9,
    title: '射手座冬至',
    date: new Date('2024-12-21'),
    type: 'festival',
    description: '冬至是一年中白天最短的一天，象征着新的开始和希望。',
    icon: '♐',
    color: '#00b894'
  },
  {
    id: 10,
    title: '摩羯座新年',
    date: new Date('2025-01-01'),
    type: 'festival',
    description: '新年到来，摩羯座的能量带来责任感和目标设定。',
    icon: '♑',
    color: '#6c5ce7'
  }
])

const monthNames = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
]

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonth = computed(() => currentDate.value.getMonth())
const currentYear = computed(() => currentDate.value.getFullYear())

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

const calendarDays = computed(() => {
  const days = []
  const totalDays = daysInMonth.value
  const startDay = firstDayOfMonth.value

  // 添加空白日期
  for (let i = 0; i < startDay; i++) {
    days.push(null)
  }

  // 添加当月日期
  for (let i = 1; i <= totalDays; i++) {
    days.push(i)
  }

  return days
})

const eventsForDate = (date: number) => {
  if (date === null) return []
  return events.value.filter(event => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === date &&
      eventDate.getMonth() === currentMonth.value &&
      eventDate.getFullYear() === currentYear.value
    )
  })
}

const isToday = (date: number) => {
  if (date === null) return false
  const today = new Date()
  return (
    date === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  )
}

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
}

const getEventColor = (type: string) => {
  switch (type) {
    case 'zodiac': return '#ff6b81'
    case 'planet': return '#74b9ff'
    case 'festival': return '#2ed573'
    default: return '#747d8c'
  }
}
</script>

<template>
  <div class="calendar-page">
    <div class="hero-section">
      <span class="page-title animate-fade-in">星座日历</span>
      <span class="page-subtitle animate-slide-up">探索星座事件和行星运动</span>
    </div>

    <div class="container">
      <!-- 日历控件 -->
      <div class="calendar-card">
        <div class="calendar-header">
          <button class="nav-btn" @click="prevMonth">‹</button>
          <h2 class="calendar-title">{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
          <button class="nav-btn" @click="nextMonth">›</button>
        </div>

        <!-- 星期标题 -->
        <div class="weekdays">
          <div v-for="(day, index) in weekDays" :key="index" class="weekday">
            {{ day }}
          </div>
        </div>

        <!-- 日历网格 -->
        <div class="calendar-grid">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="calendar-day"
            :class="{ 'empty': day === null, 'today': isToday(day) }"
          >
            <div v-if="day !== null" class="day-content">
              <span class="day-number">{{ day }}</span>
              <div class="day-events">
                <div
                  v-for="event in eventsForDate(day)"
                  :key="event.id"
                  class="event-dot"
                  :style="{ backgroundColor: event.color }"
                  :title="event.title"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="calendar-footer">
          <button class="today-btn" @click="goToToday">今天</button>
        </div>
      </div>

      <!-- 事件列表 -->
      <div class="events-section">
        <h3 class="section-title">本月事件</h3>
        <div class="events-list">
          <div
            v-for="event in events"
            :key="event.id"
            class="event-card animate-slide-up"
            v-if="new Date(event.date).getMonth() === currentMonth && new Date(event.date).getFullYear() === currentYear"
          >
            <div class="event-date">
              <span class="event-day">{{ new Date(event.date).getDate() }}</span>
              <span class="event-month">{{ monthNames[new Date(event.date).getMonth()] }}</span>
            </div>
            <div class="event-content">
              <div class="event-header">
                <span class="event-icon">{{ event.icon }}</span>
                <h4 class="event-title">{{ event.title }}</h4>
                <span
                  class="event-type"
                  :style="{ backgroundColor: event.color }"
                >
                  {{ event.type === 'zodiac' ? '星座' : event.type === 'planet' ? '行星' : '节日' }}
                </span>
              </div>
              <p class="event-description">{{ event.description }}</p>
            </div>
          </div>

          <!-- 无事件提示 -->
          <div v-if="events.filter(e => new Date(e.date).getMonth() === currentMonth && new Date(e.date).getFullYear() === currentYear).length === 0" class="no-events">
            <span class="no-events-icon">📅</span>
            <span class="no-events-text">本月暂无星座事件</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-page {
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.calendar-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.calendar-card:hover {
  box-shadow: var(--shadow-lg);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 18px;
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

.nav-btn:hover {
  background: var(--bg-gradient);
  color: var(--text-white);
  border-color: transparent;
  transform: scale(1.1);
}

.calendar-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-md);
}

.weekday {
  text-align: center;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-muted);
  padding: var(--space-sm);
  border-radius: var(--radius-md);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  position: relative;
}

.calendar-day.empty {
  background: transparent;
}

.calendar-day:not(.empty) {
  background: var(--bg-secondary);
  cursor: pointer;
}

.calendar-day:not(.empty):hover {
  background: var(--bg-primary);
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.calendar-day.today {
  background: var(--bg-gradient) !important;
  color: var(--text-white);
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--space-xs);
}

.day-number {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  margin-bottom: 4px;
}

.day-events {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}

.event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.calendar-footer {
  display: flex;
  justify-content: center;
}

.today-btn {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-gradient);
  border: none;
  border-radius: var(--radius-full);
  color: var(--text-white);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.today-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.events-section {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-lg);
  transition: all var(--transition-normal);
}

.events-section:hover {
  box-shadow: var(--shadow-lg);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-height: 500px;
  overflow-y: auto;
}

.event-card {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  border-left: 4px solid var(--primary);
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  background: var(--bg-primary);
}

.event-date {
  flex: 0 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-gradient);
  border-radius: var(--radius-lg);
  color: var(--text-white);
  padding: var(--space-sm);
  box-shadow: var(--shadow-md);
}

.event-day {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.event-month {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.event-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.event-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.event-title {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  flex: 1;
  margin: 0;
}

.event-type {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-white);
  flex-shrink: 0;
}

.event-description {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.no-events {
  text-align: center;
  padding: var(--space-2xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin-top: var(--space-md);
}

.no-events-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--space-md);
}

.no-events-text {
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
  .container {
    grid-template-columns: 1fr;
  }

  .hero-section {
    padding: var(--space-xl) var(--space-md);
  }

  .calendar-card {
    padding: var(--space-md);
  }

  .events-section {
    padding: var(--space-md);
  }

  .event-card {
    flex-direction: column;
  }

  .event-date {
    flex-direction: row;
    justify-content: space-around;
    flex: none;
  }

  .event-day {
    font-size: var(--text-lg);
  }
}
</style>

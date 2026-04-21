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
const selectedDate = ref<Date | null>(null)
const selectedEvent = ref<CalendarEvent | null>(null)
const showEventModal = ref(false)
const showDateEvents = ref(false)
const selectedEventType = ref<string>('all')
const searchQuery = ref('')
const showAddEventModal = ref(false)
const newEvent = ref<Omit<CalendarEvent, 'id'>>({
  title: '',
  date: new Date(),
  type: 'zodiac',
  description: '',
  icon: '♈',
  color: '#ff6b81'
})

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

const isSelectedDate = (date: number) => {
  if (date === null || !selectedDate.value) return false
  return (
    date === selectedDate.value.getDate() &&
    currentMonth.value === selectedDate.value.getMonth() &&
    currentYear.value === selectedDate.value.getFullYear()
  )
}

const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1)
}

const prevYear = () => {
  currentDate.value = new Date(currentYear.value - 1, currentMonth.value, 1)
}

const nextYear = () => {
  currentDate.value = new Date(currentYear.value + 1, currentMonth.value, 1)
}

const goToToday = () => {
  currentDate.value = new Date()
  selectedDate.value = null
}

const selectDate = (date: number) => {
  if (date === null) return
  selectedDate.value = new Date(currentYear.value, currentMonth.value, date)
  showDateEvents.value = true
}

const selectEvent = (event: CalendarEvent) => {
  selectedEvent.value = event
  showEventModal.value = true
}

const closeEventModal = () => {
  showEventModal.value = false
  selectedEvent.value = null
}

const closeDateEvents = () => {
  showDateEvents.value = false
  selectedDate.value = null
}

const getEventColor = (type: string) => {
  switch (type) {
    case 'zodiac': return '#ff6b81'
    case 'planet': return '#74b9ff'
    case 'festival': return '#2ed573'
    default: return '#747d8c'
  }
}

const filteredEvents = computed(() => {
  let result = events.value.filter(event => {
    if (selectedEventType.value !== 'all' && event.type !== selectedEventType.value) {
      return false
    }
    if (searchQuery.value) {
      return (
        event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }
    return true
  })

  // 按日期排序
  return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const currentMonthEvents = computed(() => {
  return filteredEvents.value.filter(event => {
    if (!event || !event.date) return false
    const eventDate = new Date(event.date)
    return (
      eventDate.getMonth() === currentMonth.value &&
      eventDate.getFullYear() === currentYear.value
    )
  })
})

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return []
  return filteredEvents.value.filter(event => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === selectedDate.value.getDate() &&
      eventDate.getMonth() === selectedDate.value.getMonth() &&
      eventDate.getFullYear() === selectedDate.value.getFullYear()
    )
  })
})

const hasEventsThisMonth = computed(() => {
  return currentMonthEvents.value.length > 0
})

const addEvent = () => {
  const newId = Math.max(...events.value.map(e => e.id)) + 1
  events.value.push({
    id: newId,
    ...newEvent.value
  })
  showAddEventModal.value = false
  // 重置新事件表单
  newEvent.value = {
    title: '',
    date: new Date(),
    type: 'zodiac',
    description: '',
    icon: '♈',
    color: '#ff6b81'
  }
}

const getEventTypeName = (type: string) => {
  switch (type) {
    case 'zodiac': return '星座'
    case 'planet': return '行星'
    case 'festival': return '节日'
    default: return '其他'
  }
}

const iconOptions = [
  { value: '♈', label: '白羊座' },
  { value: '♉', label: '金牛座' },
  { value: '♊', label: '双子座' },
  { value: '♋', label: '巨蟹座' },
  { value: '♌', label: '狮子座' },
  { value: '♍', label: '处女座' },
  { value: '♎', label: '天秤座' },
  { value: '♏', label: '天蝎座' },
  { value: '♐', label: '射手座' },
  { value: '♑', label: '摩羯座' },
  { value: '♒', label: '水瓶座' },
  { value: '♓', label: '双鱼座' },
  { value: '☉', label: '太阳' },
  { value: '☽', label: '月亮' },
  { value: '☿', label: '水星' },
  { value: '♀', label: '金星' },
  { value: '♂', label: '火星' },
  { value: '♃', label: '木星' },
  { value: '♄', label: '土星' },
  { value: '♅', label: '天王星' },
  { value: '♆', label: '海王星' },
  { value: '♇', label: '冥王星' },
  { value: '✨', label: '星星' },
  { value: '🌙', label: '月亮' },
  { value: '☀️', label: '太阳' }
];
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
          <button class="nav-btn" @click="prevYear">‹‹</button>
          <button class="nav-btn" @click="prevMonth">‹</button>
          <h2 class="calendar-title">{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
          <button class="nav-btn" @click="nextMonth">›</button>
          <button class="nav-btn" @click="nextYear">››</button>
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
            :class="{ 'empty': day === null, 'today': isToday(day), 'selected': isSelectedDate(day) }"
            @click="selectDate(day)"
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
          <button class="add-event-btn" @click="showAddEventModal = true">+ 添加事件</button>
        </div>
      </div>

      <!-- 事件筛选和搜索 -->
      <div class="events-section">
        <div class="events-header">
          <h3 class="section-title">本月事件</h3>
          <div class="events-controls">
            <div class="event-filter">
              <select v-model="selectedEventType" class="filter-select">
                <option value="all">全部类型</option>
                <option value="zodiac">星座</option>
                <option value="planet">行星</option>
                <option value="festival">节日</option>
              </select>
            </div>
            <div class="event-search">
              <input
                v-model="searchQuery"
                type="text"
                class="search-input"
                placeholder="搜索事件..."
              />
            </div>
          </div>
        </div>

        <div class="events-list">
          <div
            v-for="event in currentMonthEvents"
            :key="event.id"
            class="event-card animate-slide-up"
            @click="selectEvent(event)"
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
                  {{ getEventTypeName(event.type) }}
                </span>
              </div>
              <p class="event-description">{{ event.description }}</p>
            </div>
          </div>

          <!-- 无事件提示 -->
          <div v-if="!hasEventsThisMonth" class="no-events">
            <span class="no-events-icon">📅</span>
            <span class="no-events-text">本月暂无星座事件</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 事件详情弹窗 -->
    <div v-if="showEventModal && selectedEvent" class="modal-overlay" @click="closeEventModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedEvent.title }}</h3>
          <button class="modal-close" @click="closeEventModal">×</button>
        </div>
        <div class="modal-body">
          <div class="event-detail">
            <div class="event-detail-date">
              <span class="event-detail-icon">{{ selectedEvent.icon }}</span>
              <span class="event-detail-date-text">{{ new Date(selectedEvent.date).getFullYear() }}年{{ new Date(selectedEvent.date).getMonth() + 1 }}月{{ new Date(selectedEvent.date).getDate() }}日</span>
              <span class="event-detail-type" :style="{ backgroundColor: selectedEvent.color }">{{ getEventTypeName(selectedEvent.type) }}</span>
            </div>
            <p class="event-detail-description">{{ selectedEvent.description }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeEventModal">关闭</button>
        </div>
      </div>
    </div>

    <!-- 日期事件弹窗 -->
    <div v-if="showDateEvents && selectedDate" class="modal-overlay" @click="closeDateEvents">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedDate.getFullYear() }}年{{ selectedDate.getMonth() + 1 }}月{{ selectedDate.getDate() }}日的事件</h3>
          <button class="modal-close" @click="closeDateEvents">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedDateEvents.length > 0" class="date-events-list">
            <div
              v-for="event in selectedDateEvents"
              :key="event.id"
              class="date-event-card"
              @click="selectEvent(event); closeDateEvents()"
            >
              <span class="date-event-icon">{{ event.icon }}</span>
              <div class="date-event-info">
                <h4 class="date-event-title">{{ event.title }}</h4>
                <span class="date-event-type" :style="{ backgroundColor: event.color }">{{ getEventTypeName(event.type) }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-date-events">
            <span class="no-events-icon">📅</span>
            <span class="no-events-text">该日期暂无事件</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="closeDateEvents">关闭</button>
          <button class="modal-btn primary" @click="closeDateEvents(); showAddEventModal = true; newEvent.date = new Date(selectedDate)">添加事件</button>
        </div>
      </div>
    </div>

    <!-- 添加事件弹窗 -->
    <div v-if="showAddEventModal" class="modal-overlay" @click="showAddEventModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">添加新事件</h3>
          <button class="modal-close" @click="showAddEventModal = false">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addEvent">
            <div class="form-group">
              <label class="form-label">事件标题</label>
              <input
                v-model="newEvent.title"
                type="text"
                class="form-input"
                placeholder="输入事件标题"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">日期</label>
              <input
                v-model="newEvent.date"
                type="date"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">类型</label>
              <select v-model="newEvent.type" class="form-select" required>
                <option value="zodiac">星座</option>
                <option value="planet">行星</option>
                <option value="festival">节日</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">图标</label>
              <div class="icon-selector">
                <div
                  v-for="icon in iconOptions"
                  :key="icon.value"
                  class="icon-option"
                  :class="{ selected: newEvent.icon === icon.value }"
                  @click="newEvent.icon = icon.value"
                  :title="icon.label"
                >
                  {{ icon.value }}
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">描述</label>
              <textarea
                v-model="newEvent.description"
                class="form-textarea"
                placeholder="输入事件描述"
                rows="4"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">颜色</label>
              <input
                v-model="newEvent.color"
                type="color"
                class="form-color"
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="modal-btn" @click="showAddEventModal = false">取消</button>
          <button class="modal-btn primary" @click="addEvent">保存</button>
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
  gap: var(--space-sm);
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
  flex: 1;
  text-align: center;
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

.calendar-day.selected {
  background: var(--primary) !important;
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
  justify-content: space-between;
  align-items: center;
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

.add-event-btn {
  padding: var(--space-sm) var(--space-lg);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.add-event-btn:hover {
  background: var(--bg-primary);
  border-color: var(--primary);
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

.events-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

.events-controls {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.event-filter {
  flex: 1;
  min-width: 150px;
}

.filter-select {
  width: 100%;
  padding: var(--space-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(121, 40, 202, 0.2);
}

.event-search {
  flex: 2;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: var(--space-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: all var(--transition-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(121, 40, 202, 0.2);
}

.search-input::placeholder {
  color: var(--text-muted);
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
  cursor: pointer;
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

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--border-light);
}

.modal-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-normal);
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-top: 1px solid var(--border-light);
}

.modal-btn {
  padding: var(--space-sm) var(--space-lg);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.modal-btn:hover {
  background: var(--bg-primary);
  border-color: var(--primary);
  transform: translateY(-1px);
}

.modal-btn.primary {
  background: var(--bg-gradient);
  color: var(--text-white);
  border-color: transparent;
  box-shadow: var(--shadow-md);
}

.modal-btn.primary:hover {
  box-shadow: var(--shadow-lg);
}

/* 事件详情样式 */
.event-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.event-detail-date {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.event-detail-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.event-detail-date-text {
  flex: 1;
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--text-primary);
}

.event-detail-type {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-white);
  flex-shrink: 0;
}

.event-detail-description {
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* 日期事件列表样式 */
.date-events-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.date-event-card {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.date-event-card:hover {
  background: var(--bg-primary);
  box-shadow: var(--shadow-md);
}

.date-event-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.date-event-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

.date-event-title {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.date-event-type {
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--text-white);
  flex-shrink: 0;
}

.no-date-events {
  text-align: center;
  padding: var(--space-2xl);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

/* 表单样式 */
.form-group {
  margin-bottom: var(--space-lg);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(121, 40, 202, 0.2);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-color {
  width: 100%;
  height: 40px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  background: transparent;
}

/* 图标选择器 */
.icon-selector {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-sm);
  max-height: 200px;
  overflow-y: auto;
  padding: var(--space-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.icon-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-size: 20px;
  border: 1px solid var(--border-light);
}

.icon-option:hover {
  background: var(--bg-secondary);
  border-color: var(--primary);
  transform: scale(1.1);
}

.icon-option.selected {
  background: var(--bg-gradient);
  color: var(--text-white);
  border-color: transparent;
  box-shadow: var(--shadow-md);
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

  .events-controls {
    flex-direction: column;
  }

  .event-filter,
  .event-search {
    width: 100%;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .icon-selector {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useZodiac } from '@/composables/useZodiac'
import { useAi } from '@/composables/useDoubao'
import { marked } from 'marked'

const { selectedZodiac, getZodiacInfo } = useZodiac()
const { chatWithZodiacContext, isLoading: isApiLoading, error: apiError } = useAi()

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const loadMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem('ai_messages')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }
  } catch (error) {
    console.error('Failed to load messages:', error)
  }
  return [
    {
      id: 1,
      role: 'assistant',
      content: `你好！我是你的专属星座AI助手。作为${selectedZodiac.value}的守护者，我可以为你解答关于星座、运势、性格、爱情等方面的疑问。有什么想了解的吗？`,
      timestamp: new Date()
    }
  ]
}

const saveMessages = (messages: Message[]) => {
  try {
    const recentMessages = messages.slice(-10)
    localStorage.setItem('ai_messages', JSON.stringify(recentMessages))
  } catch (error) {
    console.error('Failed to save messages:', error)
  }
}

const messages = ref<Message[]>(loadMessages())
const inputText = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const showQuickQuestions = ref(true)

const currentZodiac = computed(() => getZodiacInfo(selectedZodiac.value))

const zodiacContext = computed(() => {
  const info = currentZodiac.value
  return `星座知识背景：${selectedZodiac.value}（${info?.dateRange}），${info?.element}象星座，守护星是${info?.planet}，性格特点是${info?.qualities}。`
})

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const getSimulatedResponse = (zodiac: string, info: any): string => {
  const responses = [
    `作为${zodiac}的你，今天的运势相当不错！建议你保持积极的心态，相信自己的直觉。`,
    `关于这个问题，从星座角度来看，你的守护星会给你带来一些启示。建议你相信自己内心的声音。`,
    `这是一个很有深度的问题呢！${zodiac}的你天生具有独特的洞察力，相信你已经有答案了。`,
    `根据星座学的分析，你的这个问题与你的性格特质有关。作为${info?.element}象星座的一员，你的思维方式和常人有些不同哦。`,
    `哇，这个问题问得很好！让我从星座的角度为你分析一下...其实最重要的是跟随你的心。`
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage: Message = {
    id: Date.now(),
    role: 'user',
    content: inputText.value.trim(),
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  inputText.value = ''
  isLoading.value = true
  scrollToBottom()

  const info = currentZodiac.value
  const apiKeyConfigured = !!import.meta.env.VITE_AI_API_KEY

  try {
    let responseText: string

    if (apiKeyConfigured) {
      responseText = await chatWithZodiacContext(userMessage.content, zodiacContext.value)
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000))
      responseText = getSimulatedResponse(selectedZodiac.value, info)
    }

    const aiMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    }

    messages.value.push(aiMessage)
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '抱歉，AI暂时无法回应，请稍后再试。'
    const aiMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: `${errorMsg}（已切换到模拟模式）`,
      timestamp: new Date()
    }
    messages.value.push(aiMessage)
  } finally {
    isLoading.value = false
    saveMessages(messages.value)
    scrollToBottom()
  }
}

const quickQuestions = [
  `今天的${selectedZodiac.value}运势如何？`,
  `${selectedZodiac.value}的爱情特点是什么？`,
  `${selectedZodiac.value}最适合什么职业？`,
  `${selectedZodiac.value}与哪些星座最配？`
]

const selectQuickQuestion = (question: string) => {
  inputText.value = question
  sendMessage()
}

const toggleQuickQuestions = () => {
  showQuickQuestions.value = !showQuickQuestions.value
}

const parseMarkdown = (content: string): string => {
  return marked(content)
}

onMounted(() => {
  scrollToBottom()
})

watch(messages, () => {
  saveMessages(messages.value)
}, { deep: true })
</script>

<template>
  <div class="ai-page">
    <div class="hero-section">
      <span class="page-title animate-fade-in">AI 问答</span>
      <span class="page-subtitle animate-slide-up">基于星座的智能问答助手</span>
    </div>

    <div class="container">
      <div class="ai-card">
        <div ref="messagesContainer" class="messages-container">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="message.role"
          >
            <div v-if="message.role === 'assistant'" class="message-avatar">
              <span>🌟</span>
            </div>
            <div class="message-content">
              <div class="message-bubble" v-html="parseMarkdown(message.content)">
              </div>
              <span class="message-time">
                {{ message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) }}
              </span>
            </div>
          </div>

          <div v-if="isLoading" class="message assistant">
            <div class="message-avatar">
              <span>🌟</span>
            </div>
            <div class="message-content">
              <div class="message-bubble loading">
                <span class="loading-dots"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="quick-questions">
          <div class="quick-header" @click="toggleQuickQuestions">
            <span class="quick-label">快捷问题</span>
            <span class="quick-toggle">{{ showQuickQuestions ? '▼' : '▶' }}</span>
          </div>
          <div v-if="showQuickQuestions" class="quick-list">
            <button
              v-for="(question, index) in quickQuestions"
              :key="index"
              class="quick-item"
              @click="selectQuickQuestion(question)"
            >
              {{ question }}
            </button>
          </div>
        </div>

        <div class="input-section fixed">
          <input
            v-model="inputText"
            type="text"
            class="input-field"
            placeholder="输入你的问题..."
            @keyup.enter="sendMessage"
          />
          <button
            class="send-btn"
            :disabled="!inputText.trim() || isLoading"
            @click="sendMessage"
          >
            <span class="send-icon">➤</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-page {
  height: 100vh;
  background: var(--bg-secondary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

.ai-card {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 280px);
  min-height: 500px;
  position: relative;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.message {
  display: flex;
  gap: var(--space-sm);
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  background: var(--bg-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 16px;
}

.message.user .message-avatar {
  background: var(--bg-secondary);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  line-height: 1.5;
  word-break: break-word;
}

.message.assistant .message-bubble {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
}

.message.user .message-bubble {
  background: var(--bg-gradient);
  color: var(--text-white);
  border-bottom-right-radius: 4px;
}

.message-bubble.loading {
  display: flex;
  align-items: center;
  gap: 4px;
}

.loading-dots {
  display: flex;
  gap: 4px;
}

.loading-dots::before,
.loading-dots::after {
  content: '•';
  font-size: 20px;
  animation: bounce 1s infinite;
}

.loading-dots::after {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.message-time {
  font-size: 10px;
  color: var(--text-muted);
  padding: 0 4px;
}

.quick-questions {
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border-light);
  background: var(--bg-secondary);
  transition: all var(--transition-normal);
}

.quick-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: var(--space-sm) 0;
  transition: all var(--transition-normal);
}

.quick-header:hover {
  color: var(--primary);
}

.quick-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-weight: var(--font-medium);
}

.quick-toggle {
  font-size: var(--text-sm);
  transition: transform var(--transition-normal);
}

.quick-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-item {
  padding: var(--space-xs) var(--space-md);
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.quick-item:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
}

.input-section {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-lg);
  border-top: 1px solid var(--border-light);
  background: var(--bg-primary);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  bottom: 0;
  z-index: 10;
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  font-size: var(--text-base);
  transition: all var(--transition-normal);
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.send-btn {
  width: 48px;
  height: 48px;
  background: var(--bg-gradient);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-icon {
  font-size: 18px;
  color: var(--text-white);
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
    transform: translateY(10px);
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

  .ai-card {
    height: calc(100vh - 240px);
    min-height: 400px;
  }

  .message {
    max-width: 90%;
  }

  .quick-questions {
    padding: var(--space-sm) var(--space-md);
  }

  .input-section {
    padding: var(--space-md);
  }
}
</style>

import { ref } from 'vue'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface UseAiOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

const defaultOptions: UseAiOptions = {
  model: 'glm-4.5-Flash',
  temperature: 0.7,
  maxTokens: 2048
}

export function useAi(options: UseAiOptions = {}) {
  const config = { ...defaultOptions, ...options }
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const apiBaseUrl = import.meta.env.VITE_AI_API_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4'
  const apiKey = import.meta.env.VITE_AI_API_KEY || ''

  const chat = async (messages: ChatMessage[]): Promise<string> => {
    if (!apiKey) {
      throw new Error('API密钥未配置，请设置 VITE_AI_API_KEY 环境变量')
    }

    isLoading.value = true
    error.value = null

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }

      const response = await fetch(`${apiBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          model: config.model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          stream: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `请求失败: ${response.status}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || ''
    } catch (err) {
      const message = err instanceof Error ? err.message : 'API调用失败'
      error.value = message
      throw new Error(message)
    } finally {
      isLoading.value = false
    }
  }

  const chatWithZodiacContext = async (userMessage: string, zodiacContext: string): Promise<string> => {
    const systemMessage: ChatMessage = {
      role: 'system',
      content: `你是一个专业的星座分析师。你的名字是"星座AI助手"，你的职责是根据用户的星座知识提供准确、有帮助的回答。

星座背景信息：
${zodiacContext}

请以专业、友好、热情的态度回答用户的问题。结合星座知识给出个性化的建议和分析。语言要亲切自然，像朋友聊天一样。`
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage
    }

    return chat([systemMessage, userMsg])
  }

  return {
    isLoading,
    error,
    chat,
    chatWithZodiacContext
  }
}

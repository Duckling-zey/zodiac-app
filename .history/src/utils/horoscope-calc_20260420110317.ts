import type { DailyHoroscope, ZodiacSign } from '@/types/zodiac'

function randomScore(base: number, variance: number = 15): number {
  const score = base + Math.floor(Math.random() * variance) - Math.floor(variance / 2)
  return Math.max(1, Math.min(100, score))
}

function getElementModifier(element: string): number {
  const modifiers: Record<string, number> = {
    '火': 5,
    '土': 0,
    '风': 2,
    '水': -2
  }
  return modifiers[element] || 0
}

export function calculateDailyHoroscope(zodiac: ZodiacSign, date: Date): DailyHoroscope {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const dayHash = dayOfYear + zodiac.charCodeAt(0) * 31 + zodiac.charCodeAt(1) * 17

  const baseOverall = 60 + (dayHash % 25)
  const baseLove = 55 + ((dayHash * 3) % 30)
  const baseCareer = 50 + ((dayHash * 7) % 35)
  const baseFortune = 55 + ((dayHash * 11) % 30)

  const overall = randomScore(baseOverall)
  const love = randomScore(baseLove)
  const career = randomScore(baseCareer)
  const fortune = randomScore(baseFortune)

  const tips = [
    '今天适合主动出击，把握机会。',
    '人际关系需要多加维护。',
    '工作上可能会有意外收获。',
    '财务方面需要谨慎处理。',
    '保持积极的心态会给你带来好运。',
    '今天适合学习新知识。',
    '家庭关系需要更多关注。',
    '健康方面需要多加注意。',
    '创意和灵感会在今天涌现。',
    '适合处理之前遗留的问题。'
  ]

  const tipIndex = dayHash % tips.length

  return {
    date: date.toISOString().split('T')[0],
    zodiac,
    overall,
    love,
    career,
    fortune,
    tip: tips[tipIndex]
  }
}

export function getHoroscopeDescription(score: number): string {
  if (score >= 90) return '极佳'
  if (score >= 75) return '很好'
  if (score >= 60) return '良好'
  if (score >= 40) return '一般'
  return '欠佳'
}

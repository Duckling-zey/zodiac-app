export type ZodiacSign =
  | '白羊座'
  | '金牛座'
  | '双子座'
  | '巨蟹座'
  | '狮子座'
  | '处女座'
  | '天秤座'
  | '天蝎座'
  | '射手座'
  | '摩羯座'
  | '水瓶座'
  | '双鱼座'

export interface ZodiacInfo {
  name: ZodiacSign
  dateRange: string
  element: '火' | '土' | '风' | '水'
  planet: string
  symbol: string
  qualities: '基本' | '固定' | '变动'
}

export interface DailyHoroscope {
  date: string
  zodiac: ZodiacSign
  overall: number
  love: number
  career: number
  fortune: number
  health: number
  relationship: number
  study: number
  tip: string
}

export interface MatchResult {
  zodiac1: ZodiacSign
  zodiac2: ZodiacSign
  score: number
  analysis: string
  tips: string[]
}

export interface PersonalityAnalysis {
  zodiac: ZodiacSign
  strengths: string[]
  weaknesses: string[]
  loveStyle: string
  careerPaths: string[]
}

export interface HoroscopeChart {
  sun: { sign: ZodiacSign; degree: number }
  moon: { sign: ZodiacSign; degree: number }
  rising: { sign: ZodiacSign; degree: number }
  mercury: { sign: ZodiacSign; degree: number }
  venus: { sign: ZodiacSign; degree: number }
  mars: { sign: ZodiacSign; degree: number }
}

import { ref } from 'vue'
import { ZODIAC_LIST, getZodiacInfo, getZodiacByDate, MATCH_MATRIX, ELEMENT_COLORS } from '@/utils/zodiac-data'
import type { ZodiacSign, ZodiacInfo, MatchResult, PersonalityAnalysis } from '@/types/zodiac'

const selectedZodiac = ref<ZodiacSign>('白羊座')
const secondZodiac = ref<ZodiacSign>('天秤座')

export function useZodiac() {
  const setSelectedZodiac = (sign: ZodiacSign) => {
    selectedZodiac.value = sign
  }

  const setSecondZodiac = (sign: ZodiacSign) => {
    secondZodiac.value = sign
  }

  const getMatchResult = (zodiac1: ZodiacSign, zodiac2: ZodiacSign): MatchResult => {
    const score = MATCH_MATRIX[zodiac1]?.[zodiac2] || 70

    const elements = {
      '火': ['白羊座', '狮子座', '射手座'],
      '土': ['金牛座', '处女座', '摩羯座'],
      '风': ['双子座', '天秤座', '水瓶座'],
      '水': ['巨蟹座', '天蝎座', '双鱼座']
    }

    const info1 = getZodiacInfo(zodiac1)
    const info2 = getZodiacInfo(zodiac2)
    let analysis = ''

    if (info1 && info2) {
      const sameElement = Object.entries(elements).some(
        ([_, signs]) => signs.includes(zodiac1) && signs.includes(zodiac2)
      )

      if (sameElement) {
        analysis = `${zodiac1}和${zodiac2}同属${info1.element}象星座，在很多方面有相似的价值观和表达方式，容易产生共鸣。`
      } else {
        analysis = `${zodiac1}（${info1.element}象）和${zodiac2}（${info2.element}象）的组合，往往能互补长短，带来意想不到的惊喜。`
      }
    }

    const tips = [
      '多沟通是维系关系的关键',
      '学会欣赏对方的优点',
      '给对方足够的空间',
      '共同制定目标会更有效',
      '注意表达方式，避免冲突'
    ]

    return {
      zodiac1,
      zodiac2,
      score,
      analysis,
      tips: tips.slice(0, 3)
    }
  }

  const getPersonalityAnalysis = (zodiac: ZodiacSign): PersonalityAnalysis => {
    const personalityData: Record<ZodiacSign, Omit<PersonalityAnalysis, 'zodiac'>> = {
      '白羊座': {
        strengths: ['勇敢无畏', '行动力强', '充满热情', '领导能力强'],
        weaknesses: ['容易冲动', '缺乏耐心', '有时自私'],
        loveStyle: '直接而热烈，追求心跳的感觉',
        careerPaths: ['企业家', '运动员', '销售', '军事']
      },
      '金牛座': {
        strengths: ['稳重可靠', '有耐心', '务实', '艺术鉴赏力强'],
        weaknesses: ['固执', '占有欲强', '有时贪婪'],
        loveStyle: '忠诚专一，重视物质保障',
        careerPaths: ['金融', '会计', '艺术家', '建筑师']
      },
      '双子座': {
        strengths: ['聪明灵活', '善于交际', '多才多艺', '适应能力强'],
        weaknesses: ['善变', '容易分心', '有时肤浅'],
        loveStyle: '喜欢新鲜感，需要精神层面的交流',
        careerPaths: ['记者', '作家', '教师', '销售']
      },
      '巨蟹座': {
        strengths: ['温柔体贴', '记忆力强', '有同情心', '保护意识强'],
        weaknesses: ['敏感多疑', '情绪化', '有时依赖'],
        loveStyle: '渴望安全感，重视家庭',
        careerPaths: ['护士', '教师', '心理咨询', '餐饮']
      },
      '狮子座': {
        strengths: ['自信满满', '慷慨大方', '有领导力', '戏剧感强'],
        weaknesses: ['傲慢', '爱面子', '有时霸道'],
        loveStyle: '喜欢被崇拜，付出真心但需要回报',
        careerPaths: ['演员', '管理者', '政治家', '导演']
      },
      '处女座': {
        strengths: ['注重细节', '勤劳细心', '分析能力强', '追求完美'],
        weaknesses: ['挑剔', '过度担心', '有时苛刻'],
        loveStyle: '谨慎但真诚，重视精神契合',
        careerPaths: ['医生', '会计', '编辑', '程序员']
      },
      '天秤座': {
        strengths: ['优雅和谐', '善于社交', '公正客观', '审美观强'],
        weaknesses: ['犹豫不决', '逃避冲突', '过于在意他人看法'],
        loveStyle: '追求浪漫，重视关系的平衡',
        careerPaths: ['设计师', '外交官', '律师', '艺术家']
      },
      '天蝎座': {
        strengths: ['直觉敏锐', '意志坚定', '精力充沛', '洞察力强'],
        weaknesses: ['占有欲强', '嫉妒', '有时报复心重'],
        loveStyle: '深沉而专注，爱恨分明',
        careerPaths: ['心理学家', '侦探', '研究人员', '商人']
      },
      '射手座': {
        strengths: ['乐观开朗', '热爱自由', '冒险精神', '幽默风趣'],
        weaknesses: ['粗心大意', '过度乐观', '缺乏专注'],
        loveStyle: '向往自由，需要空间和刺激',
        careerPaths: ['旅行家', '摄影师', '运动员', '哲学家']
      },
      '摩羯座': {
        strengths: ['有责任感', '自律性强', '务实', '耐心十足'],
        weaknesses: ['悲观', '固执', '不善于表达情感'],
        loveStyle: '认真负责，需要时间建立信任',
        careerPaths: ['企业家', '政治家', '工程师', '律师']
      },
      '水瓶座': {
        strengths: ['创新独特', '人道主义', '理性', '独立性強'],
        weaknesses: ['难以捉摸', '叛逆', '有时冷漠'],
        loveStyle: '重视精神交流，需要保持独立',
        careerPaths: ['科学家', '发明家', '社会活动家', '作家']
      },
      '双鱼座': {
        strengths: ['富有想象力', '同情心强', '直觉敏锐', '艺术天赋'],
        weaknesses: ['容易逃避', '不切实际', '优柔寡断'],
        loveStyle: '浪漫梦幻，愿意为爱牺牲',
        careerPaths: ['艺术家', '音乐家', '诗人', '心理咨询']
      }
    }

    return {
      zodiac,
      ...personalityData[zodiac]
    }
  }

  return {
    zodiacList: ZODIAC_LIST,
    selectedZodiac,
    secondZodiac,
    setSelectedZodiac,
    setSecondZodiac,
    getZodiacInfo,
    getZodiacByDate,
    getMatchResult,
    getPersonalityAnalysis,
    getElementColor: (element: string) => ELEMENT_COLORS[element] || '#999'
  }
}

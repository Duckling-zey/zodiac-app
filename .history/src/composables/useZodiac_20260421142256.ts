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

  const getMatchResult = (zodiac1: ZodiacSign, zodiac2: ZodiacSign, matchType: 'love' | 'friendship' | 'work' | 'family' = 'love'): MatchResult => {
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

      switch (matchType) {
        case 'love':
          if (sameElement) {
            analysis = `${zodiac1}和${zodiac2}同属${info1.element}象星座，在爱情观和表达方式上有很多相似之处，容易产生强烈的化学反应。`
          } else {
            analysis = `${zodiac1}（${info1.element}象）和${zodiac2}（${info2.element}象）的组合，在爱情中能互补长短，带来丰富的情感体验。`
          }
          break
        case 'friendship':
          if (sameElement) {
            analysis = `${zodiac1}和${zodiac2}同属${info1.element}象星座，在友谊中能互相理解，有共同的兴趣爱好，容易成为知心朋友。`
          } else {
            analysis = `${zodiac1}（${info1.element}象）和${zodiac2}（${info2.element}象）的组合，在友谊中能互相学习，拓展彼此的视野。`
          }
          break
        case 'work':
          if (sameElement) {
            analysis = `${zodiac1}和${zodiac2}同属${info1.element}象星座，在工作中风格相似，能高效协作，共同完成目标。`
          } else {
            analysis = `${zodiac1}（${info1.element}象）和${zodiac2}（${info2.element}象）的组合，在工作中能互补优势，产生创新的解决方案。`
          }
          break
        case 'family':
          if (sameElement) {
            analysis = `${zodiac1}和${zodiac2}同属${info1.element}象星座，在家庭关系中能互相理解，有相似的价值观，家庭氛围和谐。`
          } else {
            analysis = `${zodiac1}（${info1.element}象）和${zodiac2}（${info2.element}象）的组合，在家庭中能互相包容，各展所长，共同营造温馨的家庭环境。`
          }
          break
      }
    }

    const tips = {
      love: [
        '多沟通是维系爱情的关键',
        '学会欣赏对方的优点',
        '给对方足够的空间',
        '共同创造浪漫回忆',
        '面对矛盾时保持冷静'
      ],
      friendship: [
        '真诚相待是友谊的基础',
        '互相支持和鼓励',
        '尊重彼此的差异',
        '保持联系，分享生活',
        '在朋友需要时及时伸出援手'
      ],
      work: [
        '明确分工，各司其职',
        '保持良好的沟通',
        '互相学习，共同进步',
        '面对挑战时团结协作',
        '及时反馈，不断优化'
      ],
      family: [
        '多花时间陪伴家人',
        '学会倾听和理解',
        '尊重彼此的隐私',
        '共同参与家庭活动',
        '在困难时互相支持'
      ]
    }

    return {
      zodiac1,
      zodiac2,
      score,
      analysis,
      tips: tips[matchType].slice(0, 3),
      matchType
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

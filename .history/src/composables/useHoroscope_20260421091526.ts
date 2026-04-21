import { ref, computed } from 'vue'
import { calculateDailyHoroscope, getHoroscopeDescription } from '@/utils/horoscope-calc'
import type { DailyHoroscope, ZodiacSign } from '@/types/zodiac'
import { useZodiac } from './useZodiac'

const currentZodiac = ref<ZodiacSign>('白羊座')
const horoscopeCache = ref<Map<string, DailyHoroscope>>(new Map())

export function useHoroscope() {
  const { getZodiacInfo } = useZodiac()

  const getTodayHoroscope = (zodiac: ZodiacSign): DailyHoroscope => {
    const today = new Date().toISOString().split('T')[0]
    const cacheKey = `${zodiac}-${today}`

    if (horoscopeCache.value.has(cacheKey)) {
      return horoscopeCache.value.get(cacheKey)!
    }

    const horoscope = calculateDailyHoroscope(zodiac, new Date())
    horoscopeCache.value.set(cacheKey, horoscope)
    return horoscope
  }

  const currentHoroscope = computed(() => getTodayHoroscope(currentZodiac.value))

  const setCurrentZodiac = (zodiac: ZodiacSign) => {
    currentZodiac.value = zodiac
  }

  const getHoroscopeWithDescription = (zodiac: ZodiacSign) => {
    const horoscope = getTodayHoroscope(zodiac)
    return {
      ...horoscope,
      overallDesc: getHoroscopeDescription(horoscope.overall),
      loveDesc: getHoroscopeDescription(horoscope.love),
      careerDesc: getHoroscopeDescription(horoscope.career),
      fortuneDesc: getHoroscopeDescription(horoscope.fortune),
      healthDesc: getHoroscopeDescription(horoscope.health),
      relationshipDesc: getHoroscopeDescription(horoscope.relationship),
      studyDesc: getHoroscopeDescription(horoscope.study)
    }
  }

  return {
    currentZodiac,
    currentHoroscope,
    setCurrentZodiac,
    getTodayHoroscope,
    getHoroscopeWithDescription
  }
}

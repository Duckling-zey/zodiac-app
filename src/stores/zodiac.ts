import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ZodiacSign, DailyHoroscope } from '@/types/zodiac'
import { calculateDailyHoroscope } from '@/utils/horoscope-calc'

export const useZodiacStore = defineStore('zodiac', () => {
  const selectedZodiac = ref<ZodiacSign>('白羊座')
  const birthDate = ref<string>('')
  const birthTime = ref<string>('')
  const birthPlace = ref<string>('')

  const setSelectedZodiac = (sign: ZodiacSign) => {
    selectedZodiac.value = sign
  }

  const setBirthInfo = (date: string, time: string, place: string) => {
    birthDate.value = date
    birthTime.value = time
    birthPlace.value = place
  }

  const getDailyHoroscope = (zodiac: ZodiacSign): DailyHoroscope => {
    return calculateDailyHoroscope(zodiac, new Date())
  }

  return {
    selectedZodiac,
    birthDate,
    birthTime,
    birthPlace,
    setSelectedZodiac,
    setBirthInfo,
    getDailyHoroscope
  }
})

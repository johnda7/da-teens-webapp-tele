/**
 * Check-In Feature - Model Layer
 * 
 * Типы и интерфейсы для ежедневного чек-ина эмоционального состояния
 */

export interface CheckInData {
  date: string          // ISO date (YYYY-MM-DD)
  mood: number          // 1-10 (1=очень плохо, 10=на высоте)
  anxiety: number       // 1-10 (1=спокойствие, 10=паника)
  sleepHours: number    // Часы сна (0-24)
  energy?: number       // 1-10 (опционально, для будущего)
  note?: string         // Заметки пользователя (опционально)
  timestamp?: number    // Unix timestamp (для точной истории)
}

export interface CheckInHistory {
  checkIns: CheckInData[]
  lastCheckIn: CheckInData | null
  streak: number        // Дней подряд с чек-инами
  totalCheckIns: number
}

// Emoji для визуализации настроения
export const MOOD_EMOJIS = [
  '😢', '😔', '😐', '🙂', '😊', 
  '😄', '🤗', '😍', '🥰', '✨'
] as const

// Текстовые метки для настроения
export const MOOD_LABELS = [
  'Очень плохо',
  'Плохо',
  'Грустно',
  'Нормально',
  'Хорошо',
  'Отлично',
  'Прекрасно',
  'Вдохновлённо',
  'Счастлив',
  'На высоте'
] as const

// Уровни тревожности
export const ANXIETY_LEVELS = [
  'Полное спокойствие',
  'Очень спокоен',
  'Спокоен',
  'Немного волнуюсь',
  'Волнение',
  'Тревога',
  'Сильная тревога',
  'Очень тревожно',
  'Паника',
  'Кризис'
] as const

// Оценка сна
export const SLEEP_QUALITY = {
  excellent: { min: 8, max: 10, label: 'Отлично выспался' },
  good: { min: 7, max: 8, label: 'Хорошо выспался' },
  ok: { min: 6, max: 7, label: 'Нормально' },
  poor: { min: 4, max: 6, label: 'Не выспался' },
  bad: { min: 0, max: 4, label: 'Очень плохо' }
} as const

/**
 * Получить качество сна по количеству часов
 */
export function getSleepQuality(hours: number): keyof typeof SLEEP_QUALITY {
  if (hours >= 8) return 'excellent'
  if (hours >= 7) return 'good'
  if (hours >= 6) return 'ok'
  if (hours >= 4) return 'poor'
  return 'bad'
}

/**
 * Проверить, сделал ли пользователь чек-ин сегодня
 */
export function hasCheckedInToday(lastCheckIn: CheckInData | null): boolean {
  if (!lastCheckIn) return false
  
  const today = new Date().toISOString().split('T')[0]
  return lastCheckIn.date === today
}

/**
 * Получить рекомендацию на основе чек-ина
 */
export function getCheckInRecommendation(checkIn: CheckInData): string {
  const { mood, anxiety, sleepHours } = checkIn
  
  // Кризисная ситуация
  if (mood <= 2 && anxiety >= 8) {
    return '💚 Сейчас тебе тяжело. Пожалуйста, обратись за помощью. Мы здесь для тебя.'
  }
  
  // Плохой сон + высокая тревожность
  if (sleepHours < 6 && anxiety >= 7) {
    return '😴 Недосып + тревога. Попробуй дыхательную практику и раньше лечь сегодня.'
  }
  
  // Плохой сон
  if (sleepHours < 6) {
    return '😴 Ты не выспался. Рекомендуем лёгкий урок в формате видео.'
  }
  
  // Высокая тревожность
  if (anxiety >= 7) {
    return '🧘 Высокая тревожность. Давай сделаем упражнение на дыхание?'
  }
  
  // Плохое настроение
  if (mood <= 4) {
    return '💙 Настроение не очень. Хочешь посмотреть вдохновляющую историю от сверстников?'
  }
  
  // Отличное состояние
  if (mood >= 8 && anxiety <= 3 && sleepHours >= 7) {
    return '✨ Ты в отличной форме! Самое время для сложного интерактивного урока!'
  }
  
  // Хорошее состояние
  if (mood >= 6 && anxiety <= 5) {
    return '😊 Хорошее настроение! Продолжай в том же духе!'
  }
  
  // Нормальное состояние
  return '🎯 Нормальное состояние. Давай выберем урок, который подойдёт сегодня.'
}

/**
 * Рассчитать среднее настроение за период
 */
export function calculateAverageMood(checkIns: CheckInData[]): number {
  if (checkIns.length === 0) return 5
  
  const sum = checkIns.reduce((acc, checkIn) => acc + checkIn.mood, 0)
  return Math.round((sum / checkIns.length) * 10) / 10
}

/**
 * Определить тренд настроения (улучшение/ухудшение)
 */
export function getMoodTrend(checkIns: CheckInData[]): 'improving' | 'declining' | 'stable' {
  if (checkIns.length < 3) return 'stable'
  
  const recent = checkIns.slice(-7) // Последние 7 чек-инов
  const earlier = checkIns.slice(-14, -7) // Предыдущие 7
  
  const recentAvg = calculateAverageMood(recent)
  const earlierAvg = calculateAverageMood(earlier)
  
  const diff = recentAvg - earlierAvg
  
  if (diff > 0.5) return 'improving'
  if (diff < -0.5) return 'declining'
  return 'stable'
}

export type CheckInFormState = 'idle' | 'submitting' | 'success' | 'error'

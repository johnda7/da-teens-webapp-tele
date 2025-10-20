/**
 * Adaptive Learning Feature - Model Layer
 * 
 * Перенесено из src/lib/adaptiveLearning.ts
 * Адаптивная система обучения на основе эмоционального состояния
 */

import type { CheckInData } from '@/features/check-in'

export interface UserProgress {
  userId: string
  completedLessons: string[]
  quizScores: Record<string, number>      // lessonId → score (0-100)
  timeSpent: Record<string, number>       // lessonId → minutes
  practiceCompleted: Record<string, boolean>
  checkIns: CheckInData[]
  lastActiveDate: Date
  streak: number
  totalXP: number
  level: number
}

export interface LessonRecommendation {
  lessonId: string
  title: string
  reason: string                          // Почему этот урок
  confidence: number                      // 0-100 (уверенность в рекомендации)
  emotionalFit: 'perfect' | 'good' | 'okay' | 'challenging'
  recommendedFormat: 'text' | 'video' | 'audio' | 'interactive' | 'mindmap'
  adaptations: string[]                   // Что адаптировать в уроке
  estimatedDuration: number               // Минуты
}

export interface EmotionalState {
  stability: 'stable' | 'improving' | 'declining' | 'volatile'
  capacity: 'high' | 'medium' | 'low' | 'crisis'
  needsSupport: boolean
  supportType?: 'immediate' | 'gentle' | 'monitoring'
}

export interface CognitiveLoad {
  current: 'low' | 'medium' | 'high' | 'overload'
  factors: {
    sleep: number          // 0-10
    anxiety: number        // 0-10 (inverted)
    energy: number         // 0-10
    timeOfDay: number      // 0-10 (based on peak hours)
  }
  recommendation: 'challenging' | 'moderate' | 'light' | 'rest'
}

export interface MasteryLevel {
  overall: number        // 0-1 (общий уровень владения темой)
  byTopic: Record<string, number>  // topic → mastery (0-1)
  confidence: number     // 0-1 (уверенность в оценке)
  readinessForNew: boolean
}

/**
 * Анализирует эмоциональное состояние на основе чек-инов
 */
export function analyzeEmotionalState(
  checkIns: CheckInData[],
  currentCheckIn?: CheckInData
): EmotionalState {
  const recentCheckIns = checkIns.slice(-7) // последняя неделя
  const current = currentCheckIn || checkIns[checkIns.length - 1]
  
  if (!current) {
    return {
      stability: 'stable',
      capacity: 'high',
      needsSupport: false
    }
  }
  
  // Средние значения за неделю
  const avgMood = recentCheckIns.reduce((sum, ci) => sum + ci.mood, 0) / recentCheckIns.length
  const avgAnxiety = recentCheckIns.reduce((sum, ci) => sum + ci.anxiety, 0) / recentCheckIns.length
  
  const currentMood = current.mood
  const currentAnxiety = current.anxiety
  const currentSleep = current.sleepHours
  
  // Кризисная ситуация
  if (currentMood <= 2 && currentAnxiety >= 8) {
    return {
      stability: 'volatile',
      capacity: 'crisis',
      needsSupport: true,
      supportType: 'immediate'
    }
  }
  
  // Низкая емкость
  if (currentMood <= 4 || currentAnxiety >= 7 || currentSleep < 5) {
    return {
      stability: 'declining',
      capacity: 'low',
      needsSupport: true,
      supportType: 'gentle'
    }
  }
  
  // Улучшение
  if (currentMood > avgMood + 1) {
    return {
      stability: 'improving',
      capacity: 'high',
      needsSupport: false
    }
  }
  
  // Стабильное состояние
  return {
    stability: 'stable',
    capacity: 'medium',
    needsSupport: false
  }
}

/**
 * Рассчитывает текущую когнитивную нагрузку
 */
export function calculateCognitiveLoad(
  userProgress: UserProgress,
  currentCheckIn?: CheckInData
): CognitiveLoad {
  const lastCheckIn = currentCheckIn || userProgress.checkIns[userProgress.checkIns.length - 1]
  
  if (!lastCheckIn) {
    return {
      current: 'medium',
      factors: { sleep: 7, anxiety: 5, energy: 5, timeOfDay: 5 },
      recommendation: 'moderate'
    }
  }
  
  // Факторы когнитивной нагрузки
  const sleepScore = Math.min(10, lastCheckIn.sleepHours * 1.25) // 8 часов = 10 баллов
  const anxietyScore = 10 - lastCheckIn.anxiety // Инвертируем (меньше тревоги = выше)
  const energyScore = lastCheckIn.energy || 5
  
  // Время дня (пиковые часы: 10-12, 15-17)
  const hour = new Date().getHours()
  const timeOfDayScore = 
    (hour >= 10 && hour <= 12) || (hour >= 15 && hour <= 17) ? 8 :
    (hour >= 8 && hour <= 9) || (hour >= 13 && hour <= 14) ? 6 :
    (hour >= 18 && hour <= 20) ? 5 : 3
  
  const avgScore = (sleepScore + anxietyScore + energyScore + timeOfDayScore) / 4
  
  let current: CognitiveLoad['current']
  let recommendation: CognitiveLoad['recommendation']
  
  if (avgScore >= 7.5) {
    current = 'low'
    recommendation = 'challenging'
  } else if (avgScore >= 5.5) {
    current = 'medium'
    recommendation = 'moderate'
  } else if (avgScore >= 3.5) {
    current = 'high'
    recommendation = 'light'
  } else {
    current = 'overload'
    recommendation = 'rest'
  }
  
  return {
    current,
    factors: {
      sleep: sleepScore,
      anxiety: anxietyScore,
      energy: energyScore,
      timeOfDay: timeOfDayScore
    },
    recommendation
  }
}

/**
 * Оценивает уровень владения темой (Bayesian Knowledge Tracing)
 */
export function estimateMastery(userProgress: UserProgress): MasteryLevel {
  const { completedLessons, quizScores } = userProgress
  
  if (completedLessons.length === 0) {
    return {
      overall: 0,
      byTopic: {},
      confidence: 0,
      readinessForNew: true
    }
  }
  
  // Средний балл по квизам
  const scores = Object.values(quizScores)
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
  
  // Конвертируем в mastery (0-1)
  const overall = avgScore / 100
  
  // Уверенность растет с количеством данных
  const confidence = Math.min(1, completedLessons.length / 10)
  
  // Готов к новому, если средний балл > 70%
  const readinessForNew = avgScore >= 70
  
  return {
    overall,
    byTopic: {}, // TODO: Детализировать по топикам
    confidence,
    readinessForNew
  }
}

/**
 * Рекомендует формат урока на основе состояния
 */
export function recommendLessonFormat(
  emotionalState: EmotionalState,
  cognitiveLoad: CognitiveLoad
): LessonRecommendation['recommendedFormat'] {
  // Кризис → mindmap (быстро, визуально)
  if (emotionalState.capacity === 'crisis') {
    return 'mindmap'
  }
  
  // Перегрузка → audio (пассивно)
  if (cognitiveLoad.current === 'overload') {
    return 'audio'
  }
  
  // Высокая нагрузка → video (легче текста)
  if (cognitiveLoad.current === 'high') {
    return 'video'
  }
  
  // Низкая нагрузка → interactive (вовлечение)
  if (cognitiveLoad.current === 'low' && emotionalState.capacity === 'high') {
    return 'interactive'
  }
  
  // Средняя нагрузка → text (баланс)
  return 'text'
}

/**
 * Генерирует объяснение рекомендации для пользователя
 */
export function generateRecommendationReason(
  emotionalState: EmotionalState,
  cognitiveLoad: CognitiveLoad,
  format: string
): string {
  const reasons: string[] = []
  
  // Эмоциональное состояние
  if (emotionalState.capacity === 'crisis') {
    reasons.push('Сейчас тебе тяжело. Давай начнём с простого.')
  } else if (emotionalState.capacity === 'low') {
    reasons.push('Ты немного устал.')
  } else if (emotionalState.capacity === 'high') {
    reasons.push('Ты в отличной форме!')
  }
  
  // Когнитивная нагрузка
  if (cognitiveLoad.factors.sleep < 6) {
    reasons.push('Ты не выспался.')
  }
  if (cognitiveLoad.factors.anxiety < 4) {
    reasons.push('Высокая тревожность.')
  }
  
  // Формат
  const formatExplanation = {
    mindmap: 'Визуальная карта поможет быстро ухватить суть.',
    audio: 'Аудио можно слушать, пока отдыхаешь.',
    video: 'Видео легче воспринимать, чем текст.',
    text: 'Текст позволит вдумчиво изучить тему.',
    interactive: 'Интерактив максимально вовлечёт тебя!'
  }
  
  reasons.push(formatExplanation[format as keyof typeof formatExplanation])
  
  return reasons.join(' ')
}

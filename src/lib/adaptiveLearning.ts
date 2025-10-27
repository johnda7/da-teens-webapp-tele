// Адаптивная система обучения на основе Google Learn Your Way
// С учетом эмоционального состояния подростка

import type { Lesson } from '@/data/boundariesModule'

export interface CheckInData {
  mood: number // 1-10
  anxiety: number // 1-10
  sleepHours: number
  energy: number // 1-10
  note?: string
  timestamp: Date
}

export interface UserProgress {
  userId: string
  completedLessons: string[]
  quizScores: Record<string, number> // lessonId -> score (0-100)
  timeSpent: Record<string, number> // lessonId -> minutes
  practiceCompleted: Record<string, boolean>
  checkIns: CheckInData[]
  lastActiveDate: Date
  streak: number
}

export interface LessonRecommendation {
  lesson: Lesson
  reason: string
  confidence: number // 0-100
  emotionalFit: 'perfect' | 'good' | 'okay' | 'challenging'
  adaptations: string[] // Что адаптировать в уроке
}

// ============================================
// ADAPTIVE LEARNING ENGINE
// ============================================

export class AdaptiveLearningEngine {
  /**
   * Главная функция: выбирает следующий урок на основе всех данных
   */
  async selectNextLesson(
    allLessons: Lesson[],
    userProgress: UserProgress,
    currentCheckIn?: CheckInData
  ): Promise<LessonRecommendation> {
    // 1. Анализируем эмоциональное состояние
    const emotionalState = this.analyzeEmotionalState(userProgress.checkIns, currentCheckIn)
    
    // 2. Оцениваем когнитивную нагрузку
    const cognitiveLoad = this.calculateCognitiveLoad(userProgress, currentCheckIn)
    
    // 3. Определяем уровень мастерства
    const masteryLevel = this.estimateMastery(userProgress)
    
    // 4. Фильтруем доступные уроки
    const availableLessons = this.filterAvailableLessons(allLessons, userProgress)
    
    // 5. Подбираем оптимальный урок
    const recommendations = availableLessons.map(lesson => 
      this.scorelesson(lesson, emotionalState, cognitiveLoad, masteryLevel, userProgress)
    )
    
    // 6. Выбираем лучший
    const best = recommendations.sort((a, b) => b.confidence - a.confidence)[0]
    
    return best
  }

  /**
   * Анализирует эмоциональное состояние на основе чек-инов
   */
  private analyzeEmotionalState(
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
    const avgSleep = recentCheckIns.reduce((sum, ci) => sum + ci.sleepHours, 0) / recentCheckIns.length
    
    // Текущие показатели
    const currentMood = current.mood
    const currentAnxiety = current.anxiety
    const currentSleep = current.sleepHours
    const currentEnergy = current.energy || 5
    
    // Определяем стабильность (резкие колебания?)
    const moodVolatility = Math.abs(currentMood - avgMood)
    const stability: EmotionalState['stability'] = 
      moodVolatility > 3 ? 'volatile' :
      moodVolatility > 1.5 ? 'fluctuating' : 'stable'
    
    // Определяем ёмкость (capacity) для обучения
    let capacity: EmotionalState['capacity'] = 'high'
    
    if (currentAnxiety >= 8 || currentMood <= 3 || currentSleep < 5 || currentEnergy <= 3) {
      capacity = 'low'
    } else if (currentAnxiety >= 6 || currentMood <= 5 || currentSleep < 6 || currentEnergy <= 5) {
      capacity = 'medium'
    }
    
    // Нужна ли поддержка?
    const needsSupport = currentAnxiety >= 8 || currentMood <= 3 || 
                        (avgMood < 5 && avgAnxiety > 6)
    
    return {
      stability,
      capacity,
      needsSupport,
      metrics: {
        mood: currentMood,
        anxiety: currentAnxiety,
        sleep: currentSleep,
        energy: currentEnergy,
        avgMood,
        avgAnxiety
      }
    }
  }

  /**
   * Рассчитывает когнитивную нагрузку (не перегружен ли студент?)
   */
  private calculateCognitiveLoad(
    userProgress: UserProgress,
    currentCheckIn?: CheckInData
  ): CognitiveLoad {
    const now = new Date()
    const hourOfDay = now.getHours()
    
    // Факторы нагрузки
    let loadScore = 0
    
    // 1. Время дня (подростки эффективнее днем/вечером, не рано утром)
    if (hourOfDay < 8 || hourOfDay > 22) {
      loadScore += 30 // Низкая эффективность
    } else if (hourOfDay >= 10 && hourOfDay <= 20) {
      loadScore -= 10 // Оптимальное время
    }
    
    // 2. Недавняя активность (не перегружен ли?)
    const recentLessons = Object.entries(userProgress.timeSpent)
      .filter(([_, minutes]) => minutes > 0)
      .length
    
    if (recentLessons > 3) {
      loadScore += 20 // Много уроков недавно
    }
    
    // 3. Качество сна
    const recentCheckIns = userProgress.checkIns.slice(-3)
    const avgSleep = recentCheckIns.reduce((sum, ci) => sum + ci.sleepHours, 0) / recentCheckIns.length
    
    if (avgSleep < 6) {
      loadScore += 25
    } else if (avgSleep < 7) {
      loadScore += 15
    }
    
    // 4. Текущая энергия
    if (currentCheckIn) {
      const energyPenalty = (10 - (currentCheckIn.energy || 5)) * 5
      loadScore += energyPenalty
    }
    
    // Нормализуем в категорию
    if (loadScore >= 50) return 'high'
    if (loadScore >= 25) return 'medium'
    return 'low'
  }

  /**
   * Оценивает уровень мастерства студента (Bayesian Knowledge Tracing inspired)
   */
  private estimateMastery(userProgress: UserProgress): MasteryLevel {
    const completedCount = userProgress.completedLessons.length
    const avgQuizScore = Object.values(userProgress.quizScores)
      .reduce((sum, score) => sum + score, 0) / Object.keys(userProgress.quizScores).length || 0
    
    const practiceRate = Object.values(userProgress.practiceCompleted)
      .filter(Boolean).length / Math.max(1, completedCount)
    
    // Учитываем streak (постоянство)
    const streakBonus = Math.min(userProgress.streak * 2, 20)
    
    // Общий скор мастерства
    const masteryScore = (
      (completedCount * 10) +
      avgQuizScore +
      (practiceRate * 20) +
      streakBonus
    ) / 2
    
    if (masteryScore >= 70) return 'advanced'
    if (masteryScore >= 40) return 'intermediate'
    return 'beginner'
  }

  /**
   * Фильтрует уроки, доступные для изучения (prerequisites выполнены)
   */
  private filterAvailableLessons(
    allLessons: Lesson[],
    userProgress: UserProgress
  ): Lesson[] {
    return allLessons.filter(lesson => {
      // Уже пройден?
      if (userProgress.completedLessons.includes(lesson.id)) {
        return false
      }
      
      // Prerequisites выполнены?
      if (lesson.prerequisites && lesson.prerequisites.length > 0) {
        const allPrereqsMet = lesson.prerequisites.every(prereqId =>
          userProgress.completedLessons.includes(prereqId)
        )
        return allPrereqsMet
      }
      
      return true
    })
  }

  /**
   * Оценивает, насколько урок подходит текущему состоянию
   */
  private scorelesson(
    lesson: Lesson,
    emotionalState: EmotionalState,
    cognitiveLoad: CognitiveLoad,
    masteryLevel: MasteryLevel,
    userProgress: UserProgress
  ): LessonRecommendation {
    let score = 50 // базовый скор
    let adaptations: string[] = []
    
    // 1. Эмоциональное соответствие
    if (emotionalState.needsSupport) {
      // При низком состоянии — легкие, поддерживающие уроки
      if (lesson.difficulty === 'easy') {
        score += 20
        adaptations.push('Фокус на поддерживающих практиках')
      } else if (lesson.difficulty === 'hard') {
        score -= 30
      }
      
      // Уроки с определенными тегами предпочтительнее
      const supportiveTags = ['самопознание', 'самосострадание', 'безопасность']
      const hasSupportiveTag = lesson.emotionalTags.some(tag => supportiveTags.includes(tag))
      if (hasSupportiveTag) {
        score += 15
        adaptations.push('Добавить упражнения на самосострадание')
      }
    }
    
    // 2. Когнитивная нагрузка
    if (cognitiveLoad === 'high') {
      // При высокой нагрузке — короткие, легкие уроки
      if (lesson.difficulty === 'easy') {
        score += 15
      } else {
        score -= 20
      }
      adaptations.push('Сократить урок до 10 минут', 'Предложить аудио-формат')
    } else if (cognitiveLoad === 'low') {
      // При низкой — можно сложные
      if (lesson.difficulty === 'hard') {
        score += 10
      }
    }
    
    // 3. Соответствие уровню мастерства
    const difficultyMatch = this.matchDifficultyToMastery(lesson.difficulty, masteryLevel)
    score += difficultyMatch
    
    // 4. Разнообразие (не повторять похожие уроки подряд)
    const lastCompleted = userProgress.completedLessons[userProgress.completedLessons.length - 1]
    // Можно добавить логику проверки похожести с последним уроком
    
    // 5. Энергия для capacity
    if (emotionalState.capacity === 'low') {
      adaptations.push('Предложить формат "слушай и отдыхай"', 'Разбить на 2 сессии')
      if (lesson.difficulty !== 'easy') {
        score -= 15
      }
    }
    
    // 6. Время дня (если есть)
    const now = new Date()
    if (now.getHours() > 20) {
      adaptations.push('Вечерний режим: спокойный голос, мягкое освещение UI')
    }
    
    // Нормализуем score в 0-100
    score = Math.max(0, Math.min(100, score))
    
    // Определяем emotionalFit
    let emotionalFit: LessonRecommendation['emotionalFit'] = 'good'
    if (score >= 80) emotionalFit = 'perfect'
    else if (score >= 60) emotionalFit = 'good'
    else if (score >= 40) emotionalFit = 'okay'
    else emotionalFit = 'challenging'
    
    // Формируем причину рекомендации
    const reason = this.generateReason(lesson, emotionalState, cognitiveLoad, masteryLevel)
    
    return {
      lesson,
      reason,
      confidence: score,
      emotionalFit,
      adaptations
    }
  }

  /**
   * Сопоставляет сложность урока с уровнем мастерства (Zone of Proximal Development)
   */
  private matchDifficultyToMastery(
    difficulty: Lesson['difficulty'],
    mastery: MasteryLevel
  ): number {
    // Идеальное совпадение: на уровень выше текущего (Vygotsky ZPD)
    if (mastery === 'beginner' && difficulty === 'easy') return 15
    if (mastery === 'beginner' && difficulty === 'medium') return 10 // Можно попробовать
    if (mastery === 'beginner' && difficulty === 'hard') return -20 // Слишком сложно
    
    if (mastery === 'intermediate' && difficulty === 'medium') return 15
    if (mastery === 'intermediate' && difficulty === 'hard') return 10
    if (mastery === 'intermediate' && difficulty === 'easy') return 5 // Можно, но не вызов
    
    if (mastery === 'advanced' && difficulty === 'hard') return 15
    if (mastery === 'advanced' && difficulty === 'medium') return 10
    if (mastery === 'advanced' && difficulty === 'easy') return -5 // Скучно
    
    return 0
  }

  /**
   * Генерирует человеческое объяснение, почему выбран этот урок
   */
  private generateReason(
    lesson: Lesson,
    emotionalState: EmotionalState,
    cognitiveLoad: CognitiveLoad,
    masteryLevel: MasteryLevel
  ): string {
    const reasons: string[] = []
    
    // Эмоциональное состояние
    if (emotionalState.needsSupport) {
      reasons.push('Этот урок поддержит тебя в текущем состоянии')
    } else if (emotionalState.capacity === 'high') {
      reasons.push('У тебя отличная энергия для обучения!')
    }
    
    // Когнитивная нагрузка
    if (cognitiveLoad === 'high') {
      reasons.push('Урок адаптирован под твою текущую загруженность')
    } else if (cognitiveLoad === 'low') {
      reasons.push('Отличное время углубиться в тему')
    }
    
    // Мастерство
    if (lesson.difficulty === 'easy' && masteryLevel === 'beginner') {
      reasons.push('Идеальный старт для новичка')
    } else if (lesson.difficulty === 'medium' && masteryLevel === 'intermediate') {
      reasons.push('Следующий шаг в твоем развитии')
    } else if (lesson.difficulty === 'hard' && masteryLevel === 'advanced') {
      reasons.push('Вызов для продвинутого уровня')
    }
    
    // Эмоциональные теги
    if (lesson.emotionalTags.length > 0) {
      const tag = lesson.emotionalTags[0]
      reasons.push(`Поможет с "${tag}"`)
    }
    
    return reasons.join('. ') + '.'
  }
}

// ============================================
// ТИПЫ
// ============================================

interface EmotionalState {
  stability: 'stable' | 'fluctuating' | 'volatile'
  capacity: 'low' | 'medium' | 'high' // Ёмкость для обучения
  needsSupport: boolean
  metrics?: {
    mood: number
    anxiety: number
    sleep: number
    energy: number
    avgMood: number
    avgAnxiety: number
  }
}

type CognitiveLoad = 'low' | 'medium' | 'high'

type MasteryLevel = 'beginner' | 'intermediate' | 'advanced'

// ============================================
// HELPER: Spaced Repetition (Ebbinghaus)
// ============================================

export class SpacedRepetitionHelper {
  /**
   * Рассчитывает, когда нужно повторить урок (кривая забывания Ebbinghaus)
   */
  static calculateReviewDate(
    lastReviewDate: Date,
    performanceScore: number, // 0-100
    reviewCount: number
  ): Date {
    // Базовые интервалы (дни): 1, 3, 7, 14, 30, 60
    const intervals = [1, 3, 7, 14, 30, 60]
    let interval = intervals[Math.min(reviewCount, intervals.length - 1)]
    
    // Корректируем на основе performance
    if (performanceScore < 60) {
      interval = Math.max(1, Math.floor(interval / 2)) // Раньше повторить
    } else if (performanceScore >= 90) {
      interval = Math.floor(interval * 1.5) // Можно позже
    }
    
    const reviewDate = new Date(lastReviewDate)
    reviewDate.setDate(reviewDate.getDate() + interval)
    
    return reviewDate
  }

  /**
   * Проверяет, нужно ли повторение
   */
  static needsReview(lastReviewDate: Date, nextReviewDate: Date): boolean {
    const now = new Date()
    return now >= nextReviewDate
  }
}

// ============================================
// HELPER: Personalized Hints
// ============================================

export class PersonalizedHints {
  /**
   * Генерирует подсказку на основе эмоционального состояния
   */
  static generateHint(emotionalState: EmotionalState): string {
    if (emotionalState.needsSupport) {
      return '💙 Помни: ты не один. Каждый шаг — это прогресс, даже если он кажется маленьким.'
    }
    
    if (emotionalState.capacity === 'low') {
      return '🌙 Сегодня можешь взять урок полегче. Забота о себе — это не слабость.'
    }
    
    if (emotionalState.capacity === 'high') {
      return '🚀 Отличная энергия! Сегодня можешь попробовать что-то новое.'
    }
    
    if (emotionalState.stability === 'volatile') {
      return '🌊 Замечаю колебания настроения. Может, стоит сделать паузу и подышать?'
    }
    
    return '✨ Ты на правильном пути. Продолжай в своем темпе!'
  }

  /**
   * Генерирует мотивационное сообщение после завершения урока
   */
  static generateCelebration(
    lesson: Lesson,
    score: number,
    emotionalState: EmotionalState
  ): string {
    if (score >= 90) {
      return '🎉 Невероятно! Ты отлично справился!'
    } else if (score >= 70) {
      return '👏 Хорошая работа! Ты растешь с каждым уроком.'
    } else if (score >= 50) {
      return '💪 Молодец, что дошел до конца! Это требует смелости.'
    } else {
      return '🌱 Каждая попытка — это рост. Горжусь тобой за то, что пробуешь!'
    }
  }
}

// Экспорт
export const adaptiveLearning = new AdaptiveLearningEngine()

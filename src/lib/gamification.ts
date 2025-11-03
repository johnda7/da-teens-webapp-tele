// Система геймификации с фокусом на психологическое благополучие подростков
// Вдохновлено лучшими практиками EdTech

export interface GamificationProgress {
  userId: string
  xp: number
  level: number
  streak: number
  longestStreak: number
  freezesUsed: number
  maxFreezes: number
  badges: UserBadge[]
  wellnessScore: number // 0-100, комбо learning + emotional health
  emotionalGrowthMetrics: EmotionalGrowthMetrics
  lastCheckIn: Date
  totalLessonsCompleted: number
  totalPracticesCompleted: number
  totalMinutesLearned: number
}

export interface UserBadge {
  badgeId: string
  earnedDate: Date
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum'
}

export interface EmotionalGrowthMetrics {
  anxietyReduction: number // -100 to +100 (положительное = снижение)
  moodImprovement: number // -100 to +100
  boundaryConfidence: number // 0-100
  selfAwarenessLevel: number // 0-100
  communicationSkills: number // 0-100
  emotionalRegulation: number // 0-100
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: 'learning' | 'emotional' | 'social' | 'streak' | 'special'
  criteria: BadgeCriteria
  tiers?: ('bronze' | 'silver' | 'gold' | 'platinum')[]
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  emotionalMessage: string // Особое сообщение для подростка
}

export interface BadgeCriteria {
  type: 'lessons_completed' | 'streak' | 'xp' | 'mood_improvement' | 'anxiety_reduction' | 
        'practice_consistency' | 'boundary_skill' | 'special_achievement'
  threshold: number | SpecialCriteria
}

export interface SpecialCriteria {
  check: (progress: GamificationProgress) => boolean
  description: string
}

// ============================================
// GAMIFICATION ENGINE
// ============================================

export class GamificationEngine {
  /**
   * Начисляет XP за действие
   */
  awardXP(
    progress: GamificationProgress,
    action: 'lesson_completed' | 'quiz_perfect' | 'practice_done' | 'check_in' | 'homework_done' | 'helped_peer' | 
            'castle_unlocked' | 'castle_upgraded' | 'skill_unlocked' | 'skill_leveled_up' | 'roleplay_completed' | 
            'roleplay_perfect' | 'challenge_task_completed' | 'challenge_week_completed' | 'mastery_achieved',
    performance?: number
  ): { newXP: number; levelUp: boolean; newLevel?: number } {
    let xpGain = 0
    
    switch (action) {
      case 'lesson_completed':
        xpGain = 50 + (performance ? Math.round(performance / 2) : 0) // 50-100 XP
        break
      case 'quiz_perfect':
        xpGain = 30
        break
      case 'practice_done':
        xpGain = 40
        break
      case 'check_in':
        xpGain = 10
        break
      case 'homework_done':
        xpGain = 25
        break
      case 'helped_peer':
        xpGain = 20
        break
      // New game mechanics (from USER_JOURNEY_ANALYSIS.md)
      case 'castle_unlocked':
        xpGain = 50 // Castle part unlock
        break
      case 'castle_upgraded':
        xpGain = 25 // Castle part upgrade
        break
      case 'skill_unlocked':
        xpGain = 30 // Skill tree unlock
        break
      case 'skill_leveled_up':
        xpGain = 15 // Skill level up
        break
      case 'roleplay_completed':
        xpGain = 40 // Role-play scenario completed
        break
      case 'roleplay_perfect':
        xpGain = 20 // Perfect role-play score bonus
        break
      case 'challenge_task_completed':
        xpGain = 20 // Weekly challenge task
        break
      case 'challenge_week_completed':
        xpGain = 100 // Weekly challenge completed
        break
      case 'mastery_achieved':
        xpGain = 50 // Mastery 100% bonus
        break
    }
    
    // Бонус за streak
    if (progress.streak >= 7) {
      xpGain = Math.round(xpGain * 1.2)
    }
    if (progress.streak >= 30) {
      xpGain = Math.round(xpGain * 1.5)
    }
    
    const newXP = progress.xp + xpGain
    const currentLevel = progress.level
    const newLevel = this.calculateLevel(newXP)
    const levelUp = newLevel > currentLevel
    
    return {
      newXP,
      levelUp,
      newLevel: levelUp ? newLevel : undefined
    }
  }

  /**
   * Рассчитывает уровень на основе XP (нелинейный рост для долгосрочной мотивации)
   */
  private calculateLevel(xp: number): number {
    // Формула: level = floor(sqrt(xp / 100))
    // Уровень 1: 100 XP
    // Уровень 2: 400 XP
    // Уровень 3: 900 XP
    // Уровень 5: 2500 XP
    // Уровень 10: 10000 XP
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  /**
   * Обновляет streak (с защитой от "забыл один день = потеря всего")
   */
  updateStreak(
    progress: GamificationProgress,
    lastActiveDate: Date,
    now: Date = new Date()
  ): { newStreak: number; streakLost: boolean; freezeUsed: boolean } {
    const daysDiff = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff === 0) {
      // Сегодня уже активны
      return { newStreak: progress.streak, streakLost: false, freezeUsed: false }
    }
    
    if (daysDiff === 1) {
      // Вчера были активны — streak продолжается
      const newStreak = progress.streak + 1
      return { 
        newStreak, 
        streakLost: false, 
        freezeUsed: false 
      }
    }
    
    if (daysDiff === 2 && progress.freezesUsed < progress.maxFreezes) {
      // Пропустили день, но есть freeze
      return {
        newStreak: progress.streak,
        streakLost: false,
        freezeUsed: true
      }
    }
    
    // Streak потерян
    return {
      newStreak: 1, // Начинаем заново
      streakLost: true,
      freezeUsed: false
    }
  }

  /**
   * Проверяет, какие новые бейджи заработаны
   */
  checkNewBadges(
    progress: GamificationProgress,
    allBadges: Badge[]
  ): Badge[] {
    const earnedBadgeIds = progress.badges.map(b => b.badgeId)
    const newBadges: Badge[] = []
    
    for (const badge of allBadges) {
      // Уже есть?
      if (earnedBadgeIds.includes(badge.id)) continue
      
      // Проверяем критерии
      if (this.checkBadgeCriteria(badge, progress)) {
        newBadges.push(badge)
      }
    }
    
    return newBadges
  }

  /**
   * Проверяет критерии одного бейджа
   */
  private checkBadgeCriteria(badge: Badge, progress: GamificationProgress): boolean {
    const { type, threshold } = badge.criteria
    
    switch (type) {
      case 'lessons_completed':
        return progress.totalLessonsCompleted >= (threshold as number)
      
      case 'streak':
        return progress.streak >= (threshold as number)
      
      case 'xp':
        return progress.xp >= (threshold as number)
      
      case 'mood_improvement':
        return progress.emotionalGrowthMetrics.moodImprovement >= (threshold as number)
      
      case 'anxiety_reduction':
        return progress.emotionalGrowthMetrics.anxietyReduction >= (threshold as number)
      
      case 'practice_consistency':
        return progress.totalPracticesCompleted >= (threshold as number)
      
      case 'boundary_skill':
        return progress.emotionalGrowthMetrics.boundaryConfidence >= (threshold as number)
      
      case 'special_achievement':
        const specialCriteria = threshold as SpecialCriteria
        return specialCriteria.check(progress)
      
      default:
        return false
    }
  }

  /**
   * Рассчитывает Wellness Score (холистический показатель прогресса)
   */
  calculateWellnessScore(progress: GamificationProgress): number {
    const learningProgress = Math.min(100, (progress.totalLessonsCompleted / 50) * 100)
    const consistencyScore = Math.min(100, (progress.streak / 30) * 100)
    
    const emotionalScore = (
      progress.emotionalGrowthMetrics.moodImprovement +
      progress.emotionalGrowthMetrics.anxietyReduction +
      progress.emotionalGrowthMetrics.selfAwarenessLevel
    ) / 3
    
    // Вес: 40% обучение, 30% эмоциональный рост, 30% постоянство
    const wellnessScore = (
      learningProgress * 0.4 +
      Math.max(0, emotionalScore) * 0.3 +
      consistencyScore * 0.3
    )
    
    return Math.round(Math.min(100, Math.max(0, wellnessScore)))
  }
}

// ============================================
// BADGE DEFINITIONS (специально для подростков!)
// ============================================

export const TEEN_BADGES: Badge[] = [
  // ========== LEARNING BADGES ==========
  {
    id: 'first-lesson',
    name: 'Первый шаг',
    description: 'Завершил первый урок',
    icon: '🌱',
    category: 'learning',
    criteria: { type: 'lessons_completed', threshold: 1 },
    rarity: 'common',
    emotionalMessage: 'Гордись собой! Начать — это самое сложное, и ты справился.'
  },
  {
    id: 'module-master',
    name: 'Мастер модуля',
    description: 'Завершил все уроки модуля "Личные границы"',
    icon: '🛡️',
    category: 'learning',
    criteria: { type: 'lessons_completed', threshold: 9 },
    rarity: 'rare',
    emotionalMessage: 'Ты прошел путь от незнания к мастерству. Твои границы теперь сильнее!'
  },
  {
    id: 'knowledge-seeker',
    name: 'Искатель знаний',
    description: 'Завершил 25 уроков',
    icon: '📚',
    category: 'learning',
    criteria: { type: 'lessons_completed', threshold: 25 },
    rarity: 'epic',
    emotionalMessage: 'Твое любопытство и настойчивость впечатляют!'
  },
  {
    id: 'wisdom-keeper',
    name: 'Хранитель мудрости',
    description: 'Завершил 50 уроков',
    icon: '🦉',
    category: 'learning',
    criteria: { type: 'lessons_completed', threshold: 50 },
    rarity: 'legendary',
    emotionalMessage: 'Ты не просто учишься — ты меняешь себя. Это огромное достижение!'
  },

  // ========== EMOTIONAL GROWTH BADGES ==========
  {
    id: 'mood-warrior',
    name: 'Воин настроения',
    description: 'Улучшил среднее настроение на 20%',
    icon: '🌈',
    category: 'emotional',
    criteria: { type: 'mood_improvement', threshold: 20 },
    rarity: 'rare',
    emotionalMessage: 'Твоя работа над собой приносит плоды. Ты чувствуешь это?'
  },
  {
    id: 'calm-master',
    name: 'Мастер спокойствия',
    description: 'Снизил уровень тревожности на 30%',
    icon: '🧘',
    category: 'emotional',
    criteria: { type: 'anxiety_reduction', threshold: 30 },
    rarity: 'epic',
    emotionalMessage: 'Ты научился управлять тревогой вместо того, чтобы она управляла тобой.'
  },
  {
    id: 'boundary-guardian',
    name: 'Страж границ',
    description: 'Уверенность в границах достигла 70%',
    icon: '🛡️',
    category: 'emotional',
    criteria: { type: 'boundary_skill', threshold: 70 },
    rarity: 'epic',
    emotionalMessage: 'Ты научился говорить "нет" и защищать свое пространство. Это сила!'
  },
  {
    id: 'self-love-champion',
    name: 'Чемпион самолюбви',
    description: 'Практиковал самосострадание 30 раз',
    icon: '💖',
    category: 'emotional',
    criteria: { type: 'practice_consistency', threshold: 30 },
    rarity: 'rare',
    emotionalMessage: 'Заботиться о себе — не эгоизм. Ты это понял, и это меняет все!'
  },

  // ========== STREAK BADGES ==========
  {
    id: 'week-warrior',
    name: 'Недельный боец',
    description: 'Streak 7 дней',
    icon: '🔥',
    category: 'streak',
    criteria: { type: 'streak', threshold: 7 },
    rarity: 'common',
    emotionalMessage: 'Целая неделя! Постоянство — это твоя суперсила.'
  },
  {
    id: 'month-master',
    name: 'Месячный мастер',
    description: 'Streak 30 дней',
    icon: '⚡',
    category: 'streak',
    criteria: { type: 'streak', threshold: 30 },
    rarity: 'rare',
    emotionalMessage: 'Месяц без пропусков! Ты превратил обучение в привычку.'
  },
  {
    id: 'unstoppable',
    name: 'Неудержимый',
    description: 'Streak 100 дней',
    icon: '🚀',
    category: 'streak',
    criteria: { type: 'streak', threshold: 100 },
    rarity: 'legendary',
    emotionalMessage: '100 дней! Ты доказал себе, что можешь достигать невозможного.'
  },

  // ========== SOCIAL BADGES ==========
  {
    id: 'peer-supporter',
    name: 'Поддержка друзей',
    description: 'Помог 5 друзьям в их пути',
    icon: '🤝',
    category: 'social',
    criteria: { 
      type: 'special_achievement',
      threshold: {
        check: (progress) => {
          // Проверка, помог ли другим (будет реализовано через социальные фичи)
          return false // Заглушка
        },
        description: 'Помочь 5 друзьям'
      } as SpecialCriteria
    },
    rarity: 'rare',
    emotionalMessage: 'Ты не только растешь сам — ты помогаешь другим. Настоящий лидер!'
  },

  // ========== SPECIAL/FUN BADGES ==========
  {
    id: 'night-owl',
    name: 'Ночная сова',
    description: 'Завершил урок после полуночи',
    icon: '🦉',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress) => {
          const now = new Date()
          return now.getHours() >= 0 && now.getHours() < 6
        },
        description: 'Учиться ночью'
      } as SpecialCriteria
    },
    rarity: 'common',
    emotionalMessage: 'Даже ночью ты находишь время для себя. Но не забывай про сон! 😴'
  },
  {
    id: 'comeback-kid',
    name: 'Вернувшийся боец',
    description: 'Вернулся после потери streak',
    icon: '💪',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress) => {
          return progress.longestStreak > progress.streak && progress.streak >= 7
        },
        description: 'Вернуться после потери streak'
      } as SpecialCriteria
    },
    rarity: 'epic',
    emotionalMessage: 'Ты упал и встал. Это настоящая сила характера!'
  },
  {
    id: 'perfect-student',
    name: 'Идеальный ученик',
    description: 'Получил 100% на 10 тестах подряд',
    icon: '🌟',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress) => {
          // Проверка серии идеальных результатов (будет реализовано)
          return false
        },
        description: '10 идеальных тестов'
      } as SpecialCriteria
    },
    rarity: 'legendary',
    emotionalMessage: 'Твоя внимательность и старание феноменальны!'
  },
  {
    id: 'mindful-master',
    name: 'Мастер осознанности',
    description: 'Делал чек-ины 30 дней подряд',
    icon: '🧠',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress) => {
          // Проверка постоянства чек-инов
          return false
        },
        description: '30 дней чек-инов'
      } as SpecialCriteria
    },
    rarity: 'rare',
    emotionalMessage: 'Ты научился слушать себя каждый день. Это дар!'
  },
  {
    id: 'sleep-master',
    name: 'Мастер сна',
    description: 'Неделя подряд спал 8+ часов',
    icon: '🌙',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress: any) => {
          // Проверка будет делаться в handleCheckIn
          return false
        },
        description: '7 дней подряд 8+ часов сна'
      } as SpecialCriteria
    },
    rarity: 'epic',
    emotionalMessage: 'Ты заботишься о своем отдыхе! Хороший сон = больше энергии для жизни 🌙'
  },

  // ========== NEW GAME MECHANICS BADGES ==========
  {
    id: 'castle-defender',
    name: 'Защитник замка',
    description: 'Построил свой замок до максимума',
    icon: '🏰',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress: any) => {
          // Check if all 9 castle parts unlocked (future implementation)
          return false
        },
        description: 'Все 9 частей замка открыты'
      } as SpecialCriteria
    },
    rarity: 'epic',
    emotionalMessage: 'Твой замок границ крепок! Никто не сможет нарушить твоё пространство!'
  },
  {
    id: 'skill-unicorn',
    name: 'Единорог',
    description: 'Открыл все 20 навыков',
    icon: '🦄',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress: any) => {
          // Check if all skills unlocked (future implementation)
          return false
        },
        description: 'Все навыки в дереве открыты'
      } as SpecialCriteria
    },
    rarity: 'legendary',
    emotionalMessage: 'Ты единорог среди подростков! Уникальные способности!'
  },
  {
    id: 'roleplay-actor',
    name: 'Актёр',
    description: 'Прошёл все сценарии с идеальным счётом',
    icon: '🎭',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress: any) => {
          // Check if all role-play scenarios completed perfectly (future implementation)
          return false
        },
        description: 'Все сценарии на 100%'
      } as SpecialCriteria
    },
    rarity: 'epic',
    emotionalMessage: 'Ты мастер общения! Твои навыки в реальных ситуациях безупречны!'
  },
  {
    id: 'challenge-master',
    name: 'Челлендж-мастер',
    description: 'Завершил все недельные челленджи',
    icon: '🎪',
    category: 'special',
    criteria: {
      type: 'special_achievement',
      threshold: {
        check: (progress: any) => {
          // Check if all weekly challenges completed (future implementation)
          return false
        },
        description: 'Все челленджи пройдены'
      } as SpecialCriteria
    },
    rarity: 'rare',
    emotionalMessage: 'Ты боец! Постоянно бросаешь себе вызовы и выигрываешь!'
  }
]

// ============================================
// LEVEL TITLES (для мотивации)
// ============================================

export const LEVEL_TITLES = [
  { level: 1, title: 'Новичок', emoji: '🌱' },
  { level: 3, title: 'Искатель', emoji: '🔍' },
  { level: 5, title: 'Ученик', emoji: '📖' },
  { level: 10, title: 'Практик', emoji: '🎯' },
  { level: 15, title: 'Мастер', emoji: '⭐' },
  { level: 20, title: 'Эксперт', emoji: '🏆' },
  { level: 30, title: 'Наставник', emoji: '🦉' },
  { level: 50, title: 'Легенда', emoji: '👑' }
]

export function getLevelTitle(level: number): { title: string; emoji: string } {
  const sorted = [...LEVEL_TITLES].sort((a, b) => b.level - a.level)
  const match = sorted.find(lt => level >= lt.level)
  return match || LEVEL_TITLES[0]
}

// Экспорт
export const gamification = new GamificationEngine()

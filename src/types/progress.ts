/**
 * User Progress Types
 * Типы для системы персонализации прогресса
 */

export interface UserProgress {
  /** Telegram ID пользователя */
  userId: string
  
  /** Завершенные уроки (lesson IDs) */
  completedLessons: string[]
  
  /** Результаты квизов (lessonId → score) */
  quizScores: Record<string, number>
  
  /** Время на урок (lessonId → minutes) */
  timeSpent: Record<string, number>
  
  /** Завершенные практики (lessonId → completed) */
  practiceCompleted: Record<string, boolean>
  
  /** Общий опыт */
  totalXP: number
  
  /** Уровень */
  level: number
  
  /** Серия дней */
  streak: number
  
  /** Последняя активность */
  lastActiveDate: Date
  
  /** Check-ins */
  checkIns: CheckIn[]
}

export interface CheckIn {
  date: string
  mood: number // 1-10
  anxiety: number // 1-10
  sleepHours: number
  note?: string
}

export interface ChildProgress {
  /** Child Telegram ID */
  childId: string
  
  /** Child Name */
  childName: string
  
  /** Current Module */
  currentModule: number
  
  /** Completed Lessons */
  completedLessons: number
  
  /** Streak */
  streak: number
  
  /** Last Active */
  lastActive: string
  
  /** Total XP */
  totalXP: number
  
  /** Average Quiz Score */
  avgQuizScore?: number
  
  /** Average Mood (from check-ins) */
  avgMood?: number
  
  /** XP History for charts */
  xpHistory?: Array<{ date: string; xp: number }>
  
  /** Mood History for charts */
  moodHistory?: Array<{ date: string; mood: number; anxiety: number }>
  
  /** Quiz History for charts */
  quizHistory?: Array<{ lesson: string; score: number }>
}

export interface ParentProgress {
  /** Parent Telegram ID */
  parentId: string
  
  /** Parent Name */
  parentName: string
  
  /** Children IDs */
  children: string[]
  
  /** Current Module (for parent lessons) */
  currentModule: number
  
  /** Completed Lessons (parent lessons) */
  completedLessons: number
  
  /** Total Lessons */
  totalLessons: number
  
  /** Last Activity */
  lastActivity: string
}

/**
 * Helper: Create unique lesson ID
 */
export function getLessonId(moduleId: number, lessonIndex: number): string {
  return `module-${moduleId}-lesson-${lessonIndex}`
}

/**
 * Helper: Calculate level from XP
 */
export function getLevelFromXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

/**
 * Helper: Calculate XP needed for next level
 */
export function getXPForNextLevel(level: number): number {
  return (level * level) * 100
}

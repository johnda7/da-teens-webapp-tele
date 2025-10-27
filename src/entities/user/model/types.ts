/**
 * User Entity - Types
 * 
 * Пользовательские данные из Telegram Mini App
 */

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface UserProgress {
  completedLessons: string[]
  currentLesson: string
  xpEarned: number
  skillsUnlocked: number
  streak: number
  totalLessons: number
  checkIns: CheckInData[]
}

export interface CheckInData {
  timestamp: number
  mood: number
  energy: number
  stress: number
  focus: number
  notes?: string
}

export interface UserProfile {
  telegramUser: TelegramUser
  progress: Record<string, UserProgress> // moduleId -> progress
  badges: string[]
  totalXP: number
  joinedAt: number
  lastActiveAt: number
}

// Core Data Types for DA Teens Platform

export interface User {
  id: string
  telegramId: number
  username?: string
  firstName?: string
  lastName?: string
  age: number
  role: 'teen' | 'curator' | 'mentor' | 'admin'
  locale: string
  timezone?: string
  consentParent?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Module {
  id: string
  slug: string
  title: string
  description: string
  orderIndex: number
  totalWeeks: number
  isActive: boolean
  locale: string
  createdAt: Date
}

export interface ModuleWeek {
  id: string
  moduleId: string
  weekNumber: number
  title: string
  description: string
  videoUrl?: string
  videoDuration?: string
  practices: Practice[]
  reflectionQuestions: string[]
  isActive: boolean
}

export interface Practice {
  id?: string
  title: string
  description?: string
  duration: string
  type: 'breathing' | 'meditation' | 'reflection' | 'exercise' | 'journaling'
  steps: string[]
  audioUrl?: string
  isGuided: boolean
}

export interface Cohort {
  id: string
  title: string
  description?: string
  ageRange: [number, number]
  maxParticipants: number
  currentParticipants: number
  startDate: Date
  endDate: Date
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  mentorId: string
  curatorIds: string[]
  telegramGroupId?: number
  timezone: string
  schedulePattern: WeeklySchedule[]
}

export interface WeeklySchedule {
  dayOfWeek: number // 0=Sunday, 1=Monday, etc.
  timeSlot: string // "18:00" format
  duration: number // minutes
  type: 'group_session' | 'mentor_office_hours' | 'peer_chat'
}

export interface Enrollment {
  id: string
  userId: string
  cohortId: string
  status: 'pending' | 'active' | 'completed' | 'dropped' | 'paused'
  joinedAt: Date
  completedAt?: Date
  currentModuleId?: string
  currentWeek?: number
}

export interface Assignment {
  id: string
  cohortId: string
  moduleId: string
  weekNumber: number
  title: string
  description: string
  type: 'reflection' | 'practice' | 'reading' | 'video' | 'group_exercise'
  dueDate: Date
  isRequired: boolean
  maxScore?: number
}

export interface Submission {
  id: string
  assignmentId: string
  userId: string
  content: string
  attachments?: string[]
  submittedAt: Date
  score?: number
  feedback?: string
  status: 'submitted' | 'reviewed' | 'needs_revision' | 'flagged'
  reviewedBy?: string
  reviewedAt?: Date
}

export interface CheckIn {
  id: string
  userId: string
  date: string // YYYY-MM-DD format
  mood: number // 1-5 scale
  anxiety: number // 0-10 scale
  sleepHours: number
  stressLevel?: number // 0-10 scale
  note?: string
  createdAt: Date
}

export interface Badge {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  category: 'milestone' | 'habit' | 'social' | 'achievement' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  criteria: BadgeCriteria
  isActive: boolean
}

export interface BadgeCriteria {
  type: 'count' | 'streak' | 'completion' | 'score' | 'custom'
  target: number
  metric: string // e.g., 'checkins', 'modules_completed', 'group_sessions_attended'
  timeFrame?: 'daily' | 'weekly' | 'monthly' | 'total'
  conditions?: Record<string, any>
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  earnedAt: Date
  progress?: number
  isVisible: boolean
}

export interface CrisisFlag {
  id: string
  userId: string
  level: 'low' | 'medium' | 'high' | 'critical'
  source: 'sos_button' | 'checkin_analysis' | 'submission_content' | 'curator_report'
  description?: string
  context?: Record<string, any>
  status: 'open' | 'in_progress' | 'resolved' | 'escalated'
  assignedTo?: string
  createdAt: Date
  resolvedAt?: Date
  notes?: CrisisNote[]
}

export interface CrisisNote {
  id: string
  flagId: string
  authorId: string
  authorRole: string
  content: string
  isPrivate: boolean
  createdAt: Date
}

export interface GroupSession {
  id: string
  cohortId: string
  moduleId: string
  weekNumber: number
  title: string
  description?: string
  scheduledStart: Date
  scheduledEnd: Date
  actualStart?: Date
  actualEnd?: Date
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
  joinUrl?: string
  recordingUrl?: string
  attendeeIds: string[]
  mentorId: string
  agenda?: SessionAgendaItem[]
}

export interface SessionAgendaItem {
  id: string
  title: string
  duration: number // minutes
  type: 'welcome' | 'discussion' | 'exercise' | 'reflection' | 'closing'
  description?: string
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  provider: 'stripe' | 'telegram_stars' | 'paypal' | 'yukassa'
  providerTransactionId: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  metadata?: Record<string, any>
  createdAt: Date
  completedAt?: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: 'monthly' | 'quarterly' | 'annual' | 'lifetime'
  status: 'active' | 'cancelled' | 'expired' | 'paused'
  startDate: Date
  endDate?: Date
  autoRenew: boolean
  paymentId?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Frontend State Types
export interface UserProfile extends User {
  currentCohort?: Cohort
  currentEnrollment?: Enrollment
  streakDays: number
  totalCheckIns: number
  badgeCount: number
  completedModules: number
}

export interface ModuleProgress {
  moduleId: string
  currentWeek: number
  completedWeeks: number
  totalWeeks: number
  assignments: {
    total: number
    completed: number
    pending: number
  }
  lastActivity?: Date
}

export interface DashboardStats {
  streakDays: number
  totalCheckIns: number
  modulesCompleted: number
  badgesEarned: number
  groupSessionsAttended: number
  upcomingDeadlines: Assignment[]
}

// Telegram Bot Types
export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: {
    id: number
    type: 'private' | 'group' | 'supergroup' | 'channel'
  }
  date: number
  text?: string
}

// Form Types
export interface CheckInFormData {
  mood: number
  anxiety: number
  sleepHours: number
  stressLevel?: number
  note?: string
}

export interface ProfileFormData {
  firstName?: string
  lastName?: string
  age: number
  timezone?: string
  locale: string
  preferences: {
    notificationsEnabled: boolean
    reminderTime?: string
    weeklyReportEnabled: boolean
  }
}

export interface SOSFormData {
  urgency: 'low' | 'medium' | 'high'
  description?: string
  contactPreference: 'chat' | 'call' | 'video'
  isAnonymous: boolean
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
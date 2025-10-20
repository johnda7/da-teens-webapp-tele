/**
 * Check-In Feature - Public API
 * 
 * FSD Layer: Features
 * Feature: check-in (ежедневный чек-ин эмоционального состояния)
 */

// UI Components
export { CheckInPanel, default as CheckInPanelLegacy } from './ui/CheckInPanel'

// Model (types, utils)
export { 
  type CheckInData,
  type CheckInHistory,
  type CheckInFormState,
  MOOD_EMOJIS,
  MOOD_LABELS,
  ANXIETY_LEVELS,
  SLEEP_QUALITY,
  getSleepQuality,
  hasCheckedInToday,
  getCheckInRecommendation,
  calculateAverageMood,
  getMoodTrend
} from './model/types'

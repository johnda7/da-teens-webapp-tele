/**
 * Utility functions for DA Teens platform
 */

import { CheckIn, BadgeCriteria } from '@/lib/types'

/**
 * Date utilities
 */
export const dateUtils = {
  /**
   * Get today's date in YYYY-MM-DD format
   */
  today: (): string => {
    return new Date().toISOString().split('T')[0]
  },

  /**
   * Format date for display
   */
  formatDisplay: (date: string | Date): string => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const dateStr = d.toISOString().split('T')[0]
    const todayStr = today.toISOString().split('T')[0]
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    if (dateStr === todayStr) return 'Today'
    if (dateStr === yesterdayStr) return 'Yesterday'
    if (dateStr === tomorrowStr) return 'Tomorrow'

    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    })
  },

  /**
   * Get days between two dates
   */
  daysBetween: (date1: string | Date, date2: string | Date): number => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  /**
   * Get streak of consecutive days from check-ins
   */
  calculateStreak: (checkIns: CheckIn[]): number => {
    if (checkIns.length === 0) return 0

    const sortedDates = checkIns
      .map(c => c.date)
      .sort()
      .reverse() // Most recent first

    let streak = 0
    const today = dateUtils.today()
    
    // Check if we have a check-in today or yesterday
    const latestDate = sortedDates[0]
    const daysSinceLatest = dateUtils.daysBetween(latestDate, today)
    
    if (daysSinceLatest > 1) return 0 // Streak broken
    
    let expectedDate = today
    for (const date of sortedDates) {
      if (date === expectedDate || (expectedDate === today && date === yesterday())) {
        streak++
        expectedDate = previousDay(expectedDate)
      } else {
        break
      }
    }
    
    return streak
  }
}

/**
 * Helper functions for date calculations
 */
const yesterday = (): string => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

const previousDay = (dateStr: string): string => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

/**
 * Badge and achievement utilities
 */
export const badgeUtils = {
  /**
   * Check if user qualifies for a badge
   */
  checkBadgeEligibility: (
    criteria: BadgeCriteria,
    userStats: Record<string, number>
  ): boolean => {
    const statValue = userStats[criteria.metric] || 0
    
    switch (criteria.type) {
      case 'count':
        return statValue >= criteria.target
      case 'streak':
        return statValue >= criteria.target
      case 'completion':
        return statValue >= criteria.target
      default:
        return false
    }
  },

  /**
   * Calculate progress towards a badge
   */
  calculateBadgeProgress: (
    criteria: BadgeCriteria,
    userStats: Record<string, number>
  ): number => {
    const statValue = userStats[criteria.metric] || 0
    return Math.min(statValue, criteria.target)
  },

  /**
   * Get user's badge progress including earned and in-progress badges
   */
  getUserBadgeProgress: (
    allBadges: Array<{ id: string; criteria: BadgeCriteria }>,
    earnedBadgeIds: string[],
    userStats: Record<string, number>
  ) => {
    return allBadges.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id),
      progress: badgeUtils.calculateBadgeProgress(badge.criteria, userStats),
      maxProgress: badge.criteria.target,
      eligible: badgeUtils.checkBadgeEligibility(badge.criteria, userStats)
    }))
  }
}

/**
 * Wellness and check-in utilities
 */
export const wellnessUtils = {
  /**
   * Analyze mood trends over time
   */
  analyzeMoodTrend: (checkIns: CheckIn[], days: number = 7): {
    average: number
    trend: 'improving' | 'declining' | 'stable'
    recommendation?: string
  } => {
    const recentCheckIns = checkIns
      .filter(c => dateUtils.daysBetween(c.date, dateUtils.today()) <= days)
      .sort((a, b) => a.date.localeCompare(b.date))

    if (recentCheckIns.length < 2) {
      return { average: recentCheckIns[0]?.mood || 3, trend: 'stable' }
    }

    const average = recentCheckIns.reduce((sum, c) => sum + c.mood, 0) / recentCheckIns.length
    const firstHalf = recentCheckIns.slice(0, Math.floor(recentCheckIns.length / 2))
    const secondHalf = recentCheckIns.slice(Math.floor(recentCheckIns.length / 2))
    
    const firstAvg = firstHalf.reduce((sum, c) => sum + c.mood, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, c) => sum + c.mood, 0) / secondHalf.length
    
    const difference = secondAvg - firstAvg
    
    let trend: 'improving' | 'declining' | 'stable'
    let recommendation: string | undefined

    if (difference > 0.5) {
      trend = 'improving'
      recommendation = "Great progress! Keep up the practices that are working for you."
    } else if (difference < -0.5) {
      trend = 'declining'
      recommendation = "It looks like things have been tough lately. Consider reaching out for support or trying some stress-relief practices."
    } else {
      trend = 'stable'
      recommendation = "Your mood has been consistent. Focus on maintaining your current wellness practices."
    }

    return { average, trend, recommendation }
  },

  /**
   * Detect potential crisis indicators
   */
  detectCrisisIndicators: (checkIn: CheckIn): {
    riskLevel: 'low' | 'medium' | 'high'
    indicators: string[]
    recommendations: string[]
  } => {
    const indicators: string[] = []
    const recommendations: string[] = []
    let riskLevel: 'low' | 'medium' | 'high' = 'low'

    if (checkIn.anxiety >= 8) {
      indicators.push('Very high anxiety level')
      recommendations.push('Try a breathing exercise or grounding technique')
      riskLevel = 'medium'
    }

    if (checkIn.mood <= 2) {
      indicators.push('Very low mood')
      recommendations.push('Consider reaching out to a friend or counselor')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    if (checkIn.sleepHours <= 4) {
      indicators.push('Severely disrupted sleep')
      recommendations.push('Prioritize sleep hygiene and relaxation')
    }

    if (checkIn.mood === 1 && checkIn.anxiety >= 7) {
      riskLevel = 'high'
      indicators.push('Combination of very low mood and high anxiety')
      recommendations.push('Please consider reaching out for immediate support')
    }

    // Check note for crisis keywords (simplified)
    if (checkIn.note) {
      const crisisKeywords = ['hopeless', 'worthless', 'hurt myself', 'end it', 'can\'t go on']
      const hasRedFlag = crisisKeywords.some(keyword => 
        checkIn.note!.toLowerCase().includes(keyword)
      )
      
      if (hasRedFlag) {
        riskLevel = 'high'
        indicators.push('Concerning language in reflection')
        recommendations.push('Immediate support is recommended - please reach out to a counselor or crisis line')
      }
    }

    return { riskLevel, indicators, recommendations }
  },

  /**
   * Generate personalized insights
   */
  generateInsights: (checkIns: CheckIn[]): string[] => {
    if (checkIns.length === 0) return []

    const insights: string[] = []
    const recentWeek = checkIns.filter(c => 
      dateUtils.daysBetween(c.date, dateUtils.today()) <= 7
    )

    if (recentWeek.length >= 5) {
      const avgSleep = recentWeek.reduce((sum, c) => sum + c.sleepHours, 0) / recentWeek.length
      if (avgSleep >= 8) {
        insights.push("You've been getting great sleep this week! This often helps with mood and focus.")
      } else if (avgSleep < 6) {
        insights.push("Your sleep has been lower than ideal. Consider setting a consistent bedtime routine.")
      }
    }

    const streak = dateUtils.calculateStreak(checkIns)
    if (streak >= 7) {
      insights.push(`Amazing! You've maintained your check-in streak for ${streak} days. This consistency is building great self-awareness.`)
    }

    return insights
  }
}

/**
 * Module and progress utilities
 */
export const progressUtils = {
  /**
   * Calculate overall program progress
   */
  calculateProgramProgress: (completedModules: number, totalModules: number = 12): {
    percentage: number
    stage: string
    description: string
  } => {
    const percentage = Math.round((completedModules / totalModules) * 100)
    
    let stage: string
    let description: string

    if (percentage === 0) {
      stage = 'Getting Started'
      description = 'Beginning your wellness journey'
    } else if (percentage < 25) {
      stage = 'Building Foundation'
      description = 'Establishing core wellness habits'
    } else if (percentage < 50) {
      stage = 'Growing Skills'
      description = 'Developing emotional and social tools'
    } else if (percentage < 75) {
      stage = 'Applying Knowledge'
      description = 'Integrating skills into daily life'
    } else if (percentage < 100) {
      stage = 'Mastering Wellness'
      description = 'Becoming confident in your abilities'
    } else {
      stage = 'Wellness Graduate'
      description = 'Completed the full journey!'
    }

    return { percentage, stage, description }
  },

  /**
   * Calculate module completion percentage
   */
  calculateModuleProgress: (completedWeeks: number, totalWeeks: number = 3): number => {
    return Math.round((completedWeeks / totalWeeks) * 100)
  }
}

/**
 * Text and content utilities
 */
export const textUtils = {
  /**
   * Truncate text to specified length
   */
  truncate: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  },

  /**
   * Extract mood emoji based on value
   */
  getMoodEmoji: (mood: number): string => {
    switch (mood) {
      case 1: return '😔'
      case 2: return '😕'
      case 3: return '😐'
      case 4: return '🙂'
      case 5: return '😊'
      default: return '😐'
    }
  },

  /**
   * Get anxiety level description
   */
  getAnxietyDescription: (level: number): string => {
    if (level <= 2) return 'Very calm'
    if (level <= 4) return 'Mild anxiety'
    if (level <= 6) return 'Moderate anxiety'
    if (level <= 8) return 'High anxiety'
    return 'Very high anxiety'
  },

  /**
   * Generate encouraging message based on progress
   */
  getEncouragementMessage: (streakDays: number, completedModules: number): string => {
    if (streakDays >= 30) {
      return "Incredible dedication! Your consistency is truly inspiring. 🌟"
    } else if (streakDays >= 14) {
      return "You're building amazing habits! Two weeks of consistency is fantastic. 💪"
    } else if (streakDays >= 7) {
      return "One week streak - you're developing great self-awareness! Keep going! 🚀"
    } else if (completedModules >= 3) {
      return "Look at how much you've learned! Each module brings new growth. 📈"
    } else if (completedModules >= 1) {
      return "Completing your first module is a big achievement! You're building momentum. ⭐"
    } else {
      return "Every journey begins with a single step. You're doing great! 🌱"
    }
  }
}

/**
 * Validation utilities
 */
export const validationUtils = {
  /**
   * Validate check-in data
   */
  validateCheckIn: (data: Partial<CheckIn>): string[] => {
    const errors: string[] = []

    if (!data.mood || data.mood < 1 || data.mood > 5) {
      errors.push('Mood must be between 1 and 5')
    }

    if (data.anxiety === undefined || data.anxiety < 0 || data.anxiety > 10) {
      errors.push('Anxiety level must be between 0 and 10')
    }

    if (!data.sleepHours || data.sleepHours < 0 || data.sleepHours > 20) {
      errors.push('Sleep hours must be between 0 and 20')
    }

    if (data.note && data.note.length > 500) {
      errors.push('Note must be less than 500 characters')
    }

    return errors
  },

  /**
   * Validate age for teen platform
   */
  validateTeenAge: (age: number): boolean => {
    return age >= 13 && age <= 18
  }
}
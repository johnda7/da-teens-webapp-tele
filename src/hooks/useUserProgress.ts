/**
 * useUserProgress - Hook for managing user progress with personalization
 * 
 * Управление персонализированным прогрессом:
 * - Хранение в Telegram CloudStorage
 * - Отслеживание завершенных уроков
 * - Подсчет XP и уровней
 * - Серия дней (streak)
 */

import { useState, useEffect, useCallback } from 'react'
import { useTelegramStorage } from './useTelegramStorage'
import { useTelegram } from './useTelegram'
import type { UserProgress, CheckIn } from '@/types/progress'
import { getLevelFromXP, getLessonId } from '@/types/progress'

const DEFAULT_PROGRESS: Omit<UserProgress, 'userId'> = {
  completedLessons: [],
  quizScores: {},
  timeSpent: {},
  practiceCompleted: {},
  totalXP: 0,
  level: 1,
  streak: 0,
  lastActiveDate: new Date(),
  checkIns: []
}

export function useUserProgress() {
  const { user } = useTelegram()
  const userId = user?.id?.toString() || 'guest'

  const [progress, setProgress, isLoading] = useTelegramStorage<UserProgress>(
    `user-progress-${userId}`,
    {
      userId,
      ...DEFAULT_PROGRESS
    }
  )

  // Update streak on mount
  useEffect(() => {
    if (isLoading) return

    const today = new Date()
    const lastActive = new Date(progress.lastActiveDate)
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) {
      // Same day, no update needed
      return
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      setProgress({
        ...progress,
        streak: progress.streak + 1,
        lastActiveDate: today
      })
    } else if (daysDiff > 1) {
      // Streak broken, reset to 1
      setProgress({
        ...progress,
        streak: 1,
        lastActiveDate: today
      })
    }
  }, [isLoading])

  /**
   * Mark lesson as completed
   */
  const completeLesson = useCallback(
    async (moduleId: number, lessonIndex: number, quizScore?: number, timeSpentMinutes?: number) => {
      const lessonId = getLessonId(moduleId, lessonIndex)

      // XP награда
      const baseXP = 10
      const quizBonus = quizScore ? Math.floor(quizScore * 5) : 0
      const totalXP = progress.totalXP + baseXP + quizBonus

      const updatedProgress: UserProgress = {
        ...progress,
        completedLessons: [...new Set([...progress.completedLessons, lessonId])],
        quizScores: quizScore
          ? { ...progress.quizScores, [lessonId]: quizScore }
          : progress.quizScores,
        timeSpent: timeSpentMinutes
          ? { ...progress.timeSpent, [lessonId]: timeSpentMinutes }
          : progress.timeSpent,
        totalXP,
        level: getLevelFromXP(totalXP),
        lastActiveDate: new Date()
      }

      await setProgress(updatedProgress)
      return updatedProgress
    },
    [progress, setProgress]
  )

  /**
   * Mark practice as completed
   */
  const completePractice = useCallback(
    async (moduleId: number, lessonIndex: number) => {
      const lessonId = getLessonId(moduleId, lessonIndex)
      const practiceXP = 5

      const updatedProgress: UserProgress = {
        ...progress,
        practiceCompleted: { ...progress.practiceCompleted, [lessonId]: true },
        totalXP: progress.totalXP + practiceXP,
        level: getLevelFromXP(progress.totalXP + practiceXP),
        lastActiveDate: new Date()
      }

      await setProgress(updatedProgress)
      return updatedProgress
    },
    [progress, setProgress]
  )

  /**
   * Add check-in
   */
  const addCheckIn = useCallback(
    async (checkIn: CheckIn) => {
      const checkInXP = 3

      const updatedProgress: UserProgress = {
        ...progress,
        checkIns: [...progress.checkIns, checkIn],
        totalXP: progress.totalXP + checkInXP,
        level: getLevelFromXP(progress.totalXP + checkInXP),
        lastActiveDate: new Date()
      }

      await setProgress(updatedProgress)
      return updatedProgress
    },
    [progress, setProgress]
  )

  /**
   * Check if lesson is completed
   */
  const isLessonCompleted = useCallback(
    (moduleId: number, lessonIndex: number) => {
      const lessonId = getLessonId(moduleId, lessonIndex)
      return progress.completedLessons.includes(lessonId)
    },
    [progress.completedLessons]
  )

  /**
   * Get quiz score for lesson
   */
  const getQuizScore = useCallback(
    (moduleId: number, lessonIndex: number) => {
      const lessonId = getLessonId(moduleId, lessonIndex)
      return progress.quizScores[lessonId] || 0
    },
    [progress.quizScores]
  )

  /**
   * Get time spent on lesson
   */
  const getTimeSpent = useCallback(
    (moduleId: number, lessonIndex: number) => {
      const lessonId = getLessonId(moduleId, lessonIndex)
      return progress.timeSpent[lessonId] || 0
    },
    [progress.timeSpent]
  )

  return {
    progress,
    isLoading,
    completeLesson,
    completePractice,
    addCheckIn,
    isLessonCompleted,
    getQuizScore,
    getTimeSpent
  }
}

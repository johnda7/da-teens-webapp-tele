/**
 * useAdaptiveLearning - Hook для адаптивной системы обучения
 * 
 * Интегрирует:
 * - adaptiveLearning.ts (Google Learn Your Way logic)
 * - useUserProgress (Telegram CloudStorage)
 * - Check-ins для эмоционального состояния
 */

import { useState, useCallback, useEffect } from 'react'
import { useUserProgress } from './useUserProgress'
import { adaptiveLearning } from '@/lib/adaptiveLearning'
import type { LessonRecommendation, CheckInData as AdaptiveCheckInData } from '@/lib/adaptiveLearning'
import type { Lesson } from '@/data/boundariesModule'
import boundariesModule from '@/data/boundariesModule'

export function useAdaptiveLearning(moduleId: number = 1) {
  const {
    progress: userProgress,
    isLoading,
    completeLesson,
    completePractice,
    addCheckIn: addCheckInToProgress
  } = useUserProgress()

  const [currentRecommendation, setCurrentRecommendation] = useState<LessonRecommendation | null>(
    null
  )
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false)

  /**
   * Get all lessons for module
   */
  const getAllLessons = useCallback((): Lesson[] => {
    if (moduleId === 1) {
      return boundariesModule.lessons
    }
    // TODO: Add other modules
    return []
  }, [moduleId])

  /**
   * Convert UserProgress to AdaptiveLearning format
   */
  const convertToAdaptiveProgress = useCallback(
    (checkIn?: AdaptiveCheckInData) => {
      return {
        userId: userProgress.userId,
        completedLessons: userProgress.completedLessons,
        quizScores: userProgress.quizScores,
        timeSpent: userProgress.timeSpent,
        practiceCompleted: userProgress.practiceCompleted,
        checkIns: [
          ...userProgress.checkIns.map((ci) => ({
            mood: ci.mood,
            anxiety: ci.anxiety,
            sleepHours: ci.sleepHours,
            energy: 7, // Default energy
            note: ci.note,
            timestamp: new Date(ci.date)
          })),
          ...(checkIn ? [checkIn] : [])
        ],
        lastActiveDate: new Date(userProgress.lastActiveDate),
        streak: userProgress.streak
      }
    },
    [userProgress]
  )

  /**
   * Get next lesson recommendation
   */
  const getNextLesson = useCallback(
    async (checkIn?: AdaptiveCheckInData) => {
      setIsLoadingRecommendation(true)

      try {
        const lessons = getAllLessons()
        const adaptiveProgress = convertToAdaptiveProgress(checkIn)

        const recommendation = await adaptiveLearning.selectNextLesson(
          lessons,
          adaptiveProgress,
          checkIn
        )

        setCurrentRecommendation(recommendation)
        return recommendation
      } catch (error) {
        console.error('[useAdaptiveLearning] Error getting next lesson:', error)
        return null
      } finally {
        setIsLoadingRecommendation(false)
      }
    },
    [getAllLessons, convertToAdaptiveProgress]
  )

  /**
   * Complete lesson with adaptive tracking
   */
  const completeLessonAdaptive = useCallback(
    async (lessonIndex: number, quizScore?: number, timeSpentMinutes?: number) => {
      const updatedProgress = await completeLesson(moduleId, lessonIndex, quizScore, timeSpentMinutes)
      
      // Get next recommendation after completing lesson
      await getNextLesson()
      
      return updatedProgress
    },
    [moduleId, completeLesson, getNextLesson]
  )

  /**
   * Complete practice with adaptive tracking
   */
  const completePracticeAdaptive = useCallback(
    async (lessonIndex: number) => {
      const updatedProgress = await completePractice(moduleId, lessonIndex)
      return updatedProgress
    },
    [moduleId, completePractice]
  )

  /**
   * Add check-in and update recommendation
   */
  const addCheckIn = useCallback(
    async (mood: number, anxiety: number, sleepHours: number, note?: string) => {
      const checkIn = {
        date: new Date().toISOString(),
        mood,
        anxiety,
        sleepHours,
        note
      }

      await addCheckInToProgress(checkIn)

      // Update recommendation based on new emotional state
      const adaptiveCheckIn: AdaptiveCheckInData = {
        mood,
        anxiety,
        sleepHours,
        energy: mood, // Use mood as energy proxy
        note,
        timestamp: new Date()
      }

      await getNextLesson(adaptiveCheckIn)
    },
    [addCheckInToProgress, getNextLesson]
  )

  /**
   * Get lesson by index
   */
  const getLessonByIndex = useCallback(
    (index: number): Lesson | null => {
      const lessons = getAllLessons()
      return lessons[index] || null
    },
    [getAllLessons]
  )

  /**
   * Check if lesson is unlocked
   */
  const isLessonUnlocked = useCallback(
    (lessonIndex: number): boolean => {
      // First lesson always unlocked
      if (lessonIndex === 0) return true

      // Check if previous lesson is completed
      const lessonId = `module-${moduleId}-lesson-${lessonIndex - 1}`
      return userProgress.completedLessons.includes(lessonId)
    },
    [moduleId, userProgress.completedLessons]
  )

  /**
   * Get completion percentage for module
   */
  const getModuleCompletionPercentage = useCallback((): number => {
    const totalLessons = getAllLessons().length
    if (totalLessons === 0) return 0

    const completedCount = getAllLessons().filter((_, index) => {
      const lessonId = `module-${moduleId}-lesson-${index}`
      return userProgress.completedLessons.includes(lessonId)
    }).length

    return Math.round((completedCount / totalLessons) * 100)
  }, [moduleId, getAllLessons, userProgress.completedLessons])

  return {
    // Progress data
    userProgress,
    isLoading,
    
    // Recommendation
    currentRecommendation,
    isLoadingRecommendation,
    getNextLesson,
    
    // Actions
    completeLesson: completeLessonAdaptive,
    completePractice: completePracticeAdaptive,
    addCheckIn,
    
    // Helpers
    getLessonByIndex,
    isLessonUnlocked,
    getModuleCompletionPercentage,
    
    // Module info
    totalLessons: getAllLessons().length
  }
}

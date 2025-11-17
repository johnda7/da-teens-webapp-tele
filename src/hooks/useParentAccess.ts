/**
 * useParentAccess - Hook for parents to view children's progress
 * 
 * Родительский доступ к прогрессу детей:
 * - Просмотр прогресса каждого ребенка
 * - Агрегированная статистика
 * - Linking детей к родительскому аккаунту
 */

import { useState, useEffect, useCallback } from 'react'
import { useTelegramStorage } from './useTelegramStorage'
import { useTelegram } from './useTelegram'
import type { ChildProgress, ParentProgress, UserProgress } from '@/types/progress'

export function useParentAccess() {
  const { user } = useTelegram()
  const parentId = user?.id?.toString() || 'guest'

  const [parentProgress, setParentProgress, isLoadingParent] = useTelegramStorage<ParentProgress>(
    `parent-progress-${parentId}`,
    {
      parentId,
      parentName: user?.first_name || 'Родитель',
      children: [],
      currentModule: 13, // Module 13 = "Личные границы" для родителей
      completedLessons: 0,
      totalLessons: 5,
      lastActivity: new Date().toISOString()
    }
  )

  const [childrenProgress, setChildrenProgress] = useState<ChildProgress[]>([])
  const [isLoadingChildren, setIsLoadingChildren] = useState(true)

  /**
   * Load children progress from CloudStorage
   */
  useEffect(() => {
    if (isLoadingParent || parentProgress.children.length === 0) {
      setIsLoadingChildren(false)
      return
    }

    const loadChildrenProgress = async () => {
      setIsLoadingChildren(true)

      // В реальном приложении здесь будет запрос к CloudStorage для каждого ребенка
      // Сейчас используем mock данные
      const mockChildren: ChildProgress[] = parentProgress.children.map((childId, index) => ({
        childId,
        childName: `Ребенок ${index + 1}`,
        currentModule: 1,
        completedLessons: Math.floor(Math.random() * 5),
        streak: Math.floor(Math.random() * 10),
        lastActive: 'сегодня',
        totalXP: Math.floor(Math.random() * 200),
        avgQuizScore: Math.floor(Math.random() * 50) + 50,
        avgMood: Math.floor(Math.random() * 3) + 7
      }))

      setChildrenProgress(mockChildren)
      setIsLoadingChildren(false)
    }

    loadChildrenProgress()
  }, [isLoadingParent, parentProgress.children])

  /**
   * Link child to parent account
   */
  const linkChild = useCallback(
    async (childId: string, childName: string) => {
      if (parentProgress.children.includes(childId)) {
        return { success: false, message: 'Ребенок уже добавлен' }
      }

      const updatedParentProgress: ParentProgress = {
        ...parentProgress,
        children: [...parentProgress.children, childId]
      }

      await setParentProgress(updatedParentProgress)

      // Add child to children progress
      const newChild: ChildProgress = {
        childId,
        childName,
        currentModule: 1,
        completedLessons: 0,
        streak: 0,
        lastActive: 'никогда',
        totalXP: 0
      }

      setChildrenProgress([...childrenProgress, newChild])

      return { success: true, message: 'Ребенок добавлен' }
    },
    [parentProgress, setParentProgress, childrenProgress]
  )

  /**
   * Unlink child from parent account
   */
  const unlinkChild = useCallback(
    async (childId: string) => {
      const updatedParentProgress: ParentProgress = {
        ...parentProgress,
        children: parentProgress.children.filter((id) => id !== childId)
      }

      await setParentProgress(updatedParentProgress)
      setChildrenProgress(childrenProgress.filter((child) => child.childId !== childId))

      return { success: true, message: 'Ребенок удален' }
    },
    [parentProgress, setParentProgress, childrenProgress]
  )

  /**
   * Get aggregated statistics for all children
   */
  const getAggregatedStats = useCallback(() => {
    const totalChildren = childrenProgress.length
    const totalCompletedLessons = childrenProgress.reduce(
      (sum, child) => sum + child.completedLessons,
      0
    )
    const avgStreak =
      totalChildren > 0
        ? Math.floor(
            childrenProgress.reduce((sum, child) => sum + child.streak, 0) / totalChildren
          )
        : 0
    const totalXP = childrenProgress.reduce((sum, child) => sum + child.totalXP, 0)
    const avgQuizScore =
      childrenProgress.filter((c) => c.avgQuizScore).length > 0
        ? Math.floor(
            childrenProgress
              .filter((c) => c.avgQuizScore)
              .reduce((sum, child) => sum + (child.avgQuizScore || 0), 0) /
              childrenProgress.filter((c) => c.avgQuizScore).length
          )
        : 0

    return {
      totalChildren,
      totalCompletedLessons,
      avgStreak,
      totalXP,
      avgQuizScore
    }
  }, [childrenProgress])

  /**
   * Complete parent lesson
   */
  const completeParentLesson = useCallback(
    async (lessonIndex: number) => {
      const updatedParentProgress: ParentProgress = {
        ...parentProgress,
        completedLessons: Math.max(parentProgress.completedLessons, lessonIndex + 1),
        lastActivity: new Date().toISOString()
      }

      await setParentProgress(updatedParentProgress)
      return updatedParentProgress
    },
    [parentProgress, setParentProgress]
  )

  return {
    parentProgress,
    childrenProgress,
    isLoading: isLoadingParent || isLoadingChildren,
    linkChild,
    unlinkChild,
    getAggregatedStats,
    completeParentLesson
  }
}

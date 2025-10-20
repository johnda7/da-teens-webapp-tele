/**
 * Main App Component (FSD Architecture)
 * 
 * FSD Layer: App
 * Главный компонент приложения с роутингом между страницами
 */

import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTelegram } from '@/hooks/useTelegram'
import { AppProvider } from './providers'
import { DashboardPage } from '@/pages/dashboard'
import { ModulePage } from '@/pages/module'
import type { CheckInData } from '@/features/check-in'
import { toast } from 'sonner'

// Import styles
import './styles/index.css'
import './styles/main.css'
import './styles/theme.css'

interface UserProfile {
  name: string
  age: number
  currentModule: number
  currentWeek: number
  completedModules: number
  streak: number
  cohortId: string
}

interface AdaptiveProgress {
  completedLessons: string[]
  quizScores: Record<string, number>
  timeSpent: Record<string, number>
  practiceCompleted: Record<string, boolean>
  totalXP: number
  level: number
}

type AppView = 'dashboard' | 'module'

function App() {
  const { user } = useTelegram()
  const [view, setView] = useState<AppView>('dashboard')
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
  
  const defaultName = user?.first_name || 'Алекс'
  
  // User Profile KV
  const [userProfile, setUserProfile] = useKV<UserProfile>('user-profile', {
    name: defaultName,
    age: 16,
    currentModule: 1,
    currentWeek: 2,
    completedModules: 0,
    streak: 7,
    cohortId: 'teens-14-16-cohort-a'
  })
  
  // Adaptive Progress KV
  const [adaptiveProgress, setAdaptiveProgress] = useKV<AdaptiveProgress>('adaptive-progress', {
    completedLessons: [],
    quizScores: {},
    timeSpent: {},
    practiceCompleted: {},
    totalXP: 0,
    level: 1
  })
  
  // User Badges KV
  const [userBadges, setUserBadges] = useKV<string[]>('user-badges', ['first-step', 'check-in-streak-7'])
  
  // Check-In Data KV
  const [lastCheckIn, setLastCheckIn] = useKV<CheckInData | null>('last-checkin', null)
  const [checkIns, setCheckIns] = useKV<CheckInData[]>('check-ins', [])

  // Update user name from Telegram
  useEffect(() => {
    if (user && userProfile && userProfile.name !== user.first_name) {
      setUserProfile({
        ...userProfile,
        name: user.first_name
      })
    }
  }, [user, userProfile, setUserProfile])

  // Handlers
  const handleModuleSelect = (moduleId: number) => {
    setSelectedModuleId(moduleId)
    setView('module')
  }

  const handleBackToDashboard = () => {
    setSelectedModuleId(null)
    setView('dashboard')
  }

  const handleCheckIn = (data: CheckInData) => {
    setLastCheckIn(data)
    setCheckIns([...(checkIns || []), data])
    toast.success('Чек-ин сохранён!', {
      description: 'Спасибо за твою честность 💙'
    })
  }

  const handleLessonComplete = async (score: number) => {
    if (!adaptiveProgress || !userBadges) return

    try {
      const earnedXP = Math.round(score * 10)
      const newTotalXP = adaptiveProgress.totalXP + earnedXP
      const newLevel = Math.floor(Math.sqrt(newTotalXP / 100)) + 1
      
      // Update adaptive progress
      const lessonId = `boundaries-${adaptiveProgress.completedLessons.length + 1}`
      const newProgress = {
        ...adaptiveProgress,
        completedLessons: [...adaptiveProgress.completedLessons, lessonId],
        quizScores: { ...adaptiveProgress.quizScores, [lessonId]: score },
        totalXP: newTotalXP,
        level: newLevel
      }
      setAdaptiveProgress(newProgress)

      // Check for new badges
      const allLessonsCompleted = newProgress.completedLessons.length
      const newBadges: string[] = []

      if (allLessonsCompleted === 1 && !userBadges.includes('first-adaptive-lesson')) {
        newBadges.push('first-adaptive-lesson')
      }

      if (score >= 90 && !userBadges.includes('perfect-score')) {
        newBadges.push('perfect-score')
      }

      if (allLessonsCompleted === 9 && !userBadges.includes('boundaries-master')) {
        newBadges.push('boundaries-master')
      }

      if (newBadges.length > 0) {
        setUserBadges([...userBadges, ...newBadges])
        
        setTimeout(() => {
          newBadges.forEach(badgeId => {
            toast.success(`🏆 Новый бейдж: ${badgeId}!`, {
              duration: 5000
            })
          })
        }, 1000)
      }

      // Main success message
      toast.success('Отличная работа! 🎉', {
        description: `+${earnedXP} XP • Уровень ${newProgress.level} • ${allLessonsCompleted}/9 уроков`
      })

      // Special celebration for module completion
      if (allLessonsCompleted === 9) {
        setTimeout(() => {
          toast.success('🎊 ПОЗДРАВЛЯЕМ! 🎊', {
            description: 'Ты прошёл все уроки модуля "Личные границы"!',
            duration: 10000
          })
        }, 2000)
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
      toast.error('Ошибка сохранения', {
        description: 'Попробуй ещё раз'
      })
    }
  }

  return (
    <AppProvider>
      {view === 'dashboard' && userProfile && adaptiveProgress && userBadges && (
        <DashboardPage
          userProfile={userProfile}
          adaptiveProgress={adaptiveProgress}
          userBadges={userBadges}
          lastCheckIn={lastCheckIn || null}
          onModuleSelect={handleModuleSelect}
          onCheckIn={handleCheckIn}
        />
      )}

      {view === 'module' && selectedModuleId && userProfile && adaptiveProgress && checkIns && (
        <ModulePage
          moduleId={selectedModuleId}
          userProfile={{
            name: userProfile.name,
            streak: userProfile.streak
          }}
          adaptiveProgress={adaptiveProgress}
          lastCheckIn={lastCheckIn || null}
          checkIns={checkIns}
          onBack={handleBackToDashboard}
          onLessonComplete={handleLessonComplete}
        />
      )}
    </AppProvider>
  )
}

export default App

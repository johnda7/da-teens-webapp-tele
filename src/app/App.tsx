/**
 * Main App Component (FSD Architecture - App Layer)
 * 
 * Главный компонент с полной функциональностью:
 * - 5 табов: dashboard, checkin, cohort, badges, profile
 * - Adaptive Learning Engine
 * - Gamification System
 * - Check-in tracking
 * - Module #13 (Boundaries) integration
 */

import { useState, useEffect, memo, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BookOpen, Heart, Users, Trophy, Target, Brain, ArrowLeft, Shield, Flame, Lightning, CheckCircle, Play } from '@phosphor-icons/react'
// Lazy imports for better performance - Perplexity Speed Principle
import { lazy, Suspense } from 'react'

const UniversalModuleViewer = lazy(() => import('@/components/UniversalModuleViewer'))
const ModuleGrid = lazy(() => import('@/components/ModuleGrid'))
const CheckInPanel = lazy(() => import('@/components/CheckInPanel'))
const CohortSchedule = lazy(() => import('@/components/CohortSchedule'))
const BadgeGrid = lazy(() => import('@/components/BadgeGrid'))
const ProgressStats = lazy(() => import('@/components/ProgressStats'))
const DashboardHero = lazy(() => import('@/components/DashboardHero'))
const DailyRecommendationCard = lazy(() => import('@/components/DailyRecommendationCard'))
const RoleBasedLayout = lazy(() => import('@/components/RoleBasedLayout'))
const ParentDashboard = lazy(() => import('@/components/ParentDashboard'))
const ParentBoundariesModule = lazy(() => import('@/components/ParentBoundariesModule'))
import { useTelegram } from '@/hooks/useTelegram'
import boundariesModule from '@/data/boundariesModule'
import { adaptiveLearning } from '@/lib/adaptiveLearning'
import type { LessonRecommendation, CheckInData as AdaptiveCheckInData } from '@/lib/adaptiveLearning'

// Import styles
import './styles/index.css'
import './styles/main.css'
import './styles/theme.css'

// Types
interface UserProfile {
  name: string
  age: number
  currentModule: number
  currentWeek: number
  completedModules: number
  streak: number
  cohortId: string
  role?: 'teen' | 'parent' // ✨ Added role for parents/teens
  children?: string[] // Array of child Telegram IDs (for parents)
}

interface AdaptiveProgress {
  completedLessons: string[]
  quizScores: Record<string, number>
  timeSpent: Record<string, number>
  practiceCompleted: Record<string, boolean>
  totalXP: number
  level: number
}

interface CheckInData {
  date: string
  mood: number
  anxiety: number
  sleepHours: number
  note?: string
}

export function App() {
  const { user, isTelegramWebApp, isMobile, isSmallMobile, viewportHeight } = useTelegram()
  
  // Pull-to-refresh functionality
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  
  // Pull-to-refresh handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast.success('Обновлено!')
  }, [])
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPullDistance(e.touches[0].clientY)
    }
  }, [])
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0 && pullDistance > 0) {
      const currentY = e.touches[0].clientY
      const diff = Math.max(0, currentY - pullDistance)
      if (diff > 0) {
        e.preventDefault()
        if (diff > 100) {
          handleRefresh()
        }
      }
    }
  }, [pullDistance, handleRefresh])
  
  const handleTouchEnd = useCallback(() => {
    setPullDistance(0)
  }, [])
  const defaultName = user?.first_name || 'Алекс'
  
  // Dev mode - только для разработчиков (по умолчанию OFF на production)
  const isDevMode = typeof window !== 'undefined' && 
    localStorage.getItem('devMode') === 'true'

  // Feature flag для системы ролей
  const ENABLE_PARENT_ROLES = false // ДЕМО ДЛЯ РОДИТЕЛЕЙ

  // Tab navigation
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [showParentModule, setShowParentModule] = useState(false) // ✨ For parent lessons
  const [demoRole, setDemoRole] = useState<'teen' | 'parent'>('teen') // ДЕМО: переключатель ролей
  const [currentLesson, setCurrentLesson] = useState<LessonRecommendation | null>(null)
  const [isLoadingLesson, setIsLoadingLesson] = useState(false)

  // User data with KV storage
  const [userProfile, setUserProfile] = useKV<UserProfile>('user-profile', {
    name: defaultName,
    age: 16,
    currentModule: 1,
    currentWeek: 2,
    completedModules: 0,
    streak: 7,
    cohortId: 'teens-14-16-cohort-a',
    role: 'teen' as const, // Default
    children: [] // Empty for teens, populated for parents
  })

  const [userBadges, setUserBadges] = useKV<string[]>('user-badges', ['first-step', 'check-in-streak-7'])
  const [lastCheckIn, setLastCheckIn] = useKV<CheckInData | null>('last-checkin', null)
  
  const [adaptiveProgress, setAdaptiveProgress] = useKV<AdaptiveProgress>('adaptive-progress', {
    completedLessons: [],
    quizScores: {},
    timeSpent: {},
    practiceCompleted: {},
    totalXP: 0,
    level: 1
  })

  const [checkIns, setCheckIns] = useState<CheckInData[]>([])

  // Sync Telegram user name with profile
  useEffect(() => {
    if (user && userProfile && userProfile.name !== user.first_name) {
      setUserProfile({
        ...userProfile,
        name: user.first_name
      })
    }
  }, [user, userProfile, setUserProfile])

  // Removed auto-select lesson - user should click to start
  // useEffect(() => {
  //   if (selectedModule === 1 && !currentLesson) {
  //     selectNextLesson()
  //   }
  // }, [selectedModule])

  // Adaptive Learning Functions - оптимизировано с useCallback
  const selectNextLesson = useCallback(async () => {
    setIsLoadingLesson(true)
    try {
      // Create default check-in if none exists
      const defaultCheckIn: AdaptiveCheckInData = lastCheckIn ? {
        mood: lastCheckIn.mood,
        anxiety: lastCheckIn.anxiety,
        sleepHours: lastCheckIn.sleepHours,
        energy: 7,
        note: lastCheckIn.note,
        timestamp: new Date(lastCheckIn.date)
      } : {
        mood: 7,
        anxiety: 5,
        sleepHours: 7,
        energy: 7,
        note: 'Начальное состояние',
        timestamp: new Date()
      }
      
      const adaptiveCheckIns: AdaptiveCheckInData[] = checkIns.map(ci => ({
        mood: ci.mood,
        anxiety: ci.anxiety,
        sleepHours: ci.sleepHours,
        energy: 7,
        note: ci.note,
        timestamp: new Date(ci.date)
      }))
      
      const userProgressData = {
        userId: user?.id?.toString() || 'guest',
        completedLessons: [],
        quizScores: {},
        timeSpent: {},
        practiceCompleted: {},
        checkIns: adaptiveCheckIns.length > 0 ? adaptiveCheckIns : [defaultCheckIn],
        lastActiveDate: new Date(),
        streak: userProfile?.streak || 0
      }
      
      const recommendation = await adaptiveLearning.selectNextLesson(
        boundariesModule.lessons,
        userProgressData,
        defaultCheckIn
      )
      
      setCurrentLesson(recommendation)
      
      if (!lastCheckIn) {
        toast.info('Используем стандартные настройки', {
          description: 'Пройди check-in для более точных рекомендаций'
        })
      } else {
        toast.success(`Рекомендуем: ${recommendation.lesson.title}`, {
          description: recommendation.reason
        })
      }
    } catch (error) {
      console.error('Error selecting lesson:', error)
      toast.error('Ошибка при выборе урока', {
        description: 'Попробуй ещё раз'
      })
    } finally {
      setIsLoadingLesson(false)
    }
  }, [lastCheckIn, checkIns, user?.id, userProfile?.streak, adaptiveLearning, boundariesModule.lessons])

  const handleLessonComplete = useCallback(async (score: number) => {
    if (!currentLesson || !adaptiveProgress || !userBadges) return

    try {
      const lessonId = currentLesson.lesson.id
      const earnedXP = Math.round(score * 10)
      const newTotalXP = adaptiveProgress.totalXP + earnedXP
      const newLevel = Math.floor(Math.sqrt(newTotalXP / 100)) + 1
      
      // Update adaptive progress
      const newProgress = {
        completedLessons: [...adaptiveProgress.completedLessons, lessonId],
        quizScores: { ...adaptiveProgress.quizScores, [lessonId]: score },
        timeSpent: adaptiveProgress.timeSpent,
        practiceCompleted: adaptiveProgress.practiceCompleted,
        totalXP: newTotalXP,
        level: newLevel
      }
      setAdaptiveProgress(newProgress)

      // Check for new badges
      const allLessonsCompleted = newProgress.completedLessons.length
      const newBadges: string[] = []

      // First lesson badge
      if (allLessonsCompleted === 1 && !userBadges.includes('first-adaptive-lesson')) {
        newBadges.push('first-adaptive-lesson')
      }

      // Perfect score badge
      if (score >= 90 && !userBadges.includes('perfect-score')) {
        newBadges.push('perfect-score')
      }

      // Module completion badge (all 9 lessons)
      if (allLessonsCompleted === 9 && !userBadges.includes('boundaries-master')) {
        newBadges.push('boundaries-master')
      }

      // Consistency badge (3 lessons in a row)
      if (allLessonsCompleted >= 3 && !userBadges.includes('consistent-learner')) {
        newBadges.push('consistent-learner')
      }

      if (newBadges.length > 0) {
        setUserBadges([...userBadges, ...newBadges])
        
        // Show badge notifications
        setTimeout(() => {
          newBadges.forEach(badgeId => {
            const badgeInfo = getBadgeInfo(badgeId)
            toast.success(`🏆 Новый бейдж: ${badgeInfo.name}!`, {
              description: badgeInfo.description,
              duration: 5000
            })
          })
        }, 1000)
      }

      // Main success message
      const messages = [
        'Отличная работа! 🎉',
        'Ты молодец! 🌟',
        'Супер результат! ⭐',
        'Браво! 👏',
        'Потрясающе! 🚀'
      ]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]

      toast.success(randomMessage, {
        description: `+${earnedXP} XP • Уровень ${newProgress.level} • ${allLessonsCompleted}/9 уроков`
      })

      // Special celebration for completing all lessons
      if (allLessonsCompleted === 9) {
        setTimeout(() => {
          toast.success('🎊 ПОЗДРАВЛЯЕМ! 🎊', {
            description: 'Ты прошёл все уроки модуля "Личные границы"! Теперь ты знаешь, как защищать своё пространство и говорить "нет".',
            duration: 10000
          })
        }, 2000)
      }

      // Update user profile streak and stats
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          streak: userProfile.streak + 1,
          completedModules: allLessonsCompleted === 9 ? userProfile.completedModules + 1 : userProfile.completedModules
        })
      }

      // Reset lesson state
      setTimeout(() => {
        setCurrentLesson(null)
        setSelectedModule(null)
      }, 500)

    } catch (error) {
      console.error('Error completing lesson:', error)
      toast.error('Ошибка при сохранении прогресса', {
        description: 'Но урок пройден! Попробуй перезагрузить страницу'
      })
    }
  }, [currentLesson, adaptiveProgress, userBadges, setAdaptiveProgress, setUserBadges, setUserProfile, userProfile])

  // Helper function to get badge info - оптимизировано с useMemo
  const getBadgeInfo = useCallback((badgeId: string) => {
    const badges: Record<string, { name: string; description: string }> = {
      'first-adaptive-lesson': {
        name: 'Первый шаг',
        description: 'Прошёл первый адаптивный урок'
      },
      'perfect-score': {
        name: 'Перфекционист',
        description: 'Набрал 90+ баллов в квизе'
      },
      'boundaries-master': {
        name: 'Мастер границ',
        description: 'Прошёл все уроки модуля "Личные границы"'
      },
      'consistent-learner': {
        name: 'Последовательный',
        description: 'Прошёл 3 урока подряд'
      },
      'first-step': {
        name: 'Первый шаг',
        description: 'Начал обучение'
      },
      'check-in-streak-7': {
        name: 'Неделя чек-инов',
        description: 'Делал чек-ин 7 дней подряд'
      }
    }
    return badges[badgeId] || { name: badgeId, description: '' }
  }, [])

  return (
    <div 
      className={`min-h-screen relative overflow-hidden telegram-webapp ${isMobile ? 'mobile-typography' : ''}`} 
      style={{ minHeight: `${viewportHeight}px` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Optimized Static Background - Perplexity Speed Principle */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Static subtle pattern instead of heavy animations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-cyan-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-sky-200 rounded-full blur-xl"></div>
        </div>
      </div>
        
      {/* Pull-to-refresh indicator */}
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white text-center py-2 text-sm"
        >
          Обновление...
        </motion.div>
      )}

      {/* Header - Telegram Wallet Style (Compact) - скрываем когда открыт урок */}
      {!selectedModule && (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-2">
            {/* Left: Title only (минимализм как в Wallet) */}
            <div>
              <h1 className="text-base font-semibold text-gray-900">AI Подросток</h1>
              <p className="text-[11px] text-gray-500">Неделя {userProfile?.currentWeek || 1} • День {userProfile?.streak || 0}</p>
          </div>
          
          {/* Center: DEMO Role Switcher */}
          {ENABLE_PARENT_ROLES && (
            <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setDemoRole('teen')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  demoRole === 'teen' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👤 Teen
              </button>
              <button
                onClick={() => setDemoRole('parent')}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  demoRole === 'parent' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                👨‍👩‍👧‍👦 Parent
              </button>
            </div>
          )}
          
            {/* Right: Profile (компактно) */}
            <button
            onClick={() => setActiveTab('profile')}
              className="relative w-8 h-8 rounded-full overflow-hidden"
          >
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
            </button>
        </div>
      </header>
      )}

      {/* Main Content */}
      <main className={`mobile-scroll ${isMobile ? 'pb-16 mobile-spacing' : 'p-2 md:p-3 pb-4'} space-y-2`}>
        {/* Parent Module Viewer - when showParentModule is true */}
        {showParentModule && (
          <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
            <ParentBoundariesModule onBack={() => setShowParentModule(false)} />
          </Suspense>
        )}

        {/* Role-Based Layout Integration */}
        {!showParentModule && ENABLE_PARENT_ROLES ? (
          <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
            <RoleBasedLayout
              userProfile={{ ...userProfile, role: demoRole }}
              teenDashboard={
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* Tab Navigation - Telegram Wallet Style (адаптивный) */}
                  <TabsList className={`${isMobile ? 'fixed bottom-0 left-0 right-0 h-14 mobile-nav mobile-tabs' : 'relative h-12 mt-4'} rounded-lg border-t bg-white z-50 grid grid-cols-5`}>
                    <TabsTrigger value="dashboard" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                      <BookOpen weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                      <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Модули</span>
                    </TabsTrigger>
                    <TabsTrigger value="checkin" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                      <Heart weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                      <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Чек-ин</span>
                    </TabsTrigger>
                    <TabsTrigger value="cohort" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                      <Users weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                      <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Группа</span>
                    </TabsTrigger>
                    <TabsTrigger value="badges" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                      <Trophy weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                      <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Награды</span>
                    </TabsTrigger>
                    <TabsTrigger value="profile" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                      <Target weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                      <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Прогресс</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Contents */}
                  <TabsContent value="dashboard" className="mt-0 p-4">
                    {selectedModule ? (
                      <UniversalModuleViewer 
                        moduleId={selectedModule} 
                        onBack={() => setSelectedModule(null)} 
                      />
                    ) : (
                      <>
                        {/* Compact Stats Grid - Telegram Wallet Style */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-orange-100 flex items-center justify-center">
                              <Flame className="w-6 h-6 text-orange-600" weight="fill" />
                            </div>
                            <div className="text-base font-bold text-gray-900">{userProfile?.streak || 0}</div>
                            <div className="text-[10px] text-gray-500">дней</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                              <Lightning className="w-6 h-6 text-blue-600" weight="fill" />
                            </div>
                            <div className="text-base font-bold text-gray-900">{adaptiveProgress?.totalXP || 0}</div>
                            <div className="text-[10px] text-gray-500">XP</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
                            </div>
                            <div className="text-base font-bold text-gray-900">{userProfile?.completedModules || 0}</div>
                            <div className="text-[10px] text-gray-500">модулей</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-purple-100 flex items-center justify-center">
                              <Users className="w-6 h-6 text-purple-600" weight="fill" />
                            </div>
                            <div className="text-base font-bold text-gray-900">A</div>
                            <div className="text-[10px] text-gray-500">группа</div>
                          </div>
                        </div>

                        {/* Quick Actions - Круглые кнопки как в Telegram Wallet */}
                        <div className="grid grid-cols-4 gap-3 mb-5">
                          <button 
                            onClick={() => {
                            if (userProfile?.currentModule) {
                              setSelectedModule(userProfile.currentModule)
                            }
                          }}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                              <Play className="w-7 h-7 text-white" weight="fill" />
                            </div>
                            <span className="text-[11px] text-gray-700 font-medium">Учиться</span>
                          </button>
                          
                          <button 
                            onClick={() => setActiveTab('checkin')}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                              <Heart className="w-7 h-7 text-white" weight="fill" />
                                  </div>
                            <span className="text-[11px] text-gray-700 font-medium">Чек-ин</span>
                          </button>
                          
                          <button 
                            onClick={() => setActiveTab('cohort')}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                              <Users className="w-7 h-7 text-white" weight="fill" />
                                </div>
                            <span className="text-[11px] text-gray-700 font-medium">Группа</span>
                          </button>
                          
                          <button 
                            onClick={() => setActiveTab('badges')}
                            className="flex flex-col items-center gap-1.5"
                          >
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                              <Trophy className="w-7 h-7 text-white" weight="fill" />
                              </div>
                            <span className="text-[11px] text-gray-700 font-medium">Награды</span>
                          </button>
                                  </div>

                        {/* Показываем только модуль "Личные границы" для учеников */}
                        {isDevMode ? (
                          <ModuleGrid 
                            currentModule={userProfile?.currentModule || 1}
                            onModuleSelect={setSelectedModule}
                          />
                        ) : (
                          <Card className="bg-white border border-gray-200 overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Shield className="w-6 h-6 text-white" weight="fill" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-base font-semibold text-gray-900 mb-0.5">Личные границы</h3>
                                  <p className="text-xs text-gray-500">9 уроков • 3 недели • 12+ лет</p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">
                                Научись устанавливать здоровые границы в отношениях
                              </p>
                              
                              <button 
                                  onClick={() => setSelectedModule(1)}
                                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                                >
                                Начать обучение
                              </button>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="checkin" className="mt-0">
                    <CheckInPanel 
                      onCheckIn={(data: CheckInData) => setLastCheckIn(data)} 
                      lastCheckIn={lastCheckIn || null} 
                    />
                  </TabsContent>

                  <TabsContent value="cohort" className="mt-0">
                    <CohortSchedule cohortId={userProfile?.cohortId || ''} />
                  </TabsContent>

                  <TabsContent value="badges" className="mt-0 p-4">
                    <BadgeGrid userBadges={userBadges || []} />
                  </TabsContent>

                  <TabsContent value="profile" className="mt-0">
                    <ProgressStats 
                      userProfile={userProfile || {
                        name: defaultName,
                        age: 16,
                        currentModule: 1,
                        currentWeek: 2,
                        completedModules: 0,
                        streak: 7,
                        cohortId: 'teens-14-16-cohort-a'
                      }} 
                      checkIns={lastCheckIn ? [lastCheckIn] : []} 
                      badgeCount={userBadges?.length || 0}
                    />
                  </TabsContent>
                </Tabs>
              }
              parentDashboard={
                <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
                  <ParentDashboard 
                    parentProgress={{
                      currentModule: 13,
                      completedLessons: 2,
                      totalLessons: 5,
                      lastActivity: 'вчера'
                    }}
                    onContinueLearning={() => setShowParentModule(true)}
                  />
                </Suspense>
              }
            />
          </Suspense>
        ) : !showParentModule && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation - Telegram Wallet Style (адаптивный) */}
            <TabsList className={`${isMobile ? 'fixed bottom-0 left-0 right-0 h-14 mobile-nav mobile-tabs' : 'relative h-12 mt-4'} rounded-lg border-t bg-white z-50 grid grid-cols-5`}>
              <TabsTrigger value="dashboard" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                <BookOpen weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Модули</span>
              </TabsTrigger>
              <TabsTrigger value="checkin" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                <Heart weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Чек-ин</span>
              </TabsTrigger>
              <TabsTrigger value="cohort" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                <Users weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Группа</span>
              </TabsTrigger>
              <TabsTrigger value="badges" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                <Trophy weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Награды</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className={`touch-target flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 ${isMobile ? 'tab-button' : ''}`}>
                <Target weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-4 h-4'}`} />
                <span className={`${isSmallMobile ? 'text-[9px]' : 'text-[10px]'}`}>Прогресс</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="dashboard" className="mt-0 p-4">
              {selectedModule ? (
                <UniversalModuleViewer 
                  moduleId={selectedModule} 
                  onBack={() => setSelectedModule(null)} 
                />
              ) : (
                <>
                  {/* Compact Stats Grid - Telegram Wallet Style */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-orange-100 flex items-center justify-center">
                        <Flame className="w-6 h-6 text-orange-600" weight="fill" />
                      </div>
                      <div className="text-base font-bold text-gray-900">{userProfile?.streak || 0}</div>
                      <div className="text-[10px] text-gray-500">дней</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                        <Lightning className="w-6 h-6 text-blue-600" weight="fill" />
                      </div>
                      <div className="text-base font-bold text-gray-900">{adaptiveProgress?.totalXP || 0}</div>
                      <div className="text-[10px] text-gray-500">XP</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" weight="fill" />
                      </div>
                      <div className="text-base font-bold text-gray-900">{userProfile?.completedModules || 0}</div>
                      <div className="text-[10px] text-gray-500">модулей</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-1 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" weight="fill" />
                      </div>
                      <div className="text-base font-bold text-gray-900">A</div>
                      <div className="text-[10px] text-gray-500">группа</div>
                    </div>
                  </div>

                  {/* Quick Actions - Круглые кнопки как в Telegram Wallet */}
                  <div className="grid grid-cols-4 gap-3 mb-5">
                    <button 
                      onClick={() => {
                      if (userProfile?.currentModule) {
                        setSelectedModule(userProfile.currentModule)
                      }
                    }}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                        <Play className="w-7 h-7 text-white" weight="fill" />
                      </div>
                      <span className="text-[11px] text-gray-700 font-medium">Учиться</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('checkin')}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                        <Heart className="w-7 h-7 text-white" weight="fill" />
                            </div>
                      <span className="text-[11px] text-gray-700 font-medium">Чек-ин</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('cohort')}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                        <Users className="w-7 h-7 text-white" weight="fill" />
                          </div>
                      <span className="text-[11px] text-gray-700 font-medium">Группа</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab('badges')}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-md active:scale-95 transition-transform">
                        <Trophy className="w-7 h-7 text-white" weight="fill" />
                        </div>
                      <span className="text-[11px] text-gray-700 font-medium">Награды</span>
                    </button>
                            </div>

                  {/* Показываем только модуль "Личные границы" для учеников */}
                  {isDevMode ? (
                    <ModuleGrid 
                      currentModule={userProfile?.currentModule || 1}
                      onModuleSelect={setSelectedModule}
                    />
                  ) : (
                    <Card className="bg-white border border-gray-200 overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-white" weight="fill" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-0.5">Личные границы</h3>
                            <p className="text-xs text-gray-500">9 уроков • 3 недели • 12+ лет</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          Научись устанавливать здоровые границы в отношениях
                        </p>
                        
                        <button 
                            onClick={() => setSelectedModule(1)}
                          className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                          >
                          Начать обучение
                        </button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="checkin" className="mt-0">
              <CheckInPanel 
                onCheckIn={(data: CheckInData) => setLastCheckIn(data)} 
                lastCheckIn={lastCheckIn || null} 
              />
            </TabsContent>

            <TabsContent value="cohort" className="mt-0">
              <CohortSchedule cohortId={userProfile?.cohortId || ''} />
            </TabsContent>

            <TabsContent value="badges" className="mt-0 p-4">
              <BadgeGrid userBadges={userBadges || []} />
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              <ProgressStats 
                userProfile={userProfile || {
                  name: defaultName,
                  age: 16,
                  currentModule: 1,
                  currentWeek: 2,
                  completedModules: 0,
                  streak: 7,
                  cohortId: 'teens-14-16-cohort-a'
                }} 
                checkIns={lastCheckIn ? [lastCheckIn] : []} 
                badgeCount={userBadges?.length || 0}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

export default App

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

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { BookOpen, Heart, Users, Trophy, Target, Brain, ArrowLeft } from '@phosphor-icons/react'
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
  const defaultName = user?.first_name || 'Алекс'

  // Tab navigation
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
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
    cohortId: 'teens-14-16-cohort-a'
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

  // Adaptive Learning Functions
  const selectNextLesson = async () => {
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
  }

  const handleLessonComplete = async (score: number) => {
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
  }

  // Helper function to get badge info
  const getBadgeInfo = (badgeId: string) => {
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
  }

  return (
    <div className={`min-h-screen relative overflow-hidden telegram-webapp ${isMobile ? 'mobile-typography' : ''}`} style={{ minHeight: `${viewportHeight}px` }}>
      {/* Optimized Static Background - Perplexity Speed Principle */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        {/* Static subtle pattern instead of heavy animations */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-24 h-24 bg-cyan-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-1/3 w-20 h-20 bg-sky-200 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Header - Clean Telegram WebApp Style */}
      <header className={`sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-[40px] ${isMobile ? 'safe-area-top' : ''}`}>
        {/* Back Button */}
        <div className="flex items-center justify-between px-3 py-2">
          <motion.button
            onClick={() => {
              console.log('Кнопка Назад нажата!')
              // Если открыт модуль - закрыть его
              if (selectedModule) {
                console.log('Закрываем модуль')
                setSelectedModule(null)
              } else {
                // Иначе перейти на главную
                console.log('Переходим на главную')
                setActiveTab('dashboard')
              }
            }}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-lg bg-white/50"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-medium">Назад</span>
          </motion.button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Подростковый бот</h1>
            <p className="text-xs text-gray-500">мини-приложение</p>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
        
        <div className={`flex items-center justify-between ${isMobile ? 'mobile-spacing' : 'p-3'}`}>
          {/* Left: Home Button (Heart in Liquid Glass) + Title */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => {
                setActiveTab('dashboard')
                setSelectedModule(null)
              }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/60 backdrop-blur-[20px] border border-white/40 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Heart weight="fill" className="w-5 h-5 text-blue-600" />
            </motion.button>
            <div>
              <h1 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900`}>AI Подросток</h1>
              <p className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} text-gray-500`}>Неделя {userProfile?.currentWeek || 1} • День {userProfile?.streak || 0}</p>
            </div>
          </div>
          
          {/* Right: Profile Photo Button Only */}
          <motion.button
            onClick={() => setActiveTab('profile')}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="relative w-5 h-5 rounded-full overflow-hidden border-2 border-white/40 shadow-lg hover:shadow-xl transition-shadow"
          >
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                {user?.first_name ? user.first_name.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`mobile-scroll pb-20 ${isMobile ? 'mobile-spacing' : 'p-2 md:p-3'} space-y-3`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab Navigation - Fixed Bottom Bar */}
        <TabsList className={`mobile-nav ${isMobile ? 'mobile-tabs' : ''} fixed bottom-0 left-0 right-0 h-16 rounded-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-50 grid grid-cols-5`}>
          <TabsTrigger value="dashboard" className={`touch-target flex-col gap-1 h-full data-[state=active]:text-primary ${isMobile ? 'tab-button' : ''}`}>
            <BookOpen weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <span className={`${isSmallMobile ? 'text-[10px]' : 'text-xs'}`}>Модули</span>
          </TabsTrigger>
          <TabsTrigger value="checkin" className={`touch-target flex-col gap-1 h-full data-[state=active]:text-primary ${isMobile ? 'tab-button' : ''}`}>
            <Heart weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <span className={`${isSmallMobile ? 'text-[10px]' : 'text-xs'}`}>Чек-ин</span>
          </TabsTrigger>
          <TabsTrigger value="cohort" className={`touch-target flex-col gap-1 h-full data-[state=active]:text-primary ${isMobile ? 'tab-button' : ''}`}>
            <Users weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <span className={`${isSmallMobile ? 'text-[10px]' : 'text-xs'}`}>Группа</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className={`touch-target flex-col gap-1 h-full data-[state=active]:text-primary ${isMobile ? 'tab-button' : ''}`}>
            <Trophy weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <span className={`${isSmallMobile ? 'text-[10px]' : 'text-xs'}`}>Награды</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className={`touch-target flex-col gap-1 h-full data-[state=active]:text-primary ${isMobile ? 'tab-button' : ''}`}>
            <Target weight="fill" className={`mobile-icon ${isSmallMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <span className={`${isSmallMobile ? 'text-[10px]' : 'text-xs'}`}>Прогресс</span>
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
              <DashboardHero
                userName={userProfile?.name || defaultName}
                currentModule={userProfile?.currentModule || 1}
                streak={userProfile?.streak || 0}
                totalXP={adaptiveProgress?.totalXP || 0}
                completedModules={userProfile?.completedModules || 0}
                cohortName={userProfile?.cohortId || 'Cohort A'}
                onContinueLearning={() => {
                  if (userProfile?.currentModule) {
                    setSelectedModule(userProfile.currentModule)
                  }
                }}
                onCheckIn={() => setActiveTab('checkin')}
              />

              {/* Adaptive Learning Stats */}
              {adaptiveProgress && adaptiveProgress.completedLessons.length > 0 && (
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-600" />
                        <div>
                          <CardTitle className="text-lg">Адаптивное обучение</CardTitle>
                          <CardDescription className="text-purple-700">
                            Модуль #1: Личные границы
                          </CardDescription>
                        </div>
                      </div>
                      <Trophy className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {adaptiveProgress.completedLessons.length}
                        </div>
                        <div className="text-xs text-muted-foreground">уроков пройдено</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {adaptiveProgress.totalXP}
                        </div>
                        <div className="text-xs text-muted-foreground">XP заработано</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {adaptiveProgress.level}
                        </div>
                        <div className="text-xs text-muted-foreground">уровень</div>
                      </div>
                    </div>
                    <Progress 
                      value={(adaptiveProgress.completedLessons.length / 9) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-muted-foreground">
                        {adaptiveProgress.completedLessons.length === 9 ? 'Модуль завершён! 🎉' : `Осталось ${9 - adaptiveProgress.completedLessons.length} уроков`}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedModule(1)}
                        style={{ background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' }}
                        className={`text-white shadow-lg hover:shadow-xl ${isMobile ? 'mobile-button touch-target' : ''}`}
                      >
                        {adaptiveProgress.completedLessons.length === 9 ? 'Пройти заново' : 'Продолжить'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <div className={`${isMobile ? 'mobile-grid' : 'grid grid-cols-2'} gap-4`}>
                <Card className={`mobile-card cursor-pointer hover:shadow-md transition-shadow ${isMobile ? 'touch-target' : ''}`} onClick={() => setActiveTab('checkin')}>
                  <CardContent className={`${isMobile ? 'mobile-spacing' : 'p-4'} text-center`}>
                    <Heart className={`mobile-icon ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-accent mx-auto mb-2`} />
                    <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Ежедневный чек-ин</h3>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                      {lastCheckIn ? 'Обновить состояние' : 'Как дела сегодня?'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className={`mobile-card cursor-pointer hover:shadow-md transition-shadow ${isMobile ? 'touch-target' : ''}`} onClick={() => setActiveTab('cohort')}>
                  <CardContent className={`${isMobile ? 'mobile-spacing' : 'p-4'} text-center`}>
                    <Users className={`mobile-icon ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-primary mx-auto mb-2`} />
                    <h3 className={`font-medium ${isMobile ? 'text-sm' : ''}`}>Моя группа</h3>
                    <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Встреча через 2 дня</p>
                  </CardContent>
                </Card>
              </div>

              <DailyRecommendationCard 
                currentLesson={currentLesson} 
                onLessonComplete={handleLessonComplete} 
                isLoading={isLoadingLesson} 
              />

              <ModuleGrid 
                currentModule={userProfile?.currentModule || 1}
                onModuleSelect={setSelectedModule}
              />
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
      </main>
    </div>
  )
}

export default App

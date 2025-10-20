import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { Toaster as HotToaster } from 'react-hot-toast'
import { toast } from 'sonner'
import { Heart, Users, Calendar, BookOpen, Target, Shield, Trophy, Brain, ArrowRight } from '@phosphor-icons/react'
import BoundariesModule from '@/components/BoundariesModule'
import ModuleGrid from '@/components/ModuleGrid'
import ModuleDetail from '@/components/ModuleDetail'
import CheckInPanel from '@/components/CheckInPanel'
import CohortSchedule from '@/components/CohortSchedule'
import BadgeGrid from '@/components/BadgeGrid'
import ProgressStats from '@/components/ProgressStats'
import AdaptiveLessonViewer from '@/components/AdaptiveLessonViewer'
import DashboardHero from '@/components/DashboardHero'
import { useTelegram } from '@/hooks/useTelegram'
import boundariesModule from '@/data/boundariesModule'
import { adaptiveLearning } from '@/lib/adaptiveLearning'
import type { LessonRecommendation, CheckInData as AdaptiveCheckInData } from '@/lib/adaptiveLearning'
import { gamification } from '@/lib/gamification'
import type { Badge as GamificationBadge } from '@/lib/gamification'

interface UserProfile {
  name: string
  age: number
  currentModule: number
  currentWeek: number
  completedModules: number
  streak: number
  cohortId: string
}

interface CheckInData {
  date: string
  mood: number
  anxiety: number
  sleepHours: number
  note?: string
}

function App() {
  const { user, isTelegramWebApp, colorScheme, tg } = useTelegram()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [currentLesson, setCurrentLesson] = useState<LessonRecommendation | null>(null)
  const [checkIns, setCheckIns] = useState<CheckInData[]>([])
  const [isLoadingLesson, setIsLoadingLesson] = useState(false)
  
  const defaultName = user?.first_name || 'Алекс'
  
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
  
  // Adaptive Learning Progress
  const [adaptiveProgress, setAdaptiveProgress] = useKV<{
    completedLessons: string[]
    quizScores: Record<string, number>
    timeSpent: Record<string, number>
    practiceCompleted: Record<string, boolean>
    totalXP: number
    level: number
  }>('adaptive-progress', {
    completedLessons: [],
    quizScores: {},
    timeSpent: {},
    practiceCompleted: {},
    totalXP: 0,
    level: 1
  })

  useEffect(() => {
    if (user && userProfile && userProfile.name !== user.first_name) {
      setUserProfile({
        ...userProfile,
        name: user.first_name
      })
    }
  }, [user, userProfile, setUserProfile])

  // Auto-select lesson when Module #13 is opened
  useEffect(() => {
    if (selectedModule === 13 && !currentLesson) {
      selectNextLesson()
    }
  }, [selectedModule])

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

  // Helper function to get motivational message
  const getMotivationalMessage = (completedCount: number): string => {
    if (completedCount === 0) return 'Начни своё путешествие к пониманию личных границ! 🚀'
    if (completedCount === 1) return 'Отличное начало! Продолжай в том же духе! 💪'
    if (completedCount === 3) return 'Ты на правильном пути! Треть модуля позади! 🌟'
    if (completedCount === 5) return 'Больше половины! Ты уже многому научился! 🎯'
    if (completedCount === 7) return 'Почти у цели! Осталось совсем немного! 🔥'
    if (completedCount === 8) return 'Последний рывок! Ты почти мастер границ! ⭐'
    if (completedCount === 9) return 'Поздравляем! Ты прошёл все уроки! 🎉'
    return 'Продолжай обучение! 💫'
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
        description: 'Завершил все 9 уроков модуля'
      },
      'consistent-learner': {
        name: 'Постоянство',
        description: 'Прошёл 3 урока подряд'
      }
    }
    return badges[badgeId] || { name: badgeId, description: 'Особое достижение' }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {/* iOS 26 Blue Brand Logo */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' }}>
              <Heart className="w-5 h-5 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">AI Подросток</h1>
              <p className="text-sm text-muted-foreground">Неделя {userProfile?.currentWeek || 1} • День {userProfile?.streak || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {adaptiveProgress && adaptiveProgress.totalXP > 0 && (
              <Badge variant="secondary" className="gap-1 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-sm"
                     style={{ background: 'rgba(0, 122, 255, 0.1)', color: '#007AFF', border: '1px solid rgba(0, 122, 255, 0.2)' }}>
                <Trophy className="w-3 h-3" />
                Ур. {adaptiveProgress.level} • {adaptiveProgress.totalXP} XP
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-sm"
                   style={{ background: 'rgba(0, 122, 255, 0.1)', color: '#007AFF', border: '1px solid rgba(0, 122, 255, 0.2)' }}>
              <Target className="w-3 h-3" />
              {userProfile?.streak || 0} дней
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 space-y-6">
        {/* Dashboard Hero - iOS 26 */}
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
                      Модуль #13: Личные границы
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
                  onClick={() => setSelectedModule(13)}
                  style={{ background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' }}
                  className="text-white shadow-lg hover:shadow-xl"
                >
                  {adaptiveProgress.completedLessons.length === 9 ? 'Пройти заново' : 'Продолжить'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('checkin')}>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-medium">Ежедневный чек-ин</h3>
              <p className="text-sm text-muted-foreground">
                {lastCheckIn ? 'Обновить состояние' : 'Как дела сегодня?'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('cohort')}>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium">Моя группа</h3>
              <p className="text-sm text-muted-foreground">Встреча через 2 дня</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="gap-1">
              <BookOpen className="w-4 h-4" />
              Модули
            </TabsTrigger>
            <TabsTrigger value="checkin" className="gap-1">
              <Heart className="w-4 h-4" />
              Чек-ин
            </TabsTrigger>
            <TabsTrigger value="cohort" className="gap-1">
              <Users className="w-4 h-4" />
              Группа
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-1">
              <Trophy className="w-4 h-4" />
              Награды
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1">
              <Target className="w-4 h-4" />
              Прогресс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            {selectedModule === 13 ? (
              <BoundariesModule 
                onBack={() => setSelectedModule(null)}
              />
            ) : selectedModule === 13 && isLoadingLesson ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    Модуль #13: Личные границы (Адаптивный)
                  </CardTitle>
                  <CardDescription>
                    Новая система обучения с учетом твоих эмоций и состояния
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Motivational Message */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💬</span>
                      <div>
                        <p className="font-semibold text-indigo-900 mb-1">Мотивация дня</p>
                        <p className="text-sm text-indigo-700">
                          {getMotivationalMessage(adaptiveProgress?.completedLessons.length || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Stats */}
                  {adaptiveProgress && adaptiveProgress.completedLessons.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-green-900">Твой прогресс</p>
                          <p className="text-sm text-green-700">
                            {adaptiveProgress.completedLessons.length} из 9 уроков
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {adaptiveProgress.totalXP}
                          </p>
                          <p className="text-xs text-green-700">XP • Уровень {adaptiveProgress.level}</p>
                        </div>
                      </div>
                      <Progress 
                        value={(adaptiveProgress.completedLessons.length / 9) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Info cards */}
                  <div className="grid gap-3">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <p className="font-semibold text-purple-900 mb-1">9 уроков о границах</p>
                          <p className="text-sm text-purple-700">
                            Научишься защищать своё пространство и говорить "нет"
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✨</span>
                        <div>
                          <p className="font-semibold text-blue-900 mb-1">Множественные форматы</p>
                          <p className="text-sm text-blue-700">
                            Текст, видео, аудио, интерактивные упражнения, майндмапы
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {!lastCheckIn && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💡</span>
                          <div>
                            <p className="font-semibold text-amber-900 mb-1">Совет</p>
                            <p className="text-sm text-amber-700">
                              Пройди check-in для более точных рекомендаций уроков
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lessons List */}
                  {adaptiveProgress && adaptiveProgress.completedLessons.length > 0 && (
                    <div className="border border-border rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        📚 Уроки модуля
                        <Badge variant="secondary" className="text-xs">
                          {adaptiveProgress.completedLessons.length}/9
                        </Badge>
                      </h3>
                      <div className="space-y-2">
                        {boundariesModule.lessons.map((lesson, idx) => {
                          const isCompleted = adaptiveProgress.completedLessons.includes(lesson.id)
                          const score = adaptiveProgress.quizScores[lesson.id]
                          
                          return (
                            <div 
                              key={lesson.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                isCompleted 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                  isCompleted 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-300 text-gray-600'
                                }`}>
                                  {isCompleted ? '✓' : idx + 1}
                                </div>
                                <div>
                                  <p className={`text-sm font-medium ${
                                    isCompleted ? 'text-green-900' : 'text-gray-700'
                                  }`}>
                                    {lesson.title}
                                  </p>
                                  {isCompleted && score && (
                                    <p className="text-xs text-green-600">
                                      Результат: {score}% • +{Math.round(score * 10)} XP
                                    </p>
                                  )}
                                </div>
                              </div>
                              {isCompleted && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  Пройден
                                </Badge>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Action buttons - iOS 26 Blue Style */}
                  <div className="flex gap-2 pt-2">
                    {!lastCheckIn && (
                      <Button 
                        onClick={() => setActiveTab('checkin')} 
                        variant="outline"
                        className="flex-1 backdrop-blur-xl"
                        style={{ 
                          background: 'rgba(0, 122, 255, 0.05)',
                          border: '1px solid rgba(0, 122, 255, 0.3)',
                          color: '#007AFF'
                        }}
                      >
                        ❤️ Пройти Check-in
                      </Button>
                    )}
                    <Button 
                      onClick={selectNextLesson} 
                      disabled={isLoadingLesson}
                      className="flex-1 shadow-lg hover:shadow-xl text-white"
                      style={{ background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' }}
                    >
                      {isLoadingLesson ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Подбираем урок...
                        </>
                      ) : adaptiveProgress && adaptiveProgress.completedLessons.length === 9 ? (
                        <>
                          <Trophy className="w-4 h-4 mr-2" />
                          Пройти заново
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          {adaptiveProgress && adaptiveProgress.completedLessons.length > 0 ? 'Продолжить обучение' : 'Начать обучение'}
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedModule(null)}
                    className="w-full hover:bg-[rgba(0,122,255,0.1)]"
                    style={{ color: '#007AFF' }}
                  >
                    ← Назад к модулям
                  </Button>
                </CardContent>
              </Card>
            ) : selectedModule ? (
              <ModuleDetail 
                moduleId={selectedModule} 
                onBack={() => setSelectedModule(null)} 
              />
            ) : (
              <ModuleGrid 
                currentModule={userProfile?.currentModule || 1} 
                onModuleSelect={setSelectedModule}
              />
            )}
          </TabsContent>

          <TabsContent value="checkin" className="mt-6">
            <CheckInPanel 
              onCheckIn={(data) => setLastCheckIn(data)} 
              lastCheckIn={lastCheckIn || null} 
            />
          </TabsContent>

          <TabsContent value="cohort" className="mt-6">
            <CohortSchedule cohortId={userProfile?.cohortId || 'default'} />
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <BadgeGrid userBadges={userBadges || []} />
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProgressStats 
              userProfile={userProfile || {
                name: 'Алекс',
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
      <Toaster />
      <HotToaster position="top-center" />
    </div>
  )
}

export default App
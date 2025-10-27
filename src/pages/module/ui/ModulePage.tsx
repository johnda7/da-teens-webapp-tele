import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BookOpen, Clock, Target, CheckCircle, Circle, Lock } from '@phosphor-icons/react'
import AdaptiveLessonViewer from '@/components/AdaptiveLessonViewer'
import boundariesModule from '@/data/boundariesModule'
import { adaptiveLearning } from '@/lib/adaptiveLearning'
import type { LessonRecommendation, CheckInData as AdaptiveCheckInData } from '@/lib/adaptiveLearning'
import { toast } from 'sonner'

interface ModulePageProps {
  moduleId: number
  userProfile: {
    name: string
    streak: number
  }
  adaptiveProgress: {
    completedLessons: string[]
    quizScores: Record<string, number>
    timeSpent: Record<string, number>
    practiceCompleted: Record<string, boolean>
    totalXP: number
    level: number
  }
  lastCheckIn: {
    date: string
    mood: number
    anxiety: number
    sleepHours: number
    note?: string
  } | null
  checkIns: Array<{
    date: string
    mood: number
    anxiety: number
    sleepHours: number
    note?: string
  }>
  onBack: () => void
  onLessonComplete: (score: number) => void
}

export function ModulePage({
  moduleId,
  userProfile,
  adaptiveProgress,
  lastCheckIn,
  checkIns,
  onBack,
  onLessonComplete
}: ModulePageProps) {
  const [currentLesson, setCurrentLesson] = useState<LessonRecommendation | null>(null)
  const [isLoadingLesson, setIsLoadingLesson] = useState(false)

  // Only support Module #13 (Boundaries) for now
  const isAdaptiveModule = moduleId === 13
  const module = isAdaptiveModule ? boundariesModule : null

  useEffect(() => {
    if (isAdaptiveModule && !currentLesson) {
      selectNextLesson()
    }
  }, [moduleId])

  const selectNextLesson = async () => {
    if (!module) return

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
        userId: 'user',
        completedLessons: adaptiveProgress.completedLessons,
        quizScores: adaptiveProgress.quizScores,
        timeSpent: adaptiveProgress.timeSpent,
        practiceCompleted: adaptiveProgress.practiceCompleted,
        checkIns: adaptiveCheckIns.length > 0 ? adaptiveCheckIns : [defaultCheckIn],
        lastActiveDate: new Date(),
        streak: userProfile.streak
      }
      
      const recommendation = await adaptiveLearning.selectNextLesson(
        module.lessons,
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

  const handleLessonComplete = (score: number) => {
    onLessonComplete(score)
    
    // Select next lesson automatically
    setTimeout(() => {
      selectNextLesson()
    }, 2000)
  }

  if (!isAdaptiveModule || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-4">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Назад к модулям
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle>Модуль недоступен</CardTitle>
              <CardDescription>
                Этот модуль пока в разработке. Попробуй Модуль #13 "Личные границы"!
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    )
  }

  const completedLessonsCount = module.lessons.filter(lesson =>
    adaptiveProgress.completedLessons.includes(lesson.id)
  ).length

  const progressPercentage = Math.round((completedLessonsCount / module.lessons.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 backdrop-blur-xl bg-white/80">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Назад</span>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="text-4xl">{module.icon}</div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {module.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {completedLessonsCount} из {module.lessons.length} уроков
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] text-white border-0"
            >
              AI
            </Badge>
          </div>

          <Progress value={progressPercentage} className="mt-4" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  Уроки модуля
                </CardTitle>
                <CardDescription>
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.lessons.map((lesson, index) => {
                    const isCompleted = adaptiveProgress.completedLessons.includes(lesson.id)
                    const isCurrent = currentLesson?.lesson.id === lesson.id
                    const isLocked = index > 0 && !adaptiveProgress.completedLessons.includes(module.lessons[index - 1].id)

                    return (
                      <div
                        key={lesson.id}
                        className={`
                          flex items-start gap-3 p-3 rounded-lg border transition-all
                          ${isCurrent ? 'bg-[#007AFF]/10 border-[#007AFF]' : 'bg-white border-gray-200'}
                          ${isLocked ? 'opacity-50' : 'cursor-pointer hover:bg-gray-50'}
                        `}
                        onClick={() => {
                          if (!isLocked && !isCompleted) {
                            // Could implement lesson selection here
                          }
                        }}
                      >
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle size={20} className="text-green-600" weight="fill" />
                          ) : isLocked ? (
                            <Lock size={20} className="text-gray-400" />
                          ) : isCurrent ? (
                            <Target size={20} className="text-[#007AFF]" weight="fill" />
                          ) : (
                            <Circle size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${isCurrent ? 'text-[#007AFF]' : 'text-gray-900'}`}>
                            {index + 1}. {lesson.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                            {lesson.subtitle}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={12} />
                              <span>5-10 мин</span>
                            </div>
                            {isCompleted && adaptiveProgress.quizScores[lesson.id] && (
                              <Badge variant="secondary" className="text-xs">
                                {adaptiveProgress.quizScores[lesson.id]}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Viewer */}
          <div className="lg:col-span-2">
            {isLoadingLesson ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AFF]"></div>
                    <p className="mt-4 text-gray-600">Подбираем урок...</p>
                  </div>
                </CardContent>
              </Card>
            ) : currentLesson ? (
              <AdaptiveLessonViewer
                recommendation={currentLesson}
                onComplete={handleLessonComplete}
                onSkip={selectNextLesson}
                onBack={onBack}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Поздравляем!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ты прошёл все уроки модуля "{module.title}"
                  </p>
                  <Button onClick={onBack}>
                    Вернуться к модулям
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

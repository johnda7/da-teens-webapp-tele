import { useState } from 'react'
import { DashboardHero } from '@/widgets/dashboard-hero'
import { ModuleGrid } from '@/widgets/module-grid'
import { CheckInPanel } from '@/features/check-in'
import type { CheckInData } from '@/features/check-in'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QuickActionsRibbon from '@/components/QuickActionsRibbon'
import SleepMeditationHub from '@/components/SleepMeditationHub'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Target, Trophy, Calendar } from '@phosphor-icons/react'

interface DashboardPageProps {
  userProfile: {
    name: string
    age: number
    currentModule: number
    currentWeek: number
    completedModules: number
    streak: number
    cohortId: string
  }
  adaptiveProgress: {
    completedLessons: string[]
    totalXP: number
    level: number
  }
  userBadges: string[]
  lastCheckIn: CheckInData | null
  onModuleSelect: (moduleId: number) => void
  onCheckIn: (data: CheckInData) => void
  onCheckInComplete?: () => void
}

export function DashboardPage({
  userProfile,
  adaptiveProgress,
  userBadges,
  lastCheckIn,
  onModuleSelect,
  onCheckIn,
  onCheckInComplete
}: DashboardPageProps) {
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showSleep, setShowSleep] = useState(false)

  const handleCheckInClick = () => {
    setShowCheckIn(true)
  }

  const handleCheckIn = (data: CheckInData) => {
    onCheckIn(data)
    setShowCheckIn(false)
    onCheckInComplete?.()
  }

  const handleContinueLearning = () => {
    // Navigate to current module
    onModuleSelect(userProfile.currentModule)
  }

  // Calculate overall progress
  const totalLessons = 108 // 12 modules × 9 lessons each
  const completedLessons = adaptiveProgress.completedLessons.length
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <DashboardHero
        userName={userProfile.name}
        currentWeek={userProfile.currentWeek}
        streak={userProfile.streak}
        level={adaptiveProgress.level}
        totalXP={adaptiveProgress.totalXP}
        completedLessons={completedLessons}
        onContinueLearning={handleContinueLearning}
        onCheckIn={handleCheckInClick}
      />

      {/* Quick actions under hero */}
      <div className="container mx-auto px-4 mt-4">
        <QuickActionsRibbon
          onStartLesson={handleContinueLearning}
          onCheckIn={handleCheckInClick}
          onOpenSleep={() => setShowSleep(true)}
        />
      </div>

      {/* Check-In Modal/Panel */}
      {showCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl">
            <CheckInPanel onCheckIn={handleCheckIn} lastCheckIn={lastCheckIn} />
          </div>
        </div>
      )}

      {/* Sleep/Meditation Hub */}
      {showSleep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-white rounded-xl overflow-hidden">
            <div className="flex justify-end p-2">
              <button onClick={() => setShowSleep(false)} className="px-3 py-1.5 text-sm rounded-md border">Закрыть</button>
            </div>
            <div className="p-4">
              <SleepMeditationHub currentMood={5} onContentSelect={() => setShowSleep(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <Target size={18} />
              <span className="hidden sm:inline">Модули</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <Heart size={18} />
              <span className="hidden sm:inline">Прогресс</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Trophy size={18} />
              <span className="hidden sm:inline">Достижения</span>
            </TabsTrigger>
            <TabsTrigger value="cohort" className="flex items-center gap-2">
              <Calendar size={18} />
              <span className="hidden sm:inline">Когорта</span>
            </TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Программа обучения
                </h2>
                <p className="text-gray-600 mt-1">
                  12 модулей для развития эмоционального интеллекта
                </p>
              </div>
              <Card className="sm:w-64">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Общий прогресс</p>
                      <p className="text-2xl font-bold text-[#007AFF]">
                        {progressPercentage}%
                      </p>
                    </div>
                    <div className="text-4xl">📚</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <ModuleGrid
              currentModule={userProfile.currentModule}
              completedModules={[]} // TODO: track completed modules as array
              onModuleSelect={onModuleSelect}
            />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart size={24} className="text-[#007AFF]" />
                  Твоя статистика
                </CardTitle>
                <CardDescription>
                  Отслеживай свой рост и достижения
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#007AFF]">{completedLessons}</p>
                        <p className="text-sm text-gray-600 mt-1">Уроков завершено</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#007AFF]">{userProfile.streak}</p>
                        <p className="text-sm text-gray-600 mt-1">Дней подряд</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#007AFF]">{adaptiveProgress.level}</p>
                        <p className="text-sm text-gray-600 mt-1">Уровень</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#007AFF]">{adaptiveProgress.totalXP}</p>
                        <p className="text-sm text-gray-600 mt-1">Опыта (XP)</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy size={24} className="text-[#007AFF]" />
                  Твои достижения
                </CardTitle>
                <CardDescription>
                  Собрано {userBadges.length} из 15 бейджей
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Система бейджей в разработке...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cohort Tab */}
          <TabsContent value="cohort" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar size={24} className="text-[#007AFF]" />
                  Расписание когорты
                </CardTitle>
                <CardDescription>
                  Групповые встречи и события
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Когорта: {userProfile.cohortId}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

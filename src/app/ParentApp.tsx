/**
 * ParentApp - Родительская панель (отдельная точка входа)
 * 
 * Родители (20% пользователей) получают упрощенный интерфейс:
 * - Свои уроки (5 уроков из boundariesParentModule)
 * - Дашборд с прогрессом детей
 * - Простая навигация без геймификации
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { BookOpen, Users, ChartLine, HouseLine, Shield, ArrowLeft } from '@phosphor-icons/react'
import { lazy, Suspense } from 'react'

const ParentDashboard = lazy(() => import('@/components/ParentDashboard'))
const ParentBoundariesModule = lazy(() => import('@/components/ParentBoundariesModule'))

import { FamilyLinking } from '@/components/FamilyLinking'
import { ProgressCharts } from '@/components/ProgressCharts'
import { useTelegram } from '@/hooks/useTelegram'
import { useBackButton } from '@/hooks/useBackButton'
import { useParentAccess } from '@/hooks/useParentAccess'

// Import styles
import './styles/index.css'
import './styles/main.css'
import './styles/theme.css'

export function ParentApp() {
  const { user, isTelegramWebApp, isMobile } = useTelegram()
  const defaultName = user?.first_name || 'Родитель'

  // State
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showModule, setShowModule] = useState(false)

  // ✨ Parent Access Hook - Real data from CloudStorage
  const {
    parentProgress,
    childrenProgress,
    isLoading,
    linkChild,
    unlinkChild,
    getAggregatedStats,
    completeParentLesson
  } = useParentAccess()

  // ✨ Telegram BackButton для навигации
  useBackButton({
    show: showModule,
    onBack: () => setShowModule(false)
  })

  // Get aggregated stats
  const stats = getAggregatedStats()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" weight="fill" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">DA Teens</h1>
                <p className="text-xs text-gray-600">Родительская панель</p>
              </div>
            </div>
            {isTelegramWebApp && (
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                Telegram WebApp
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 pb-20">
        {showModule ? (
          <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ParentBoundariesModule onBack={() => setShowModule(false)} />
            </motion.div>
          </Suspense>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <TabsList className={`${isMobile ? 'fixed bottom-0 left-0 right-0 h-14' : 'relative h-12'} rounded-lg border-t bg-white z-50 grid grid-cols-3`}>
              <TabsTrigger value="dashboard" className="flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50">
                <HouseLine weight="fill" className="w-5 h-5" />
                <span className="text-[10px]">Главная</span>
              </TabsTrigger>
              <TabsTrigger value="lessons" className="flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50">
                <BookOpen weight="fill" className="w-5 h-5" />
                <span className="text-[10px]">Мои уроки</span>
              </TabsTrigger>
              <TabsTrigger value="children" className="flex-col gap-0.5 h-full data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50">
                <Users weight="fill" className="w-5 h-5" />
                <span className="text-[10px]">Дети</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="dashboard" className="mt-0">
              <div className="space-y-4">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
                  <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-1">Привет, {parentProgress?.parentName}! 👋</h2>
                    <p className="text-sm text-blue-100">
                      Отслеживайте прогресс ваших детей и проходите свои уроки
                    </p>
                    {stats.totalChildren > 0 && (
                      <div className="mt-3 flex gap-4 text-xs">
                        <div>
                          <div className="font-bold">{stats.totalChildren}</div>
                          <div className="text-blue-100">детей</div>
                        </div>
                        <div>
                          <div className="font-bold">{stats.totalCompletedLessons}</div>
                          <div className="text-blue-100">уроков пройдено</div>
                        </div>
                        <div>
                          <div className="font-bold">{stats.totalXP}</div>
                          <div className="text-blue-100">общий XP</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Parent Progress */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Ваш прогресс</h3>
                      <Badge className="bg-green-100 text-green-700">
                        {parentProgress?.completedLessons}/{parentProgress?.totalLessons} уроков
                      </Badge>
                    </div>
                    <Button 
                      onClick={() => setShowModule(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Продолжить обучение
                    </Button>
                  </CardContent>
                </Card>

                {/* Children Overview */}
                <Suspense fallback={<div className="text-center py-4">Загрузка...</div>}>
                  <ParentDashboard 
                    parentProgress={{
                      currentModule: parentProgress?.currentModule || 13,
                      completedLessons: parentProgress?.completedLessons || 0,
                      totalLessons: parentProgress?.totalLessons || 5,
                      lastActivity: parentProgress?.lastActivity || 'сегодня'
                    }}
                    onContinueLearning={() => setShowModule(true)}
                  />
                </Suspense>
              </div>
            </TabsContent>

            <TabsContent value="lessons" className="mt-0">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Модуль: Личные границы для родителей</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      5 уроков для помощи подростку в установлении здоровых границ
                    </p>
                    <Button 
                      onClick={() => setShowModule(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      Начать уроки
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="children" className="mt-0 p-4">
              <div className="space-y-4">
                {/* Family Linking Component */}
                <FamilyLinking mode="parent" />
                
                <h3 className="text-sm font-semibold text-gray-900 mt-6">Прогресс детей</h3>
                
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">Загрузка...</div>
                ) : childrenProgress.length === 0 ? (
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        После добавления детей здесь появится их прогресс
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  childrenProgress.map((child) => (
                    <div key={child.childId} className="space-y-4">
                      {/* Child Info Card */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-gray-900">{child.childName}</h4>
                            <Badge className="bg-blue-100 text-blue-700">
                              Модуль {child.currentModule}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-xs text-gray-600">
                            <div className="flex justify-between">
                              <span>Уроков пройдено:</span>
                              <span className="font-medium">{child.completedLessons}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Серия дней:</span>
                              <span className="font-medium">{child.streak} дней</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Опыт (XP):</span>
                              <span className="font-medium">{child.totalXP}</span>
                            </div>
                            {child.avgQuizScore && (
                              <div className="flex justify-between">
                                <span>Средний балл:</span>
                                <span className="font-medium">{child.avgQuizScore}%</span>
                              </div>
                            )}
                            {child.avgMood && (
                              <div className="flex justify-between">
                                <span>Настроение:</span>
                                <span className="font-medium">{child.avgMood}/10</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span>Последняя активность:</span>
                              <span className="font-medium">{child.lastActive}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Progress Charts */}
                      <ProgressCharts 
                        childName={child.childName}
                        xpData={child.xpHistory}
                        moodData={child.moodHistory}
                        quizScores={child.quizHistory}
                      />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

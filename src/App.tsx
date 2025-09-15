import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { Heart, Users, Calendar, BookOpen, Target, Shield, Trophy } from '@phosphor-icons/react'
import ModuleGrid from '@/components/ModuleGrid'
import ModuleDetail from '@/components/ModuleDetail'
import CheckInPanel from '@/components/CheckInPanel'
import CohortSchedule from '@/components/CohortSchedule'
import SOSButton from '@/components/SOSButton'
import BadgeGrid from '@/components/BadgeGrid'
import ProgressStats from '@/components/ProgressStats'

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
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [userProfile, setUserProfile] = useKV<UserProfile>('user-profile', {
    name: 'Алекс',
    age: 16,
    currentModule: 1,
    currentWeek: 2,
    completedModules: 0,
    streak: 7,
    cohortId: 'teens-14-16-cohort-a'
  })
  
  const [userBadges, setUserBadges] = useKV<string[]>('user-badges', ['first-step', 'check-in-streak-7'])
  const [lastCheckIn, setLastCheckIn] = useKV<CheckInData | null>('last-checkin', null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" weight="fill" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">DA Teens</h1>
              <p className="text-sm text-muted-foreground">Неделя {userProfile?.currentWeek || 1} • День {userProfile?.streak || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Target className="w-3 h-3" />
              {userProfile?.streak || 0} дней
            </Badge>
            <SOSButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Твой путь к благополучию</CardTitle>
                <CardDescription>Модуль {userProfile?.currentModule || 1} из 12 • {Math.round(((userProfile?.completedModules || 0) / 12) * 100)}% пройдено</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{userProfile?.completedModules || 0}/12</div>
                <div className="text-sm text-muted-foreground">модулей</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={((userProfile?.completedModules || 0) / 12) * 100} className="h-3" />
          </CardContent>
        </Card>

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
            {selectedModule ? (
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
    </div>
  )
}

export default App
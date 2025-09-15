import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  TrendUp, 
  Calendar, 
  Heart, 
  Brain, 
  Moon, 
  Trophy,
  CheckCircle,
  Flame
} from '@phosphor-icons/react'

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

interface ProgressStatsProps {
  userProfile: UserProfile
  checkIns: CheckInData[]
  badgeCount: number
}

export default function ProgressStats({ userProfile, checkIns, badgeCount }: ProgressStatsProps) {
  // Calculate averages from check-ins
  const avgMood = checkIns.length > 0 
    ? Math.round(checkIns.reduce((sum, ci) => sum + ci.mood, 0) / checkIns.length)
    : 5

  const avgAnxiety = checkIns.length > 0
    ? Math.round(checkIns.reduce((sum, ci) => sum + ci.anxiety, 0) / checkIns.length)
    : 3

  const avgSleep = checkIns.length > 0
    ? Number((checkIns.reduce((sum, ci) => sum + ci.sleepHours, 0) / checkIns.length).toFixed(1))
    : 7.5

  const totalProgress = Math.round(((userProfile.completedModules + (userProfile.currentWeek / 3)) / 12) * 100)

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤗', '😍', '🥰', '✨']
    return emojis[mood - 1] || '😐'
  }

  const getAnxietyColor = (anxiety: number) => {
    if (anxiety <= 3) return 'text-green-600'
    if (anxiety <= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSleepColor = (hours: number) => {
    if (hours >= 7 && hours <= 9) return 'text-green-600'
    if (hours >= 6 && hours <= 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6" />
            Профиль участника
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Имя</p>
              <p className="font-medium text-lg">{userProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Возраст</p>
              <p className="font-medium text-lg">{userProfile.age} лет</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Группа</p>
            <Badge variant="secondary" className="mt-1">
              {userProfile.cohortId.includes('14-16') ? 'A (14-16 лет)' : 'Группа участника'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendUp className="w-5 h-5 text-primary" />
            Прогресс обучения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Общий прогресс</span>
              <span className="font-medium">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{userProfile.completedModules}</div>
              <div className="text-sm text-muted-foreground">Завершено модулей</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-accent">{userProfile.currentWeek}</div>
              <div className="text-sm text-muted-foreground">Текущая неделя</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
            <span className="text-sm font-medium text-green-800">
              Модуль "{['Уверенность', 'Дружба', 'Общение'][userProfile.currentModule - 1] || 'Текущий'}" • Неделя {userProfile.currentWeek}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Streak & Consistency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Постоянство
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-600">{userProfile.streak}</div>
            <div className="text-sm text-orange-800">дней подряд</div>
            {userProfile.streak >= 7 && (
              <Badge className="mt-2 bg-orange-100 text-orange-800 border-orange-300">
                Отличная серия!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Статистика самочувствия
          </CardTitle>
          <CardDescription>
            На основе {checkIns.length} чек-инов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkIns.length > 0 ? (
            <>
              {/* Mood */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getMoodEmoji(avgMood)}</div>
                  <div>
                    <p className="font-medium">Среднее настроение</p>
                    <p className="text-sm text-muted-foreground">{avgMood}/10</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {avgMood >= 7 ? 'Отлично' : avgMood >= 5 ? 'Хорошо' : 'Работаем над этим'}
                </Badge>
              </div>

              {/* Anxiety */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-purple-500" />
                  <div>
                    <p className="font-medium">Средняя тревога</p>
                    <p className={`text-sm font-medium ${getAnxietyColor(avgAnxiety)}`}>
                      {avgAnxiety}/10
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {avgAnxiety <= 3 ? 'Спокойно' : avgAnxiety <= 6 ? 'Умеренно' : 'Высокая'}
                </Badge>
              </div>

              {/* Sleep */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Moon className="w-6 h-6 text-indigo-500" />
                  <div>
                    <p className="font-medium">Средний сон</p>
                    <p className={`text-sm font-medium ${getSleepColor(avgSleep)}`}>
                      {avgSleep} часов
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {avgSleep >= 7 && avgSleep <= 9 ? 'Норма' : 'Корректируем'}
                </Badge>
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Начни делать ежедневные чек-ины,</p>
              <p>чтобы видеть свою статистику</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-yellow-600">{badgeCount}</div>
            <div className="text-sm text-yellow-800">наград получено</div>
            {badgeCount > 0 && (
              <Badge className="mt-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                Так держать!
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Рекомендации</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {avgAnxiety > 6 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 Попробуй дыхательные практики для снижения тревоги
              </p>
            </div>
          )}
          
          {avgSleep < 7 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                🌙 Работай над режимом сна — это основа хорошего самочувствия
              </p>
            </div>
          )}
          
          {userProfile.streak >= 7 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                🔥 Потрясающая серия! Ты большой молодец
              </p>
            </div>
          )}
          
          {badgeCount === 0 && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-sm text-purple-800">
                🏆 Сделай первые шаги, чтобы получить свои награды
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
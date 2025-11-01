import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Star, CheckCircle, Flame, Target } from '@phosphor-icons/react'

interface BadgeGridProps {
  userBadges: string[]
}

const availableBadges = [
  {
    id: 'first-step',
    title: 'Первый шаг',
    description: 'Прошёл регистрацию и начал путешествие',
    icon: '🎯',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    criteria: 'Зарегистрироваться в приложении'
  },
  {
    id: 'check-in-streak-7',
    title: 'Неделя осознанности',
    description: '7 дней подряд делал чек-ины',
    icon: '🔥',
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    criteria: 'Сделать чек-ин 7 дней подряд'
  },
  {
    id: 'module-complete',
    title: 'Покоритель модуля',
    description: 'Полностью завершил первый модуль',
    icon: '📚',
    color: 'bg-green-100 border-green-300 text-green-800',
    criteria: 'Завершить любой модуль'
  },
  {
    id: 'practice-master',
    title: 'Мастер практик',
    description: 'Выполнил 20 дыхательных практик',
    icon: '🧘',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    criteria: 'Выполнить 20 практик осознанности'
  },
  {
    id: 'reflection-writer',
    title: 'Мыслитель',
    description: 'Написал 15 рефлексий',
    icon: '✍️',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    criteria: 'Написать 15 рефлексий'
  },
  {
    id: 'first-adaptive-lesson',
    title: 'Адаптивный старт',
    description: 'Прошёл первый адаптивный урок',
    icon: '🧠',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    criteria: 'Пройти первый урок в Модуле #13'
  },
  {
    id: 'perfect-score',
    title: 'Перфекционист',
    description: 'Набрал 90+ баллов в квизе',
    icon: '⭐',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    criteria: 'Набрать 90% или больше в любом квизе'
  },
  {
    id: 'boundaries-master',
    title: 'Мастер границ',
    description: 'Завершил все 9 уроков о личных границах',
    icon: '🛡️',
    color: 'bg-green-100 border-green-300 text-green-800',
    criteria: 'Пройти все уроки Модуля #13'
  },
  {
    id: 'consistent-learner',
    title: 'Постоянство',
    description: 'Прошёл 3 урока подряд',
    icon: '📈',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    criteria: 'Пройти 3 адаптивных урока подряд'
  },
  {
    id: 'community-helper',
    title: 'Помощник сообщества',
    description: 'Активно помогает другим участникам',
    icon: '🤝',
    color: 'bg-pink-100 border-pink-300 text-pink-800',
    criteria: 'Получить 10 благодарностей от участников'
  },
  {
    id: 'goal-achiever',
    title: 'Достигатор целей',
    description: 'Выполнил все задания месяца',
    icon: '🎯',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    criteria: 'Выполнить все задания в течение месяца'
  },
  {
    id: 'sleep-master',
    title: 'Мастер сна',
    description: 'Неделя подряд спал 8+ часов',
    icon: '🌙',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    criteria: 'Спать 8+ часов 7 дней подряд'
  },
  {
    id: 'anxiety-warrior',
    title: 'Борец с тревогой',
    description: 'Снизил уровень тревоги на 3 пункта',
    icon: '💪',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    criteria: 'Уменьшить средний уровень тревоги на 3 пункта'
  },
  {
    id: 'early-bird',
    title: 'Ранняя пташка',
    description: 'Делал утренние чек-ины 14 дней',
    icon: '🌅',
    color: 'bg-cyan-100 border-cyan-300 text-cyan-800',
    criteria: 'Чек-ины до 9:00 утра 14 дней подряд'
  },
  {
    id: 'dream-guardian',
    title: 'Хранитель снов',
    description: 'Поддерживал здоровый сон 30 дней',
    icon: '🌙',
    color: 'bg-violet-100 border-violet-300 text-violet-800',
    criteria: 'Спать 7-9 часов 30 дней подряд'
  }
]

export default function BadgeGrid({ userBadges }: BadgeGridProps) {
  const earnedBadges = availableBadges.filter(badge => userBadges.includes(badge.id))
  const lockedBadges = availableBadges.filter(badge => !userBadges.includes(badge.id))
  
  const progress = Math.round((earnedBadges.length / availableBadges.length) * 100)

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" weight="fill" />
            Твои достижения
          </CardTitle>
          <CardDescription>
            {earnedBadges.length} из {availableBadges.length} наград получено
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Прогресс</span>
            <span className="text-2xl font-bold text-yellow-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          
          {earnedBadges.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" weight="fill" />
              <span className="text-sm text-muted-foreground">
                Последняя награда: {earnedBadges[earnedBadges.length - 1]?.title}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
            Полученные награды ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedBadges.map((badge) => (
              <Card key={badge.id} className={`${badge.color} relative overflow-hidden`}>
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{badge.title}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {badge.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge variant="secondary" className="text-xs">
                    Получено ✨
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-muted-foreground" />
          Доступные награды ({lockedBadges.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lockedBadges.map((badge) => (
            <Card key={badge.id} className="opacity-60 border-dashed">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl grayscale">{badge.icon}</div>
                  <div className="flex-1">
                    <CardTitle className="text-base text-muted-foreground">
                      {badge.title}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {badge.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    Как получить:
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {badge.criteria}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Next Badge Suggestion */}
      {lockedBadges.length > 0 && (
        <Card className="bg-accent/10 border-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Следующая цель</CardTitle>
            <CardDescription>Рекомендуем попробовать получить</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{lockedBadges[0].icon}</div>
              <div className="flex-1">
                <h4 className="font-medium">{lockedBadges[0].title}</h4>
                <p className="text-sm text-muted-foreground">{lockedBadges[0].criteria}</p>
              </div>
              <Badge className="bg-accent/20 text-accent-foreground">
                Попробовать
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
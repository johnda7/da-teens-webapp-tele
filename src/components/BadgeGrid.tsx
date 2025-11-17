import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useShare } from '@/hooks/useShare'
import { Trophy, Star, CheckCircle, Flame, Target, ShareFat } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface BadgeGridProps {
  userBadges: string[]
}

interface BadgeItem {
  id: string
  title: string
  description: string
  icon: string
  category: string
  color: string
  criteria: string
}

const availableBadges: BadgeItem[] = [
  // 🎯 РАСПОЗНАВАНИЕ
  {
    id: 'first-step',
    title: 'Первый шаг',
    description: 'Прошёл регистрацию и начал путешествие',
    icon: '🎯',
    category: 'recognition',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    criteria: 'Зарегистрироваться в приложении'
  },
  {
    id: 'detective',
    title: 'Детектив',
    description: 'Заметил 10 нарушений границ',
    icon: '🔍',
    category: 'recognition',
    color: 'bg-cyan-100 border-cyan-300 text-cyan-800',
    criteria: 'Определить нарушения в 10 ситуациях'
  },
  {
    id: 'analyst',
    title: 'Аналитик',
    description: 'Прошёл все квизы на 100%',
    icon: '🧠',
    category: 'recognition',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    criteria: 'Набрать 100% во всех квизах'
  },
  {
    id: 'intuit',
    title: 'Интуит',
    description: 'Угадал все сигналы тела',
    icon: '👁️',
    category: 'recognition',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    criteria: 'Правильно определить все телесные сигналы'
  },
  {
    id: 'first-adaptive-lesson',
    title: 'Адаптивный старт',
    description: 'Прошёл первый адаптивный урок',
    icon: '⭐',
    category: 'recognition',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    criteria: 'Пройти первый урок в Модуле #1'
  },
  {
    id: 'perfect-score',
    title: 'Перфекционист',
    description: 'Набрал 90+ баллов в квизе',
    icon: '💯',
    category: 'recognition',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    criteria: 'Набрать 90% или больше в любом квизе'
  },
  
  // 🛡️ ЗАЩИТА
  {
    id: 'assert',
    title: 'Ассерт',
    description: 'Сказал "нет" 10 раз уверенно',
    icon: '💪',
    category: 'protection',
    color: 'bg-red-100 border-red-300 text-red-800',
    criteria: 'Практиковать ассертивный отказ 10 раз'
  },
  {
    id: 'castle-defender',
    title: 'Защитник',
    description: 'Защитил замок на всех уровнях',
    icon: '🏰',
    category: 'protection',
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    criteria: 'Пройти все 9 частей Castle Game'
  },
  {
    id: 'persistent',
    title: 'Настойчивый',
    description: 'Не отступил от границы под давлением',
    icon: '🔥',
    category: 'protection',
    color: 'bg-red-100 border-red-300 text-red-800',
    criteria: 'Выдержать 5 атак на границы'
  },
  {
    id: 'boundaries-master',
    title: 'Мастер границ',
    description: 'Завершил все 9 уроков о личных границах',
    icon: '🛡️',
    category: 'protection',
    color: 'bg-green-100 border-green-300 text-green-800',
    criteria: 'Пройти все уроки Модуля #1'
  },
  {
    id: 'no-expert',
    title: 'Эксперт по "Нет"',
    description: 'Использовал все техники отказа',
    icon: '🚫',
    category: 'protection',
    color: 'bg-rose-100 border-rose-300 text-rose-800',
    criteria: 'Применить 5 техник отказа'
  },
  
  // 💬 КОММУНИКАЦИЯ
  {
    id: 'actor',
    title: 'Актёр',
    description: 'Прошёл все role-play scenarios',
    icon: '🎭',
    category: 'communication',
    color: 'bg-pink-100 border-pink-300 text-pink-800',
    criteria: 'Завершить все интерактивные диалоги'
  },
  {
    id: 'mediator',
    title: 'Медиатор',
    description: 'Нашёл баланс в 5 ситуациях',
    icon: '🤝',
    category: 'communication',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    criteria: 'Найти компромисс в 5 случаях'
  },
  {
    id: 'orator',
    title: 'Оратор',
    description: 'Использовал все техники коммуникации',
    icon: '💬',
    category: 'communication',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    criteria: 'Применить все формы общения'
  },
  {
    id: 'communicator',
    title: 'Коммуникатор',
    description: 'Эффективно установил 10 границ',
    icon: '📢',
    category: 'communication',
    color: 'bg-violet-100 border-violet-300 text-violet-800',
    criteria: 'Успешно сказать "нет" 10 раз'
  },
  
  // ⏰ ДИСЦИПЛИНА
  {
    id: 'check-in-streak-7',
    title: 'Неделя осознанности',
    description: '7 дней подряд делал чек-ины',
    icon: '🔥',
    category: 'discipline',
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    criteria: 'Сделать чек-ин 7 дней подряд'
  },
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: '30 дней подряд обучения',
    icon: '🔥',
    category: 'discipline',
    color: 'bg-red-100 border-red-300 text-red-800',
    criteria: 'Поддерживать streak 30 дней'
  },
  {
    id: 'consistency',
    title: 'Консистентность',
    description: 'Учишься 3 недели подряд',
    icon: '📅',
    category: 'discipline',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    criteria: 'Активность 21 день подряд'
  },
  {
    id: 'graduate',
    title: 'Выпускник',
    description: 'Прошёл все 9 уроков модуля',
    icon: '🎓',
    category: 'discipline',
    color: 'bg-green-100 border-green-300 text-green-800',
    criteria: 'Завершить весь модуль'
  },
  {
    id: 'early-bird',
    title: 'Ранняя пташка',
    description: 'Делал утренние чек-ины 14 дней',
    icon: '🌅',
    category: 'discipline',
    color: 'bg-cyan-100 border-cyan-300 text-cyan-800',
    criteria: 'Чек-ины до 9:00 утра 14 дней подряд'
  },
  {
    id: 'consistent-learner',
    title: 'Постоянство',
    description: 'Прошёл 3 урока подряд',
    icon: '📈',
    category: 'discipline',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    criteria: 'Пройти 3 адаптивных урока подряд'
  },
  
  // ❤️ ЭМПАТИЯ
  {
    id: 'listener',
    title: 'Слушатель',
    description: 'Использовал активное слушание',
    icon: '👂',
    category: 'empathy',
    color: 'bg-green-100 border-green-300 text-green-800',
    criteria: 'Применить технику активного слушания'
  },
  {
    id: 'support',
    title: 'Поддержка',
    description: 'Помог другу с границами',
    icon: '🤗',
    category: 'empathy',
    color: 'bg-pink-100 border-pink-300 text-pink-800',
    criteria: 'Поделиться знаниями с другим'
  },
  {
    id: 'community',
    title: 'Сообщество',
    description: 'Поделился в Peer Feed',
    icon: '🌐',
    category: 'empathy',
    color: 'bg-cyan-100 border-cyan-300 text-cyan-800',
    criteria: 'Написать пост в сообществе'
  },
  {
    id: 'mentor',
    title: 'Ментор',
    description: 'Помог 5 друзьям разобраться',
    icon: '🤝',
    category: 'empathy',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    criteria: 'Помочь другим понять границы'
  },
  
  // 🌐 КОНТЕКСТ
  {
    id: 'family-expert',
    title: 'Семейный эксперт',
    description: 'Установил границы с родителями',
    icon: '👨‍👩‍👧',
    category: 'context',
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    criteria: 'Практиковать границы в семье'
  },
  {
    id: 'friend-guardian',
    title: 'Защитник дружбы',
    description: 'Границы с друзьями работают',
    icon: '👥',
    category: 'context',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    criteria: 'Здоровые границы в дружбе'
  },
  {
    id: 'digital-warrior',
    title: 'Цифровой воин',
    description: 'Защитил границы онлайн',
    icon: '📱',
    category: 'context',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    criteria: 'Установить цифровые границы'
  },
  
  // ⭐ ОСОБЫЕ
  {
    id: 'unicorn',
    title: 'Единорог',
    description: '100% mastery по всем навыкам',
    icon: '🦄',
    category: 'special',
    color: 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-800',
    criteria: 'Максимальный уровень всех навыков'
  },
  {
    id: 'boundary-king',
    title: 'Король границ',
    description: 'Полный модуль + все бонусы',
    icon: '👑',
    category: 'special',
    color: 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 text-yellow-800',
    criteria: 'Завершить всё + получить все бонусы'
  },
  {
    id: 'legend',
    title: 'Легенда',
    description: '100 дней использования',
    icon: '💎',
    category: 'special',
    color: 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 text-blue-800',
    criteria: 'Активность 100 дней подряд'
  },
  {
    id: 'sleep-master',
    title: 'Мастер сна',
    description: 'Неделя подряд спал 8+ часов',
    icon: '🌙',
    category: 'special',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    criteria: 'Спать 8+ часов 7 дней подряд'
  },
  {
    id: 'anxiety-warrior',
    title: 'Борец с тревогой',
    description: 'Снизил уровень тревоги на 3 пункта',
    icon: '💪',
    category: 'special',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    criteria: 'Уменьшить тревожность на 3 пункта'
  },
  {
    id: 'practice-master',
    title: 'Мастер практик',
    description: 'Выполнил 20 дыхательных практик',
    icon: '🧘',
    category: 'special',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    criteria: 'Выполнить 20 практик осознанности'
  }
]

export default function BadgeGrid({ userBadges }: BadgeGridProps) {
  const earnedBadges = availableBadges.filter(badge => userBadges.includes(badge.id))
  const lockedBadges = availableBadges.filter(badge => !userBadges.includes(badge.id))
  
  const progress = Math.round((earnedBadges.length / availableBadges.length) * 100)

  // Share functionality
  const { share, isSharing } = useShare({
    onSuccess: () => console.log('Достижения поделены!')
  })

  const handleShare = () => {
    share({
      title: 'Мои достижения в DA Teens',
      text: `Я получил ${earnedBadges.length} из ${availableBadges.length} наград! 🏆`,
      url: window.location.href
    })
  }

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
            <Button
              onClick={handleShare}
              disabled={isSharing}
              className="w-full mt-2"
              variant="outline"
            >
              <ShareFat className="w-4 h-4 mr-2" weight="fill" />
              {isSharing ? 'Отправка...' : 'Поделиться достижениями'}
            </Button>
          )}
          
          {earnedBadges.length > 5 && (
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
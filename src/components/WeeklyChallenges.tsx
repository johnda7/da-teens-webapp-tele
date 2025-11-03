import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Lock, Trophy, Sparkles, Flame } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  icon: string
  day: number
  completed: boolean
  locked: boolean
  xpReward: number
}

interface WeeklyChallenge {
  id: string
  title: string
  description: string
  weekNumber: number
  isActive: boolean
  isCompleted: boolean
  completedDays: number
  totalDays: number
  badgeReward: string
  challenges: Challenge[]
}

// Mock data for demonstration
const weeklyChallenges: WeeklyChallenge[] = [
  {
    id: 'week1-recognition',
    title: 'Челлендж Распознавания',
    description: 'Учимся видеть и понимать свои границы',
    weekNumber: 1,
    isActive: true,
    isCompleted: false,
    completedDays: 3,
    totalDays: 7,
    badgeReward: '🔍 Детектив',
    challenges: [
      {
        id: 'day1',
        title: 'День 1: Наблюдай',
        description: 'Заметь 1 ситуацию, где твои границы могли нарушить',
        icon: '👁️',
        day: 1,
        completed: true,
        locked: false,
        xpReward: 20
      },
      {
        id: 'day2',
        title: 'День 2: Запиши',
        description: 'Запиши свои сигналы тела при нарушении границ',
        icon: '📝',
        day: 2,
        completed: true,
        locked: false,
        xpReward: 25
      },
      {
        id: 'day3',
        title: 'День 3: Определи',
        description: 'Определи свой тип нарушителей (друзья, семья, романтика)',
        icon: '🔍',
        day: 3,
        completed: true,
        locked: false,
        xpReward: 30
      },
      {
        id: 'day4',
        title: 'День 4: Проанализируй',
        description: 'Проанализируй 3 ситуации из своей жизни',
        icon: '🧠',
        day: 4,
        completed: false,
        locked: false,
        xpReward: 35
      },
      {
        id: 'day5',
        title: 'День 5: Расскажи',
        description: 'Расскажи другу о границах своими словами',
        icon: '💬',
        day: 5,
        completed: false,
        locked: false,
        xpReward: 40
      },
      {
        id: 'day6',
        title: 'День 6: Практика',
        description: 'Скажи "нет" уверенно в реальной ситуации',
        icon: '💪',
        day: 6,
        completed: false,
        locked: false,
        xpReward: 50
      },
      {
        id: 'day7',
        title: 'День 7: Рефлексия',
        description: 'Отследи прогресс и запиши 3 открытия',
        icon: '✨',
        day: 7,
        completed: false,
        locked: false,
        xpReward: 60
      }
    ]
  },
  {
    id: 'week2-practice',
    title: 'Челлендж Практики',
    description: 'Переходим к действиям: укрепляем границы',
    weekNumber: 2,
    isActive: false,
    isCompleted: false,
    completedDays: 0,
    totalDays: 7,
    badgeReward: '⚔️ Защитник',
    challenges: [
      {
        id: 'w2day1',
        title: 'День 1: Уверенность',
        description: 'Скажи "нет" уверенно 3 раза сегодня',
        icon: '🎯',
        day: 1,
        completed: false,
        locked: true,
        xpReward: 50
      },
      {
        id: 'w2day2',
        title: 'День 2: Заезженная пластинка',
        description: 'Используй технику повторения в разговоре',
        icon: '🎵',
        day: 2,
        completed: false,
        locked: true,
        xpReward: 55
      },
      {
        id: 'w2day3',
        title: 'День 3: Временная граница',
        description: 'Установи временную границу с близким человеком',
        icon: '⏰',
        day: 3,
        completed: false,
        locked: true,
        xpReward: 60
      },
      {
        id: 'w2day4',
        title: 'День 4: Территория',
        description: 'Защити свою физическую территорию (комната, вещи)',
        icon: '🏰',
        day: 4,
        completed: false,
        locked: true,
        xpReward: 65
      },
      {
        id: 'w2day5',
        title: 'День 5: Без оправданий',
        description: 'Откажи 2 раза без объяснений "почему"',
        icon: '🚫',
        day: 5,
        completed: false,
        locked: true,
        xpReward: 70
      },
      {
        id: 'w2day6',
        title: 'День 6: Семья',
        description: 'Поделись с родителем про границы',
        icon: '👨‍👩‍👧',
        day: 6,
        completed: false,
        locked: true,
        xpReward: 75
      },
      {
        id: 'w2day7',
        title: 'День 7: Празднуй',
        description: 'Отметь свои победы и награди себя',
        icon: '🎉',
        day: 7,
        completed: false,
        locked: true,
        xpReward: 100
      }
    ]
  },
  {
    id: 'week3-mastery',
    title: 'Челлендж Мастерства',
    description: 'Стань экспертом в защите границ',
    weekNumber: 3,
    isActive: false,
    isCompleted: false,
    completedDays: 0,
    totalDays: 7,
    badgeReward: '🏆 Мастер',
    challenges: [
      {
        id: 'w3day1',
        title: 'День 1: Проактивность',
        description: 'Предвидь и предотврати нарушение заранее',
        icon: '⚡',
        day: 1,
        completed: false,
        locked: true,
        xpReward: 100
      },
      {
        id: 'w3day2',
        title: 'День 2: Переговоры',
        description: 'Найди компромисс в спорной ситуации',
        icon: '⚖️',
        day: 2,
        completed: false,
        locked: true,
        xpReward: 105
      },
      {
        id: 'w3day3',
        title: 'День 3: Менторство',
        description: 'Помоги другу установить границы',
        icon: '🤝',
        day: 3,
        completed: false,
        locked: true,
        xpReward: 110
      },
      {
        id: 'w3day4',
        title: 'День 4: Цифровые',
        description: 'Защити свои границы в соцсетях',
        icon: '📱',
        day: 4,
        completed: false,
        locked: true,
        xpReward: 115
      },
      {
        id: 'w3day5',
        title: 'День 5: Эмпатия',
        description: 'Уважай границы другого человека',
        icon: '❤️',
        day: 5,
        completed: false,
        locked: true,
        xpReward: 120
      },
      {
        id: 'w3day6',
        title: 'День 6: Комплексная',
        description: 'Примени все техники за день',
        icon: '🌟',
        day: 6,
        completed: false,
        locked: true,
        xpReward: 125
      },
      {
        id: 'w3day7',
        title: 'День 7: Гуру',
        description: 'Стань экспертом - учи других',
        icon: '🎓',
        day: 7,
        completed: false,
        locked: true,
        xpReward: 150
      }
    ]
  }
]

export default function WeeklyChallenges() {
  const [selectedWeek, setSelectedWeek] = useState(0)

  const activeChallenge = weeklyChallenges.find(w => w.isActive)
  const progress = activeChallenge 
    ? Math.round((activeChallenge.completedDays / activeChallenge.totalDays) * 100)
    : 0

  const totalXP = weeklyChallenges.reduce((sum, week) => 
    sum + week.challenges.reduce((weekSum, ch) => ch.completed ? weekSum + ch.xpReward : weekSum, 0), 0
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-2">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Card className="p-2 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Активен</div>
            <div className="text-lg font-bold text-orange-700">
              {activeChallenge?.weekNumber || '—'}
            </div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">Дней</div>
            <div className="text-lg font-bold text-green-700">
              {activeChallenge?.completedDays || 0}/{activeChallenge?.totalDays || 7}
            </div>
          </div>
        </Card>
        
        <Card className="p-2 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-0.5">XP</div>
            <div className="text-lg font-bold text-purple-700">{totalXP}</div>
          </div>
        </Card>
      </div>

      {/* Week Tabs */}
      <div className="mb-3">
        <div className="flex gap-1.5 overflow-x-auto pb-2">
          {weeklyChallenges.map((week, idx) => (
            <motion.button
              key={week.id}
              onClick={() => setSelectedWeek(idx)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg font-medium text-xs transition-all whitespace-nowrap ${
                selectedWeek === idx
                  ? week.isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {week.isCompleted && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
              Неделя {week.weekNumber}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Week Card */}
      {weeklyChallenges[selectedWeek] && (
        <Card className="glass rounded-xl p-3 border border-white/40 mb-3">
          <div className="mb-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                  {weeklyChallenges[selectedWeek].title}
                </h3>
                <p className="text-xs text-gray-600">
                  {weeklyChallenges[selectedWeek].description}
                </p>
              </div>
              
              <Badge className={`text-[9px] px-2 py-0.5 h-5 ${
                weeklyChallenges[selectedWeek].isCompleted
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : weeklyChallenges[selectedWeek].isActive
                  ? 'bg-orange-100 text-orange-700 border-orange-300'
                  : 'bg-gray-100 text-gray-500 border-gray-300'
              }`}>
                {weeklyChallenges[selectedWeek].isCompleted
                  ? 'Завершено'
                  : weeklyChallenges[selectedWeek].isActive
                  ? 'Активен'
                  : 'Заблокировано'}
              </Badge>
            </div>

            {/* Progress Bar */}
            {weeklyChallenges[selectedWeek].isActive && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-600">
                    День {weeklyChallenges[selectedWeek].completedDays} из {weeklyChallenges[selectedWeek].totalDays}
                  </span>
                  <span className="text-[10px] font-bold text-orange-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Badge Reward */}
            <div className="mt-2 p-2 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-bold text-yellow-800">
                  Награда: {weeklyChallenges[selectedWeek].badgeReward}
                </span>
              </div>
            </div>
          </div>

          {/* Challenges List */}
          <div className="space-y-2">
            {weeklyChallenges[selectedWeek].challenges.map((challenge) => (
              <motion.div
                key={challenge.id}
                className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                  challenge.completed
                    ? 'border-green-300 bg-green-50'
                    : challenge.locked
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white hover:border-orange-300'
                }`}
                whileHover={!challenge.locked ? { scale: 1.02 } : {}}
              >
                <div className="p-2">
                  <div className="flex items-start gap-2">
                    <div className="text-2xl flex-shrink-0">{challenge.icon}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={`text-xs font-bold ${
                          challenge.completed ? 'text-green-800' : challenge.locked ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                          {challenge.title}
                        </h4>
                        {challenge.completed && (
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className={`text-[10px] leading-relaxed ${
                        challenge.completed ? 'text-green-700' : challenge.locked ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {challenge.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {challenge.completed && (
                        <Badge className="bg-green-100 text-green-700 border-green-300 text-[9px] px-1.5 py-0 h-4">
                          +{challenge.xpReward} XP
                        </Badge>
                      )}
                      {challenge.locked && (
                        <Lock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {!challenge.completed && !challenge.locked && (
                    <motion.button
                      className="w-full mt-2 py-1.5 px-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Выполнить
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Completion Message */}
          {weeklyChallenges[selectedWeek].isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h4 className="text-sm font-bold text-green-800">Неделя завершена!</h4>
              </div>
              <p className="text-xs text-green-700 mb-2">
                Отличная работа! Ты освоил все навыки этой недели.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{weeklyChallenges[selectedWeek].badgeReward}</span>
                <span className="text-xs font-bold text-green-800">
                  Награда получена!
                </span>
              </div>
            </motion.div>
          )}
        </Card>
      )}
    </div>
  )
}


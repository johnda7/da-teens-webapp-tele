/**
 * ParentDashboard Component
 * 
 * Dashboard для родителей - видят прогресс своего ребёнка + своё обучение
 * Философия Jobs: Простота, прозрачность, забота
 */

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  TrendUp, 
  BookOpen, 
  Calendar,
  Flame,
  Lightning,
  CheckCircle,
  Shield
} from '@phosphor-icons/react'

interface ChildProgress {
  name: string
  age: number
  telegramId?: string
  currentModule: number
  currentWeek: number
  completedLessons: number
  totalLessons: number
  streak: number
  totalXP: number
  level: number
  attendance: number // процент посещаемости вебинаров
  lastActivity?: string // "2 дня назад"
}

interface ParentProgress {
  currentModule: number
  completedLessons: number
  totalLessons: number
  lastActivity?: string
}

interface ParentDashboardProps {
  childProgress?: ChildProgress
  parentProgress?: ParentProgress
}

export default function ParentDashboard({ 
  childProgress,
  parentProgress 
}: ParentDashboardProps) {
  
  // Если нет данных о ребёнке
  if (!childProgress && !parentProgress) {
    return (
      <div className="p-4 space-y-6">
        {/* Empty State - Jobs minimalism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" weight="fill" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Привет, родитель!
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Подключи профиль ребёнка, чтобы отслеживать его прогресс и видеть, как идёт обучение
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Подключить ребёнка
          </button>
        </motion.div>
      </div>
    )
  }

  const childProgressPercent = childProgress 
    ? Math.round((childProgress.completedLessons / childProgress.totalLessons) * 100)
    : 0

  const parentProgressPercent = parentProgress
    ? Math.round((parentProgress.completedLessons / parentProgress.totalLessons) * 100)
    : 0

  return (
    <div className="p-4 space-y-6">
      {/* Прогресс ребёнка */}
      {childProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border border-gray-200 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {childProgress.name}, {childProgress.age} лет
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Подросток
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Прогресс модуля</span>
                  <span className="text-sm font-semibold text-gray-900">{childProgressPercent}%</span>
                </div>
                <Progress value={childProgressPercent} className="h-2" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-orange-100 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-orange-600" weight="fill" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{childProgress.streak}</div>
                  <div className="text-[10px] text-gray-500">дней</div>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-blue-100 flex items-center justify-center">
                    <Lightning className="w-5 h-5 text-blue-600" weight="fill" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{childProgress.totalXP}</div>
                  <div className="text-[10px] text-gray-500">XP</div>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" weight="fill" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{childProgress.level}</div>
                  <div className="text-[10px] text-gray-500">уровень</div>
                </div>

                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendUp className="w-5 h-5 text-purple-600" weight="fill" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{childProgress.attendance}%</div>
                  <div className="text-[10px] text-gray-500">был</div>
                </div>
              </div>

              {/* Last Activity */}
              {childProgress.lastActivity && (
                <div className="text-xs text-gray-500 text-center pt-2">
                  Последняя активность: {childProgress.lastActivity}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Моё обучение (уроки для родителей) */}
      {parentProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" weight="fill" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Моё обучение
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Личные границы для родителей</span>
                  <span className="text-sm font-semibold text-gray-900">{parentProgressPercent}%</span>
                </div>
                <Progress value={parentProgressPercent} className="h-2" />
                <p className="text-xs text-gray-600 mt-2">
                  {parentProgress.completedLessons} из {parentProgress.totalLessons} уроков
                </p>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Продолжить обучение
              </button>

              {parentProgress.lastActivity && (
                <div className="text-xs text-gray-600 text-center">
                  Последняя активность: {parentProgress.lastActivity}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}


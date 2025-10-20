// Hero-секция для модуля "Границы" в стиле Google Learn Your Way
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Lightning, 
  ChartLine, 
  Trophy,
  Heart,
  Brain,
  Shield
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface BoundariesHeroProps {
  onStartLearning: () => void
  progress: {
    lessonsCompleted: number
    totalLessons: number
    xpEarned: number
    streak: number
    skillsUnlocked: number
  }
  hasCheckIn: boolean
  onCheckIn?: () => void
}

export default function BoundariesHero({ 
  onStartLearning, 
  progress,
  onCheckIn,
  hasCheckIn 
}: BoundariesHeroProps) {
  const completionPercentage = (progress.lessonsCompleted / progress.totalLessons) * 100

  return (
    <div className="space-y-6">
      {/* Main Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 border-0 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative p-8 md:p-12">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge className="mb-3 bg-white/20 text-white border-white/30">
                  ✨ Адаптивный модуль
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">
                  🛡️ Личные границы
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
                  Научись говорить "нет", защищать своё пространство и строить здоровые отношения
                </p>
              </div>
              
              {/* Animated Shield Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="hidden md:block"
              >
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Shield size={48} weight="fill" />
                </div>
              </motion.div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{progress.totalLessons}</div>
                <div className="text-sm text-white/80">Уроков</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-white/80">Форматов</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">3-4</div>
                <div className="text-sm text-white/80">Недели</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">24</div>
                <div className="text-sm text-white/80">Вехи роста</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg"
                onClick={onStartLearning}
                className="bg-white text-purple-600 hover:bg-white/90 gap-2 text-lg px-8"
              >
                <Play size={24} weight="fill" />
                {progress.lessonsCompleted === 0 ? 'Начать путешествие' : 'Продолжить обучение'}
              </Button>
              {!hasCheckIn && onCheckIn && (
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={onCheckIn}
                  className="border-white/30 text-white hover:bg-white/10 gap-2"
                >
                  <Heart size={20} weight="fill" />
                  Сделать чек-ин
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Progress Stats */}
      {progress.lessonsCompleted > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Progress Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ChartLine size={24} className="text-purple-600" weight="fill" />
                  <span className="font-semibold">Прогресс</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {progress.lessonsCompleted} из {progress.totalLessons} уроков пройдено
              </p>
            </Card>

            {/* XP Card */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lightning size={24} className="text-orange-600" weight="fill" />
                  <span className="font-semibold">Опыт (XP)</span>
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {progress.xpEarned}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy size={16} weight="fill" />
                <span>Продолжай в том же духе!</span>
              </div>
            </Card>

            {/* Skills Card */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain size={24} className="text-green-600" weight="fill" />
                  <span className="font-semibold">Навыки</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {progress.skillsUnlocked}/6
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield size={16} weight="fill" />
                <span>Разблокировано навыков</span>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Motivational Message */}
      {progress.lessonsCompleted === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart size={24} className="text-blue-600" weight="fill" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Добро пожаловать в модуль "Личные границы"!
                </h3>
                <p className="text-sm text-blue-700">
                  Этот модуль адаптируется под твоё эмоциональное состояние. 
                  Сделай чек-ин перед началом, чтобы получить персонализированные рекомендации.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Streak Info */}
      {progress.streak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔥</div>
                <div>
                  <div className="font-semibold">
                    Серия {progress.streak} {progress.streak === 1 ? 'день' : progress.streak < 5 ? 'дня' : 'дней'}!
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Отличная работа! Продолжай учиться каждый день
                  </div>
                </div>
              </div>
              {progress.streak >= 7 && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                  Огонь! 🎉
                </Badge>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

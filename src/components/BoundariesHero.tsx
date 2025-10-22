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
import GamificationPanel from './GamificationPanel'
import type { GamificationProgress } from '@/lib/gamification'

interface BoundariesHeroProps {
  onStartLearning: () => void
  progress: {
    lessonsCompleted: number
    totalLessons: number
    xpEarned: number
    streak: number
    skillsUnlocked: number
  }
  gamificationProgress?: GamificationProgress // Новое!
  hasCheckIn: boolean
  onCheckIn?: () => void
}

export default function BoundariesHero({ 
  onStartLearning, 
  progress,
  gamificationProgress,
  onCheckIn,
  hasCheckIn 
}: BoundariesHeroProps) {
  const completionPercentage = (progress.lessonsCompleted / progress.totalLessons) * 100

  return (
    <div className="space-y-6">
      {/* Gamification Panel - если есть данные */}
      {gamificationProgress && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <GamificationPanel progress={gamificationProgress} compact={false} />
        </motion.div>
      )}

      {/* Main Hero Card - iOS 26 Liquid Glass + Perplexity минимализм */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-0 shadow-[0_8px_32px_rgba(139,92,246,0.15)]">
          {/* Subtle gradient overlay - minimal по Perplexity */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-pink-50/40 pointer-events-none" />
          
          {/* Animated orb accent - один, не три - минимализм! */}
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="relative p-8 md:p-12">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-4">
                {/* Badge - iOS 26 style */}
                <Badge className="ios-caption1 bg-purple-100 text-purple-700 border-purple-200 shadow-ios-soft">
                  ✨ Адаптивный модуль
                </Badge>
                
                {/* Title - iOS 26 Typography: ios-title1 */}
                <h1 className="ios-title1 text-gray-900 leading-tight">
                  🛡️ Личные границы
                </h1>
                
                {/* Subtitle - iOS 26 Typography: ios-body, Perplexity простота */}
                <p className="ios-body text-gray-600 max-w-2xl">
                  Научись говорить "нет", защищать своё пространство и строить здоровые отношения
                </p>
              </div>
              
              {/* Animated Shield Icon - spring physics как у Apple */}
              <motion.div
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="hidden md:block"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-ios-soft">
                  <Shield size={40} weight="fill" className="text-purple-600" />
                </div>
              </motion.div>
            </div>

            {/* Features Grid - iOS 26: 8px grid, Liquid Glass cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div 
                className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-4 shadow-ios-soft border border-purple-100/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="ios-title2 text-purple-600">{progress.totalLessons}</div>
                <div className="ios-caption1 text-gray-600">Уроков</div>
              </motion.div>
              <motion.div 
                className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-4 shadow-ios-soft border border-blue-100/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="ios-title2 text-blue-600">5</div>
                <div className="ios-caption1 text-gray-600">Форматов</div>
              </motion.div>
              <motion.div 
                className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-4 shadow-ios-soft border border-pink-100/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="ios-title2 text-pink-600">3-4</div>
                <div className="ios-caption1 text-gray-600">Недели</div>
              </motion.div>
              <motion.div 
                className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-4 shadow-ios-soft border border-indigo-100/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="ios-title2 text-indigo-600">24</div>
                <div className="ios-caption1 text-gray-600">Вехи роста</div>
              </motion.div>
            </div>

            {/* CTA Buttons - iOS 26: 44x44pt touch targets, spring animations */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  size="lg"
                  onClick={onStartLearning}
                  className="ios-body-emphasized h-[44px] bg-purple-600 text-white hover:bg-purple-700 shadow-ios-soft gap-2 px-8 rounded-xl"
                >
                  <Play size={20} weight="fill" />
                  {progress.lessonsCompleted === 0 ? 'Начать путешествие' : 'Продолжить обучение'}
                </Button>
              </motion.div>
              {!hasCheckIn && onCheckIn && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={onCheckIn}
                    className="ios-body h-[44px] border-purple-200 text-purple-700 hover:bg-purple-50 gap-2 rounded-xl shadow-ios-soft"
                  >
                    <Heart size={18} weight="fill" />
                    Сделать чек-ин
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Progress Stats - iOS 26 Liquid Glass cards */}
      {progress.lessonsCompleted > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Progress Card */}
            <Card className="p-6 bg-white/70 backdrop-blur-[40px] border-purple-100/50 shadow-ios-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <ChartLine size={20} className="text-purple-600" weight="fill" />
                  </div>
                  <span className="ios-body-emphasized text-gray-900">Прогресс</span>
                </div>
                <span className="ios-title2 text-purple-600">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className="ios-caption1 text-gray-600 mt-3">
                {progress.lessonsCompleted} из {progress.totalLessons} уроков пройдено
              </p>
            </Card>

            {/* XP Card */}
            <Card className="p-6 bg-white/70 backdrop-blur-[40px] border-orange-100/50 shadow-ios-soft relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/30 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <Lightning size={20} className="text-orange-600" weight="fill" />
                    </div>
                    <span className="ios-body-emphasized text-gray-900">Опыт (XP)</span>
                  </div>
                  <span className="ios-title2 text-orange-600">
                    {progress.xpEarned}
                  </span>
                </div>
                <div className="flex items-center gap-2 ios-caption1 text-gray-600">
                  <Trophy size={14} weight="fill" />
                  <span>Продолжай в том же духе!</span>
                </div>
              </div>
            </Card>

            {/* Skills Card */}
            <Card className="p-6 bg-white/70 backdrop-blur-[40px] border-green-100/50 shadow-ios-soft relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/30 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Brain size={20} className="text-green-600" weight="fill" />
                    </div>
                    <span className="ios-body-emphasized text-gray-900">Навыки</span>
                  </div>
                  <span className="ios-title2 text-green-600">
                    {progress.skillsUnlocked}/6
                  </span>
                </div>
                <div className="flex items-center gap-2 ios-caption1 text-gray-600">
                  <Shield size={14} weight="fill" />
                  <span>Разблокировано навыков</span>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Motivational Message - Perplexity простота: прозрачность → доверие */}
      {progress.lessonsCompleted === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
          }}
        >
          <Card className="p-6 bg-white/70 backdrop-blur-[40px] border-blue-100/50 shadow-ios-soft relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 pointer-events-none" />
            <div className="relative flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Heart size={24} className="text-blue-600" weight="fill" />
              </div>
              <div className="space-y-2">
                <h3 className="ios-body-emphasized text-gray-900">
                  Добро пожаловать в модуль "Личные границы"!
                </h3>
                <p className="ios-caption1 text-gray-600">
                  Этот модуль адаптируется под твоё эмоциональное состояние. 
                  Сделай чек-ин перед началом, чтобы получить персонализированные рекомендации.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Streak Info - iOS 26 + Perplexity мотивация */}
      {progress.streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.3
          }}
        >
          <Card className="p-5 bg-white/70 backdrop-blur-[40px] border-orange-100/50 shadow-ios-soft relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-50/30 pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-4xl"
                >
                  🔥
                </motion.div>
                <div>
                  <div className="ios-body-emphasized text-gray-900">
                    Серия {progress.streak} {progress.streak === 1 ? 'день' : progress.streak < 5 ? 'дня' : 'дней'}!
                  </div>
                  <div className="ios-caption1 text-gray-600">
                    Отличная работа! Продолжай учиться каждый день
                  </div>
                </div>
              </div>
              {progress.streak >= 7 && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 ios-caption1">
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

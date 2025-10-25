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
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-0 shadow-[0_8px_32px_rgba(0,122,255,0.15)]">
          {/* Subtle gradient overlay - minimal по Perplexity */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-blue-50/40 pointer-events-none" />
          
          {/* Animated orb accent - один, не три - минимализм! */}
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"
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

          <div className="relative p-5 md:p-7">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-2">
                {/* Badge - iOS 26 style */}
                <Badge className="text-[11px] bg-blue-100 text-blue-700 border-blue-200 shadow-ios-soft">
                  ✨ Адаптивный модуль
                </Badge>
                
                {/* Title - компактнее */}
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  🛡️ Личные границы
                </h1>
                
                {/* Subtitle - короче */}
                <p className="text-[13px] text-gray-600 max-w-xl leading-snug">
                  Научись говорить "нет" и строить здоровые отношения
                </p>
              </div>
            </div>

            {/* Features Grid - меньше карточек, компактнее */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <motion.div 
                className="bg-white/60 backdrop-blur-[20px] rounded-xl p-3 shadow-ios-soft border border-blue-100/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="text-lg font-bold text-blue-600">{progress.totalLessons}</div>
                <div className="text-[10px] text-gray-600">Уроков</div>
              </motion.div>
              <motion.div 
                className="bg-white/60 backdrop-blur-[20px] rounded-xl p-3 shadow-ios-soft border border-green-100/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="text-lg font-bold text-green-600">5</div>
                <div className="text-[10px] text-gray-600">Форматов</div>
              </motion.div>
              <motion.div 
                className="bg-white/60 backdrop-blur-[20px] rounded-xl p-3 shadow-ios-soft border border-orange-100/50"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <div className="text-lg font-bold text-orange-600">3-4</div>
                <div className="text-[10px] text-gray-600">Недели</div>
              </motion.div>
            </div>

            {/* CTA Buttons - компактнее */}
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button 
                  size="default"
                  onClick={onStartLearning}
                  className="text-sm h-10 bg-blue-500 text-white hover:bg-blue-600 shadow-ios-soft gap-2 px-6 rounded-xl"
                >
                  <Play size={16} weight="fill" />
                  {progress.lessonsCompleted === 0 ? 'Начать' : 'Продолжить'}
                </Button>
              </motion.div>
              {!hasCheckIn && onCheckIn && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button 
                    size="default"
                    variant="outline"
                    onClick={onCheckIn}
                    className="text-sm h-10 border-blue-200 text-blue-700 hover:bg-blue-50 gap-2 rounded-xl shadow-ios-soft"
                  >
                    <Heart size={16} weight="fill" />
                    Чек-ин
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
            <Card className="p-6 bg-white/70 backdrop-blur-[40px] border-blue-100/50 shadow-ios-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ChartLine size={20} className="text-[#007AFF]" weight="fill" />
                  </div>
                  <span className="ios-body-emphasized text-gray-900">Прогресс</span>
                </div>
                <span className="ios-title2 text-[#007AFF]">
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full"
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/30 pointer-events-none" />
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

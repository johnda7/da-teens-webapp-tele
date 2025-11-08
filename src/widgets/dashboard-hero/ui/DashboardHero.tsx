/**
 * Dashboard Hero Widget
 * 
 * FSD Layer: Widgets
 * Композитный UI компонент приветствия на главном экране
 */

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Flame, Lightning, Target, TrendUp } from '@phosphor-icons/react'

interface DashboardHeroProps {
  userName: string
  currentWeek: number
  streak: number
  totalXP: number
  level: number
  completedLessons: number
  onContinueLearning: () => void
  onCheckIn: () => void
}

export function DashboardHero({
  userName,
  currentWeek,
  streak,
  totalXP,
  level,
  completedLessons,
  onContinueLearning,
  onCheckIn
}: DashboardHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative overflow-hidden rounded-2xl border-0"
    >
      {/* iOS 26 Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#007AFF] via-[#5AC8FA] to-[#007AFF] opacity-95" />
      
      {/* Animated Liquid Glass circles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        {/* Welcome Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-white/90 mb-1">
            Привет, {userName}! 👋
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Продолжай расти! 🌱
          </h1>
          <p className="text-sm text-white/80 max-w-2xl">
            Неделя {currentWeek}. Каждый день делает тебя сильнее!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Streak */}
          <Card className="backdrop-blur-xl border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-6 h-6 text-orange-300" weight="fill" />
                <span className="text-xs text-white/70">Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{streak}</p>
              <p className="text-xs text-white/70">дней подряд</p>
            </CardContent>
          </Card>

          {/* XP & Level */}
          <Card className="backdrop-blur-xl border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Lightning className="w-6 h-6 text-yellow-300" weight="fill" />
                <span className="text-xs text-white/70">XP</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalXP}</p>
              <p className="text-xs text-white/70">Уровень {level}</p>
            </CardContent>
          </Card>

          {/* Completed Lessons */}
          <Card className="backdrop-blur-xl border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-green-300" weight="fill" />
                <span className="text-xs text-white/70">Уроки</span>
              </div>
              <p className="text-2xl font-bold text-white">{completedLessons}</p>
              <p className="text-xs text-white/70">завершено</p>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="backdrop-blur-xl border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendUp className="w-6 h-6 text-blue-300" weight="fill" />
                <span className="text-xs text-white/70">Прогресс</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {Math.round((completedLessons / 9) * 100)}%
              </p>
              <p className="text-xs text-white/70">модуль</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={onContinueLearning}
            className="flex-1 h-11 rounded-xl text-white font-semibold shadow-lg active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)' }}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Lightning weight="fill" className="w-5 h-5" />
              {completedLessons > 0 ? 'Продолжить' : 'Начать'}
            </span>
          </button>
          
          <button
            onClick={onCheckIn}
            className="flex-1 h-11 rounded-xl border border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
          >
            ❤️ Чек‑ин
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default DashboardHero

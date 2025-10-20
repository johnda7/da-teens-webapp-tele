import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Flame, Lightning, Target, TrendUp, Calendar, Users } from '@phosphor-icons/react'

interface DashboardHeroProps {
  userName: string
  currentModule: number
  streak: number
  totalXP: number
  completedModules: number
  cohortName: string
  onContinueLearning: () => void
  onCheckIn: () => void
}

export default function DashboardHero({
  userName,
  currentModule,
  streak,
  totalXP,
  completedModules,
  cohortName,
  onContinueLearning,
  onCheckIn
}: DashboardHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative overflow-hidden rounded-ios-xl glass border-0 safe-x"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 opacity-90" />
      
      {/* Animated circles */}
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
          <p className="text-ios-subheadline text-white/90 mb-1">
            Привет, {userName}! 👋
          </p>
          <h1 className="text-ios-large font-bold text-white mb-2">
            Продолжай расти! 🌱
          </h1>
          <p className="text-ios-callout text-white/80 max-w-2xl">
            Ты проходишь модуль #{currentModule}. Каждый день делает тебя сильнее!
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
          <Card className="glass-sm border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-6 h-6 text-orange-300" weight="fill" />
                <span className="text-ios-caption text-white/70">Streak</span>
              </div>
              <p className="text-ios-title2 font-bold text-white">{streak}</p>
              <p className="text-ios-caption2 text-white/70">дней подряд</p>
            </CardContent>
          </Card>

          {/* XP */}
          <Card className="glass-sm border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Lightning className="w-6 h-6 text-yellow-300" weight="fill" />
                <span className="text-ios-caption text-white/70">XP</span>
              </div>
              <p className="text-ios-title2 font-bold text-white">{totalXP}</p>
              <p className="text-ios-caption2 text-white/70">очков опыта</p>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card className="glass-sm border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-green-300" weight="fill" />
                <span className="text-ios-caption text-white/70">Progress</span>
              </div>
              <p className="text-ios-title2 font-bold text-white">{completedModules}/12</p>
              <p className="text-ios-caption2 text-white/70">модулей</p>
            </CardContent>
          </Card>

          {/* Cohort */}
          <Card className="glass-sm border-white/20 bg-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 text-blue-300" weight="fill" />
                <span className="text-ios-caption text-white/70">Cohort</span>
              </div>
              <p className="text-ios-footnote font-semibold text-white truncate">{cohortName}</p>
              <p className="text-ios-caption2 text-white/70">твоя группа</p>
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
          <Button
            size="lg"
            onClick={onContinueLearning}
            className="flex-1 bg-white text-purple-600 hover:bg-white/90 touch-feedback rounded-ios-md h-touch-min text-ios-body font-semibold shadow-elevated"
          >
            <TrendUp className="w-5 h-5 mr-2" weight="bold" />
            Продолжить обучение
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onCheckIn}
            className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md touch-feedback rounded-ios-md h-touch-min text-ios-body font-semibold"
          >
            <Calendar className="w-5 h-5 mr-2" weight="bold" />
            Check-in
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Flame, Lightning, Target, TrendUp, Users, Sparkle, Heart } from '@phosphor-icons/react'

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
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-0 shadow-[0_8px_32px_rgba(0,122,255,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/30 to-blue-100/40 pointer-events-none" />
          <motion.div
            className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.1, 0.15] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-10 right-1/4 w-56 h-56 bg-blue-300/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative p-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-2">
              <Badge className="ios-caption1 bg-blue-100 text-blue-700 border-blue-200 shadow-ios-soft mb-1.5">
                <Sparkle size={10} weight="fill" className="mr-1" />
                Твоя личная платформа роста
              </Badge>
              <h1 className="text-lg font-bold text-gray-900 mb-0.5">Привет, {userName}! 👋</h1>
              <p className="text-[11px] text-gray-600 max-w-2xl">
                Ты проходишь <span className="font-semibold text-blue-600">модуль #{currentModule}</span>. Каждый день делает тебя сильнее! 🌱
              </p>
            </motion.div>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Card className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-3 shadow-ios-soft border border-orange-100/50 h-full">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-1">
                      <Flame className="w-5 h-5 text-orange-500" weight="fill" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-0">{streak}</p>
                    <p className="text-[10px] text-gray-600">дней подряд</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Card className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-3 shadow-ios-soft border border-blue-100/50 h-full">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-1">
                      <Lightning className="w-5 h-5 text-blue-500" weight="fill" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-0">{totalXP}</p>
                    <p className="text-[10px] text-gray-600">очков опыта</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Card className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-3 shadow-ios-soft border border-green-100/50 h-full">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-1">
                      <Target className="w-5 h-5 text-green-500" weight="fill" />
                    </div>
                    <p className="text-xl font-bold text-gray-900 mb-0">{completedModules}/12</p>
                    <p className="text-[10px] text-gray-600">модулей</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Card className="bg-white/60 backdrop-blur-[20px] rounded-2xl p-3 shadow-ios-soft border border-blue-100/50 h-full">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-1">
                      <Users className="w-5 h-5 text-blue-500" weight="fill" />
                    </div>
                    <p className="text-[11px] font-semibold text-gray-900 truncate mb-0">{cohortName}</p>
                    <p className="text-[10px] text-gray-600">твоя группа</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
            <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" onClick={onContinueLearning} className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-ios-soft text-base gap-2">
                  <TrendUp size={20} weight="fill" />
                  Продолжить обучение
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" variant="outline" onClick={onCheckIn} className="h-11 border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl shadow-ios-soft text-base gap-2">
                  <Heart size={18} weight="fill" />
                  Check-in
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

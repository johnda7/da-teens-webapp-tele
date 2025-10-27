import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightning, 
  Flame, 
  Medal, 
  TrendUp,
  Star,
  Target,
  Crown,
  Heart,
  ChartLine,
  Sparkle
} from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { GamificationProgress } from '@/lib/gamification'

interface GamificationPanelProps {
  progress: GamificationProgress
  compact?: boolean
}

export default function GamificationPanel({ progress, compact = false }: GamificationPanelProps) {
  const [showAllBadges, setShowAllBadges] = useState(false)

  // Расчёт прогресса до следующего уровня
  const xpForCurrentLevel = Math.pow(progress.level - 1, 2) * 100
  const xpForNextLevel = Math.pow(progress.level, 2) * 100
  const xpProgress = ((progress.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100

  if (compact) {
    return <CompactGamificationBar progress={progress} />
  }

  return (
    <div className="space-y-4">
      {/* XP & Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-purple-100/50 shadow-ios-soft">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-transparent to-blue-50/30 pointer-events-none" />
          
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Crown size={24} className="text-white" weight="fill" />
                </motion.div>
                <div>
                  <div className="ios-caption1 text-gray-600">Уровень</div>
                  <div className="ios-title2 font-bold text-gray-900">{progress.level}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="ios-caption1 text-gray-600">XP</div>
                <div className="ios-body font-semibold text-purple-600">
                  {progress.xp.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Progress bar to next level */}
            <div className="space-y-2">
              <div className="flex justify-between ios-caption1 text-gray-600">
                <span>До {progress.level + 1} уровня</span>
                <span>{Math.round(xpProgress)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak & Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      >
        {/* Streak Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-orange-100/50 shadow-ios-soft">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/40 via-transparent to-red-50/20 pointer-events-none" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-2">
              <motion.div
                animate={{ 
                  scale: progress.streak > 0 ? [1, 1.2, 1] : 1,
                  rotate: progress.streak > 0 ? [0, 10, -10, 0] : 0
                }}
                transition={{ 
                  duration: 2,
                  repeat: progress.streak >= 7 ? Infinity : 0,
                  repeatDelay: 1
                }}
              >
                <Flame 
                  size={32} 
                  className={progress.streak >= 7 ? "text-orange-500" : "text-gray-300"} 
                  weight="fill" 
                />
              </motion.div>
              {progress.streak >= 7 && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 ios-caption1">
                  🔥 Горишь!
                </Badge>
              )}
            </div>
            <div className="ios-title2 font-bold text-gray-900">{progress.streak}</div>
            <div className="ios-caption1 text-gray-600">дней подряд</div>
            {progress.longestStreak > progress.streak && (
              <div className="mt-2 ios-caption1 text-gray-500">
                Рекорд: {progress.longestStreak}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wellness Score Card */}
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-green-100/50 shadow-ios-soft">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-transparent to-blue-50/20 pointer-events-none" />
          <CardContent className="p-4 relative">
            <div className="flex items-start justify-between mb-2">
              <Heart size={32} className="text-green-500" weight="fill" />
              <Badge className="bg-green-100 text-green-700 border-green-200 ios-caption1">
                {progress.wellnessScore >= 80 ? '💚 Отлично' : 
                 progress.wellnessScore >= 60 ? '💛 Хорошо' : 
                 '💙 Растешь'}
              </Badge>
            </div>
            <div className="ios-title2 font-bold text-gray-900">{progress.wellnessScore}</div>
            <div className="ios-caption1 text-gray-600">Wellness Score</div>
            <div className="mt-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.wellnessScore}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-yellow-100/50 shadow-ios-soft">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-transparent to-orange-50/20 pointer-events-none" />
          <CardContent className="p-5 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Medal size={24} className="text-yellow-600" weight="fill" />
                <span className="ios-body font-semibold text-gray-900">Достижения</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 ios-caption1">
                {progress.badges.length}
              </Badge>
            </div>

            {/* Recent badges grid */}
            <div className="grid grid-cols-4 gap-3">
              <AnimatePresence>
                {progress.badges.slice(0, showAllBadges ? undefined : 8).map((userBadge, idx) => (
                  <motion.div
                    key={userBadge.badgeId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: idx * 0.05 
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="aspect-square"
                  >
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 border border-yellow-200 flex items-center justify-center text-3xl shadow-sm">
                      {getBadgeIcon(userBadge.badgeId)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {progress.badges.length > 8 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllBadges(!showAllBadges)}
                className="w-full mt-4 ios-caption1"
              >
                {showAllBadges ? 'Скрыть' : `Показать все (${progress.badges.length})`}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotional Growth Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
      >
        <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-blue-100/50 shadow-ios-soft">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none" />
          <CardContent className="p-5 relative space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ChartLine size={24} className="text-blue-600" weight="fill" />
              <span className="ios-body font-semibold text-gray-900">Эмоциональный рост</span>
            </div>

            {/* Growth metrics */}
            <EmotionalMetricBar 
              label="Уверенность в границах"
              value={progress.emotionalGrowthMetrics.boundaryConfidence}
              color="purple"
              icon={<Target size={18} weight="fill" />}
            />
            <EmotionalMetricBar 
              label="Навыки общения"
              value={progress.emotionalGrowthMetrics.communicationSkills}
              color="blue"
              icon={<Sparkle size={18} weight="fill" />}
            />
            <EmotionalMetricBar 
              label="Самоосознанность"
              value={progress.emotionalGrowthMetrics.selfAwarenessLevel}
              color="green"
              icon={<Star size={18} weight="fill" />}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// ============================================
// Compact Bar (для header)
// ============================================

function CompactGamificationBar({ progress }: { progress: GamificationProgress }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/60 backdrop-blur-[20px] rounded-full border border-gray-100 shadow-sm">
      {/* Level */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white ios-caption1 font-bold">
          {progress.level}
        </div>
      </div>

      {/* XP */}
      <div className="flex items-center gap-1.5">
        <Lightning size={16} className="text-purple-600" weight="fill" />
        <span className="ios-caption1 font-semibold text-gray-700">
          {progress.xp.toLocaleString()}
        </span>
      </div>

      {/* Streak */}
      {progress.streak > 0 && (
        <div className="flex items-center gap-1.5">
          <Flame 
            size={16} 
            className={progress.streak >= 7 ? "text-orange-500" : "text-gray-400"} 
            weight="fill" 
          />
          <span className="ios-caption1 font-semibold text-gray-700">
            {progress.streak}
          </span>
        </div>
      )}

      {/* Badges count */}
      <div className="flex items-center gap-1.5">
        <Medal size={16} className="text-yellow-600" weight="fill" />
        <span className="ios-caption1 font-semibold text-gray-700">
          {progress.badges.length}
        </span>
      </div>
    </div>
  )
}

// ============================================
// Emotional Metric Bar
// ============================================

interface EmotionalMetricBarProps {
  label: string
  value: number
  color: 'purple' | 'blue' | 'green' | 'orange'
  icon: React.ReactNode
}

function EmotionalMetricBar({ label, value, color, icon }: EmotionalMetricBarProps) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  }

  const iconColorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={iconColorClasses[color]}>{icon}</span>
          <span className="ios-caption1 text-gray-700">{label}</span>
        </div>
        <span className="ios-caption1 font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
        />
      </div>
    </div>
  )
}

// ============================================
// Helper: Get badge icon
// ============================================

function getBadgeIcon(badgeId: string): string {
  const iconMap: Record<string, string> = {
    'first-lesson': '🌱',
    'module-master': '🛡️',
    'knowledge-seeker': '📚',
    'wisdom-keeper': '🦉',
    'week-warrior': '⚔️',
    'month-champion': '👑',
    'year-legend': '🏆',
    'boundary-guardian': '🛡️',
    'anxiety-warrior': '🧘',
    'mood-master': '😊',
    'practice-consistent': '💪',
    'helped-peer': '🤝',
    'perfect-quiz': '🎯',
    'early-bird': '🌅',
    'night-owl': '🦉',
  }
  return iconMap[badgeId] || '⭐'
}

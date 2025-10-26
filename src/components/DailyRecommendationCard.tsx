import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkle, Clock, Target, Star } from '@phosphor-icons/react'

interface DailyRecommendationCardProps {
  lessonTitle: string
  description: string
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  emotionalFit: 'perfect' | 'good' | 'okay'
  onStart: () => void
}

const difficultyConfig = {
  easy: { label: 'Легко', color: 'bg-green-100 text-green-700', icon: '🌱' },
  medium: { label: 'Средне', color: 'bg-yellow-100 text-yellow-700', icon: '⭐' },
  hard: { label: 'Сложно', color: 'bg-orange-100 text-orange-700', icon: '🔥' }
}

const emotionalFitConfig = {
  perfect: { label: 'Идеально для тебя сегодня!', icon: '💙' },
  good: { label: 'Хороший выбор', icon: '😊' },
  okay: { label: 'Может быть полезным', icon: '🤔' }
}

export default function DailyRecommendationCard({
  lessonTitle,
  description,
  duration,
  difficulty,
  emotionalFit,
  onStart
}: DailyRecommendationCardProps) {
  const diffConfig = difficultyConfig[difficulty]
  const emotionalConfig = emotionalFitConfig[emotionalFit]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative"
    >
      <Card className="relative overflow-hidden border-0 shadow-[0_12px_48px_rgba(139,92,246,0.15)]">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50" />
        
        {/* Animated Blobs */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.2, 0.3] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <CardContent className="relative p-4 sm:p-6">
          {/* Header with Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkle className="w-5 h-5 text-purple-600" weight="fill" />
                </motion.div>
                <span className="text-sm font-semibold text-purple-700">
                  Рекомендация дня
                </span>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl"
            >
              {emotionalConfig.icon}
            </motion.div>
          </div>

          {/* Lesson Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {lessonTitle}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            {description}
          </p>

          {/* Fit Badge */}
          <div className="bg-white/80 backdrop-blur rounded-lg px-3 py-2 mb-4 inline-block">
            <p className="text-sm font-medium text-purple-700">
              {emotionalConfig.label}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">{duration} мин</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${diffConfig.color}`}>
                {diffConfig.icon} {diffConfig.label}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-amber-600">
              <Star className="w-4 h-4" weight="fill" />
              <span>+100 XP</span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onStart}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg"
            >
              <Target className="w-4 h-4 mr-2" />
              Начать урок
            </Button>
          </motion.div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-center text-xs text-gray-600 italic"
          >
            "Каждый день маленький шаг к лучшей версии себя" ✨
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

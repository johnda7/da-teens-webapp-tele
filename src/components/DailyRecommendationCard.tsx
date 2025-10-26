import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkle, Clock, Target, Star } from '@phosphor-icons/react'
import type { LessonRecommendation } from '@/lib/adaptiveLearning'

interface DailyRecommendationCardProps {
  currentLesson?: LessonRecommendation | null
  onLessonComplete?: (score: number) => void
  isLoading?: boolean
}

export default function DailyRecommendationCard({
  currentLesson,
  onLessonComplete,
  isLoading = false
}: DailyRecommendationCardProps) {
  // Если нет текущего урока, показываем пустой компонент или placeholder
  if (!currentLesson) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Card className="relative overflow-hidden border-0 shadow-[0_12px_48px_rgba(139,92,246,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50" />
          
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <CardContent className="relative p-4 sm:p-6 text-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkle className="w-12 h-12 text-purple-600 mx-auto mb-3" weight="fill" />
            </motion.div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Загружаем рекомендацию дня...
            </h3>
            <p className="text-sm text-gray-600">
              Пройди check-in чтобы получить персональную рекомендацию 💙
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const { lesson, reason, emotionalFit, confidence } = currentLesson
  
  const emotionalConfig = {
    perfect: { label: 'Идеально для тебя!', icon: '💙' },
    good: { label: 'Хороший выбор', icon: '😊' },
    okay: { label: 'Может быть полезным', icon: '🤔' }
  }

  const emotionalData = emotionalConfig[emotionalFit as keyof typeof emotionalConfig] || emotionalConfig.good

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative"
    >
      <Card className="relative overflow-hidden border-0 shadow-[0_12px_48px_rgba(139,92,246,0.15)]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50" />
        
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
          {/* Header */}
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
              {emotionalData.icon}
            </motion.div>
          </div>

          {/* Lesson Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {lesson?.title || 'Урок дня'}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
            {reason || 'Персональная рекомендация на основе твоего эмоционального состояния'}
          </p>

          {/* Fit Badge */}
          <div className="bg-white/80 backdrop-blur rounded-lg px-3 py-2 mb-4 inline-block">
            <p className="text-sm font-medium text-purple-700">
              {emotionalData.label}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>10 мин</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-amber-600">
              <Star className="w-4 h-4" weight="fill" />
              <span>+100 XP</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              <span>{Math.round(confidence)}% совпадение</span>
            </div>
          </div>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onLessonComplete?.(100)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg disabled:opacity-50"
            >
              <Target className="w-4 h-4 mr-2" />
              {isLoading ? 'Загружаем...' : 'Начать урок'}
            </Button>
          </motion.div>

          {/* Quote */}
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

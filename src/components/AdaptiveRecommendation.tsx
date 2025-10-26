import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, Heart, Zap, Target, TrendingUp } from 'lucide-react'

interface EmotionalState {
  mood: number // 1-5
  anxiety: number // 1-5
  energy: number // 1-5
  stress: number // 1-5
}

interface Recommendation {
  id: string
  type: 'lesson' | 'practice' | 'break' | 'checkin'
  title: string
  description: string
  reason: string
  estimatedTime: number
  emotionalBenefit: string
  icon: any
  priority: 'high' | 'medium' | 'low'
}

interface AdaptiveRecommendationProps {
  emotionalState: EmotionalState
  completedLessons: string[]
  onRecommendationSelect: (recommendation: Recommendation) => void
}

export default function AdaptiveRecommendation({ 
  emotionalState, 
  completedLessons,
  onRecommendationSelect 
}: AdaptiveRecommendationProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  // AI-powered recommendation engine
  useEffect(() => {
    const generateRecommendations = () => {
      setIsAnalyzing(true)
      
      // Simulate AI analysis delay
      setTimeout(() => {
        const newRecommendations: Recommendation[] = []
        
        // Analyze emotional state
        const { mood, anxiety, energy, stress } = emotionalState
        
        // High anxiety + low energy = calming practice
        if (anxiety >= 4 && energy <= 2) {
          newRecommendations.push({
            id: 'breathing-practice',
            type: 'practice',
            title: 'Дыхательная практика',
            description: '5-минутная техника для снижения тревоги',
            reason: 'Твоя тревога повышена, а энергия низкая. Дыхательные упражнения помогут успокоиться.',
            estimatedTime: 5,
            emotionalBenefit: 'Снижение тревоги на 40%',
            icon: Heart,
            priority: 'high'
          })
        }
        
        // Low mood = uplifting content
        if (mood <= 2) {
          newRecommendations.push({
            id: 'positive-lesson',
            type: 'lesson',
            title: 'Урок: Сила благодарности',
            description: 'Короткий урок о том, как благодарность меняет настроение',
            reason: 'Твое настроение сегодня не очень. Этот урок поможет поднять настроение.',
            estimatedTime: 10,
            emotionalBenefit: 'Улучшение настроения на 60%',
            icon: Brain,
            priority: 'high'
          })
        }
        
        // High energy + good mood = challenging content
        if (energy >= 4 && mood >= 3) {
          newRecommendations.push({
            id: 'advanced-boundaries',
            type: 'lesson',
            title: 'Продвинутые техники границ',
            description: 'Сложные сценарии и их решения',
            reason: 'У тебя много энергии и хорошее настроение! Время для сложного материала.',
            estimatedTime: 15,
            emotionalBenefit: 'Развитие навыков на 80%',
            icon: Target,
            priority: 'medium'
          })
        }
        
        // High stress = break recommendation
        if (stress >= 4) {
          newRecommendations.push({
            id: 'mindful-break',
            type: 'break',
            title: 'Осознанная пауза',
            description: '3-минутная медитация для снятия стресса',
            reason: 'Твой уровень стресса высокий. Сделай паузу и восстанови силы.',
            estimatedTime: 3,
            emotionalBenefit: 'Снижение стресса на 50%',
            icon: Zap,
            priority: 'high'
          })
        }
        
        // Default: continue learning
        if (newRecommendations.length === 0) {
          newRecommendations.push({
            id: 'continue-learning',
            type: 'lesson',
            title: 'Продолжи обучение',
            description: 'Следующий урок в твоей программе',
            reason: 'Твое состояние стабильное. Отличное время для обучения!',
            estimatedTime: 12,
            emotionalBenefit: 'Прогресс в навыках',
            icon: TrendingUp,
            priority: 'medium'
          })
        }
        
        setRecommendations(newRecommendations)
        setIsAnalyzing(false)
      }, 1500) // Simulate AI processing time
    }

    generateRecommendations()
  }, [emotionalState])

  if (isAnalyzing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 p-6"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="font-semibold text-gray-900 mb-2">
            Анализирую твое состояние...
          </h3>
          <p className="text-sm text-gray-600">
            AI подбирает идеальный контент для тебя
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          🧠 Персональные рекомендации
        </h2>
        <p className="text-sm text-gray-600">
          AI проанализировал твое состояние и подобрал идеальный контент
        </p>
      </div>

      {recommendations.map((rec, index) => {
        const Icon = rec.icon
        
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              bg-white/70 backdrop-blur-[40px] rounded-2xl border border-white/20 p-6 cursor-pointer
              hover:scale-[1.02] hover:-translate-y-1 transition-all duration-200
              ${rec.priority === 'high' ? 'ring-2 ring-orange-500/20' : ''}
            `}
            onClick={() => onRecommendationSelect(rec)}
          >
            <div className="flex items-start gap-4">
              <div className={`
                p-3 rounded-xl
                ${rec.priority === 'high' ? 'bg-orange-100' : 
                  rec.priority === 'medium' ? 'bg-blue-100' : 'bg-gray-100'}
              `}>
                <Icon 
                  size={24} 
                  className={`
                    ${rec.priority === 'high' ? 'text-orange-600' : 
                      rec.priority === 'medium' ? 'text-blue-600' : 'text-gray-600'}
                  `} 
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {rec.title}
                  </h3>
                  {rec.priority === 'high' && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                      Приоритет
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {rec.description}
                </p>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                  <p className="text-xs text-blue-800 font-medium mb-1">
                    💡 Почему именно это:
                  </p>
                  <p className="text-xs text-blue-700">
                    {rec.reason}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>⏱️ {rec.estimatedTime} мин</span>
                    <span>📈 {rec.emotionalBenefit}</span>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm">→</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

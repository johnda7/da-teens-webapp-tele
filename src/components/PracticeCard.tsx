// Practice Card - упражнения и практики
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  Lightning, 
  Clock, 
  CheckCircle,
  Target,
  Brain
} from '@phosphor-icons/react'

interface PracticeCardProps {
  title: string
  description: string
  estimatedTime: number // минуты
  xpReward: number // 50-100 XP
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'reflection' | 'roleplay' | 'mindfulness' | 'exercise'
  isCompleted?: boolean
  onStart: () => void
}

export default function PracticeCard({
  title,
  description,
  estimatedTime,
  xpReward,
  difficulty,
  type,
  isCompleted = false,
  onStart
}: PracticeCardProps) {
  
  const typeConfig = {
    reflection: { icon: Brain, label: 'Рефлексия', color: 'purple' },
    roleplay: { icon: Target, label: 'Ролевая игра', color: 'blue' },
    mindfulness: { icon: Brain, label: 'Осознанность', color: 'indigo' },
    exercise: { icon: Lightning, label: 'Упражнение', color: 'orange' }
  }
  
  const difficultyConfig = {
    easy: { label: 'Легко', color: 'bg-green-100 text-green-700 border-green-200' },
    medium: { label: 'Средне', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    hard: { label: 'Сложно', color: 'bg-red-100 text-red-700 border-red-200' }
  }
  
  const config = typeConfig[type]
  const Icon = config.icon
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="relative overflow-hidden bg-white/70 backdrop-blur-[40px] border-purple-100/50 shadow-ios-soft">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-purple-50/20 pointer-events-none" />
        
        <div className="relative p-6">
          {/* Header with icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-${config.color}-100 flex items-center justify-center flex-shrink-0`}>
              <Icon size={24} className={`text-${config.color}-600`} weight="fill" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`ios-caption2 bg-${config.color}-50 text-${config.color}-700 border-${config.color}-200`}>
                  {config.label}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-600 text-white ios-caption2 border-0">
                    <CheckCircle size={12} weight="fill" />
                  </Badge>
                )}
              </div>
              <h3 className="ios-headline text-gray-900">
                {title}
              </h3>
            </div>
          </div>
          
          {/* Description */}
          <p className="ios-caption1 text-gray-600 mb-4">
            {description}
          </p>
          
          {/* Meta info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5 ios-caption1 text-gray-600">
              <Clock size={14} />
              <span>~{estimatedTime} мин</span>
            </div>
            
            <Badge variant="outline" className={`ios-caption2 ${difficultyConfig[difficulty].color}`}>
              {difficultyConfig[difficulty].label}
            </Badge>
            
            <div className="flex items-center gap-1.5 ios-caption1 text-orange-600 font-medium">
              <Lightning size={14} weight="fill" />
              <span>+{xpReward} XP</span>
            </div>
          </div>
          
          {/* Start button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button 
              onClick={onStart}
              className={`
                w-full h-[44px] ios-body-emphasized rounded-xl shadow-ios-soft gap-2
                ${isCompleted 
                  ? 'bg-white/70 backdrop-blur-[20px] text-gray-900 border border-gray-200 hover:bg-white/90' 
                  : 'bg-orange-600 text-white hover:bg-orange-700'
                }
              `}
              variant="ghost"
            >
              {isCompleted ? (
                <>
                  <CheckCircle size={18} weight="fill" />
                  Пересмотреть практику
                </>
              ) : (
                <>
                  <Lightning size={18} weight="fill" />
                  Начать практику
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}
